export interface Invoice {
  id: number;
  created_time: string;
  items: Item[];
  logo: string;
  custom_text_one: string;
  custom_text_two: string;
}

interface Item {
  name: string;
  card_number: string;
  pin_code: string;
  card_number_text?: any;
  pin_text?: any;
  show_pin: boolean;
  upc: number;
}