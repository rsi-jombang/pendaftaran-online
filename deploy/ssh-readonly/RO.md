# Akses Read-Only ke Server RS (`roagent`)

Dokumen ini berisi langkah-langkah untuk membuat user SSH khusus `roagent` yang **hanya bisa menjalankan perintah read-only** di server `192.168.0.2` (port `3311`). Akses ini digunakan untuk observasi dan verifikasi; **semua perubahan/modifikasi tetap dijalankan oleh Anda secara manual**.

## Arsitektur

```
Laptop (saya)                        Server RS 192.168.0.2:3311
  ssh rsi-ro "CMD"  ──────────►  sshd
                                   └─ roagent (shell=/bin/false, BUKAN group docker)
                                      authorized_keys:
                                        command="/usr/local/bin/ssh-readonly",restrict,...
                                              │
                                              ▼
                                   ssh-readonly (root, 0755) — allowlist regex
                                              │
         ┌───────────────────┬───────────────┴───────────────┐
         ▼                                       ▼
  file reads (cat/grep/…)      sudo NOPASSWD → rodig (root)
  (tolak *.env)                hanya docker exec read-only
         │                               │
         │                       sql: SELECT|SHOW|DESCRIBE|EXPLAIN saja
         │                       phpl: php -v|-m|-l  (dalam /var/www)
         │                       artl: route:list|--version|about
         │
         └── curl GET ke 127.0.0.1:80 / :3001 (read-only)
```

## Batasan yang disengaja
- `rodig sql` **tidak menerima** string literal ber-kutip, tanda `;`, atau `--` → cukup untuk `SELECT`/`SHOW` diagnosa. Query kompleks ANDA jalankan manual.
- Nama kontainer docker di-validate charset `[a-z0-9_.-]` — cek dulu lewat `rodig ps`.
- `curl` hanya boleh ke `127.0.0.1` (port 80 atau 3001), GET-only.
- `.env` dilarang dibaca oleh `roagent`; `storage/logs/laravel.log` **diizinkan** (berisi data NIK/pasien pada pesan error, untuk debugging).

## Pencabutan (revoke)
```bash
sudo rm /home/roagent/.ssh/authorized_keys
# atau hapus user beserta config:
sudo userdel -r roagent
sudo rm /etc/sudoers.d/rodig-readonly /usr/local/bin/rodig /usr/local/bin/ssh-readonly
```

---

## Bagian A — Windows (laptop)

### A1. Generate kunci SSH khusus (PowerShell)
```powershell
ssh-keygen -t ed25519 -f "$env:USERPROFILE\.ssh\rsi_readonly" -N ""
```

### A2. Tampilkan public key (hasilnya nanti dipakai di Bagian B4)
```powershell
Get-Content "$env:USERPROFILE\.ssh\rsi_readonly.pub"
```
Salin seluruh output `ssh-ed25519 AAAA… roagent` (satu baris) ke notepad.

### A3. Tambah entry SSH config (PowerShell)
```powershell
Add-Content "$env:USERPROFILE\.ssh\config" @"

Host rsi-ro
    HostName 192.168.0.2
    Port 3311
    User roagent
    IdentityFile $($env:USERPROFILE -replace '\\','/')/.ssh/rsi_readonly
    StrictHostKeyChecking accept-new
"@
```
Cek hasil: `Get-Content "$env:USERPROFILE\.ssh\config"`.

---

## Bagian B — Server (SSH dulu sebagai `simrs-rsijombang`)

### B1. Buat user `roagent` (shell dinonaktifkan)
```bash
sudo useradd -m -s /bin/false roagent
sudo mkdir -p /home/roagent/.ssh
sudo touch /home/roagent/.ssh/authorized_keys
sudo chown -R roagent:roagent /home/roagent/.ssh
sudo chmod 700 /home/roagent/.ssh
sudo chmod 600 /home/roagent/.ssh/authorized_keys
```

### B2. Pasang script `rodig`
> Satu-satunya jembatan `docker exec` read-only. Milik root.
```bash
sudo tee /usr/local/bin/rodig >/dev/null <<'RODIG_EOF'
#!/bin/bash
set -eu
shopt -s nocasematch
sub="${1:-}"
dua(){ echo "denied: $*" >&2; exit 1; }
case "$sub" in
  ps)
    shift
    case "${1:-}" in
      ""|-a|--all) docker ps ${1:+-a} ;;
      *) dua "rodig ps arg '$1'" ;;
    esac ;;
  logs)
    [ $# -eq 3 ] || dua "usage: rodig logs <n> <container>"
    [[ "$2" =~ ^[0-9]+$ ]] || dua "tail bukan angka"
    [[ "$3" =~ ^[a-z0-9_.-]+$ ]] || dua "nama kontainer invalid"
    docker logs --tail "$2" "$3" ;;
  inspect)
    [ $# -eq 2 ] || dua "usage: rodig inspect <container>"
    [[ "$2" =~ ^[a-z0-9_.-]+$ ]] || dua "nama kontainer invalid"
    docker inspect "$2" ;;
  sql)
    [ $# -ge 2 ] || dua "usage: rodig sql <SELECT|SHOW|DESCRIBE|EXPLAIN ...>"
    shift
    sql=$(IFS=' '; echo "$*")
    [[ "$sql" =~ ^(SELECT|SHOW|DESCRIBE|EXPLAIN)[[:space:]] ]] || dua "query harus SELECT/SHOW/DESCRIBE/EXPLAIN"
    [[ "$sql" =~ (;|--|/\*|into[[:space:]]+outfile|#|update|delete|drop|alter|create|grant|revoke|truncate|rename|merge) ]] && dua "keyword terlarang"
    [[ "$sql" =~ ^[A-Za-z0-9_][A-Za-z0-9_ .(),*+=:\%-]*$ ]] || dua "karakter invalid"
    sql="${sql};"
    docker exec mysql57 mysql -N -e "$sql" ;;
  phpl)
    [ $# -eq 3 ] || dua "usage: rodig phpl php -v|-m|-i|-l <file>"
    case "$2" in
      -v|-m|-i) docker exec php74-fpm php "$2" ;;
      -l) [[ "$3" =~ ^/var/www/[A-Za-z0-9_./-]+$ ]] || dua "path -l invalid"
          docker exec php74-fpm php -l "$3" ;;
      *) dua "flag php '$2'";;
    esac ;;
  artl)
    [ $# -ge 2 ] || dua "usage: rodig artl <artisan-arg>"
    shift
    case "$1" in
      --version|about|route:list|list) docker exec -w /var/www/pendaftaran-online/rest-api php74-fpm php artisan "$@" ;;
      *) dua "hanya artisan baca (route:list dsb)";;
    esac ;;
  *) dua "sub '$sub' tidak dikenal" ;;
esac
RODIG_EOF
sudo chown root:root /usr/local/bin/rodig
sudo chmod 0755 /usr/local/bin/rodig
```

### B3. Pasang gate `ssh-readonly`
> Allowlist perintah yang boleh dijalankan `roagent`.
```bash
sudo tee /usr/local/bin/ssh-readonly >/dev/null <<'GATE_EOF'
#!/bin/bash
CMD="$SSH_ORIGINAL_COMMAND"
deny(){ logger -t ssh-readonly "DENY:$CMD" 2>/dev/null || true; echo "denied (read-only): $CMD" >&2; exit 1; }
[ -n "$CMD" ] || deny
IFS=' ' read -r -a A <<< "$CMD"

if [ "${A[0]}" = "rodig" ]; then
  [[ "${A[*]:1}" =~ ^[A-Za-z0-9_ ./()=,:+*\:%-]+$ ]] || deny
  exec sudo -n /usr/local/bin/rodig "${A[@]:1}"
fi

case "${A[0]}" in
  cat)  [[ "$CMD" =~ ^cat\ /[A-Za-z0-9_./:+=-]+$ ]] || deny
        p="${A[1]}"; [[ "${p,,}" != *".env"* ]] || { echo "denied (.env dilindungi)" >&2; exit 1; }
        exec cat -- "$p" ;;
  ls)   [[ "$CMD" =~ ^ls(\ -l|\ -la|\ -1|\ -a)?( /[A-Za-z0-9_./:+=-]+)?$ ]] || deny
        exec ls "${A[@]:1}" ;;
  grep) [[ "$CMD" =~ ^grep(\ (-E|-i|-Ei|-e))?[[:space:]][A-Za-z0-9_/=:()\-+~?*.%]+[[:space:]]/[A-Za-z0-9_./:+=-]+$ ]] || deny
        last="${A[$((${#A[@]}-1))]}"
        [[ "${last,,}" != *".env"* ]] || { echo "denied (.env dilindungi)" >&2; exit 1; }
        exec grep "${A[@]:1}" ;;
  tail) [[ "$CMD" =~ ^tail\ -n\ [0-9]+\ /[A-Za-z0-9_./:+=-]+$ ]] || deny; exec "${A[@]}" ;;
  head) [[ "$CMD" =~ ^head\ -n\ [0-9]+\ /[A-Za-z0-9_./:+=-]+$ ]] || deny; exec "${A[@]}" ;;
  wc)   [[ "$CMD" =~ ^wc\ -l\ /[A-Za-z0-9_./:+=-]+$ ]] || deny; exec "${A[@]}" ;;
  ss)   [[ "$CMD" =~ ^ss\ -[a-z]+$ ]] || deny; exec "${A[@]}" ;;
  getent) [[ "$CMD" =~ ^getent\ hosts\ [A-Za-z0-9._-]+$ ]] || deny; exec "${A[@]}" ;;
  hostname) [[ "$CMD" =~ ^hostname\ -I$ ]] || deny; exec "${A[@]}" ;;
  curl) [[ "$CMD" =~ ^curl\ -s\ -m\ 5\ http://127\.0\.0\.1(:80|:3001)?/[A-Za-z0-9_/?=&.:%-]*$ ]] || deny; exec "${A[@]}" ;;
  *) deny ;;
esac
GATE_EOF
sudo chown root:root /usr/local/bin/ssh-readonly
sudo chmod 0755 /usr/local/bin/ssh-readonly
```

### B4. Sudoers → izinkan `roagent` memakai `rodig` tanpa password
```bash
sudo tee /etc/sudoers.d/rodig-readonly >/dev/null <<'SUDO_EOF'
roagent ALL=(root) NOPASSWD: /usr/local/bin/rodig
Defaults:roagent !requiretty
SUDO_EOF
sudo chmod 0440 /etc/sudoers.d/rodig-readonly
sudo visudo -c
```
Harus keluar: `/etc/sudoers.d/rodig-readonly: parsed OK`.

### B5. Pasang public key
Ganti `PASTE_YOUR_PUBKEY_HERE` dengan hasil **A2**.
```bash
sudo nano /home/roagent/.ssh/authorized_keys
```
Tempel satu baris:
```
command="/usr/local/bin/ssh-readonly",restrict,no-agent-forwarding,no-port-forwarding,no-pty,no-X11-forwarding,no-user-rc PASTE_YOUR_PUBKEY_HERE roagent
```
Simpan (Ctrl+O, Enter, Ctrl+X).

---

## Bagian C — Uji (dari PowerShell Windows)

### Harus SUKSES
```powershell
ssh rsi-ro "rodig ps"
ssh rsi-ro "rodig sql SHOW TABLES FROM rsi_jombang"
ssh rsi-ro "rodig logs 10 pendaftaran-online-rest_api"
ssh rsi-ro "cat /opt/docker-server-rsi/apache/conf/000-default.conf"
ssh rsi-ro "curl -s -m 5 http://127.0.0.1/wa-blas-status"
```

### Harus DITOLAK (balik `denied`)
```powershell
ssh rsi-ro "cat /opt/docker-server-rsi/www/pendaftaran-online/rest-api/.env"
ssh rsi-ro "rodig sql DROP TABLE rsi_jombang.antrians"
ssh rsi-ro "sed -i s/x/y/ /opt/docker-server-rsi/apache/conf/000-default.conf"
ssh rsi-ro "docker exec mysql57 rm -rf /"
```

Kalau ada yang lolos di bagian kedua, kirim ke saya karena ada celah regex.

---

## Selanjutnya setelah lolos uji
1. Lanjutkan verifikasi sinkronisasi `WA_API_KEY` yang sempat tertunda (status 401) — saya bisa baca log via `rsi-ro`, perubahannya tetap Anda jalankan.
2. Arsipkan dokumen ini ke `deploy/ssh-readonly/RO.md` (sudah ada di sini).
