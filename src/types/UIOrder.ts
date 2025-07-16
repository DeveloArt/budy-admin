export interface UIOrder {
  id?: string;
  status: string;
  total_price: number;
  created_at?: string;
  size: {
    id: string;
    name: string;
    price: number;
    dimensions: string;
  };
  additional_options: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  delivery_option: {
    id: string;
    name: string;
    base_price_desc: string;
  };
  payment_method: {
    id: string;
    name: string;
  };
  company_delivery_cost: number;
  contact_info: {
    city: string;
    email: string;
    notes: string | null;
    phone: string;
    address?: string;
    street?: string;
    house_number?: string;
    last_name: string;
    first_name: string;
    postal_code: string;
  };
}
