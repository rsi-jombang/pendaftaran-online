# WA Blas — whatsapp-web.js gateway

Gateway WA untuk notifikasi pendaftaran poli (fire-and-forget, delay 3s).

## Dev Windows
```
cd wa-blas
npm i
npm run dev
# buka http://localhost:3001/qr atau /qr-image untuk scan QR nomor existing
# cek status: http://localhost:3001/status
```

## Prod Docker
Volume `.wwebjs_auth` dipersist biar tidak scan ulang.
```
docker compose up -d wa-blas
# scan QR via http://server:3001/qr
```

## API
- `GET /status` → `{ready, hasQr}`
- `GET /qr` → `{qr: dataURL}` atau `GET /qr-image` → PNG
- `POST /send` header `X-API-KEY` body `{to: "0812...", message: "..."}` → delay 3000ms → `client.sendMessage`

Env `WA_API_KEY` harus sama dengan `rest-api/.env` `WA_API_KEY`, `WA_GATEWAY_URL` di Laravel.
