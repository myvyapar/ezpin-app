export interface Category {
  id: number;
  name: string;
  avatar: string;
  children: Child[];
}

interface Child {
  id: number;
  name: string;
  avatar: string;
  children: any[];
}