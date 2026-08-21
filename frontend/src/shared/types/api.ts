export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
