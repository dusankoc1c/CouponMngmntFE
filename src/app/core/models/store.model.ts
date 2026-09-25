export interface Store {
  id: number;
  name: string;
  description: string | null;
  value_limit: number | null;
  reminder_days: number | null;
  created_at: string;
}
