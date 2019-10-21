import { Injectable } from '@angular/core';
import { ApiService } from 'app/shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(private apiService: ApiService) {}

  public getItems(page: number, onlyLatest: boolean) {
    return this.apiService.getItems(page, onlyLatest);
  }
}