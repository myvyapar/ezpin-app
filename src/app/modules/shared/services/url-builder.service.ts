import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './storage/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class UrlBuilderService {
  private baseUrl: string;

  constructor(private localStorageService: LocalStorageService) {}

  urlBuild(...uris): string {
    this.baseUrl =  environment.baseUrl;
    return `${this.baseUrl}/${uris.join('/')}/`;
  }
}
