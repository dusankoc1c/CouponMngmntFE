export interface Bundle {
  id: number;
  store_id: number;
  name: string;
  description: string | null;
  expires_at: number;
  number_of_codes: number;
  total_value : number;
  created_at: string;
}
