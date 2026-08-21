export interface Poli {
  id: string;
  name: string;
  category: string;
  icon: string;
  doctors_today: number;
  quota_remaining: number;
  quota_status: "available" | "full";
}

export interface PoliListResponse {
  data: Poli[];
}
