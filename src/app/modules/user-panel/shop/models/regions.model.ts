import { Pagination } from '../../../shared/models/pagination.model'; 

export interface Regions extends Pagination {
  results: Region[];
}

export interface Region {
  id: number;
  name: string;
  code: string;
  phone_prefix: string;
  image: string;
}