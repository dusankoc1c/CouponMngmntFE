export interface Store {
  id: number;
  name: string;
  description: string | null;
  value_limit: number | string | null;
  reminder_days: number | null;
  created_at: string;
}
