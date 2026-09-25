export interface User {
  id: string;
  name: string;
  email: string;
  role: string[];
  created_at?: string;  // nije nullable nego moze da uopste ne postoji
}
