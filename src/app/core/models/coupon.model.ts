export interface Coupon {
  id: number;
  bundle_id: number;
  code: string;
  discount_amount: number;
  receiver_name : string | null;
  receiver_email : string | null;
  send_date : string | null;
  send_immediately : boolean;
  expires_at: string | null;
  is_used:boolean;
  is_expired: boolean;
  subscribed: boolean;
  email_sent_at: string | null;
  last_sent_at: string | null;
  created_at: string;
}
