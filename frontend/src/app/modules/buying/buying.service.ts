import { Injectable } from '@angular/core';

import { ApiService } from 'app/shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class BuyingService {
  constructor(private apiService: ApiService) {}

  public getBuyingList(query: string, page: number) {
    return this.apiService.getBuyingList(query, page);
  }
}
