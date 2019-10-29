import { Injectable } from '@angular/core';

import { ApiService } from 'app/shared/services/api.service';
import { WowBuyingItem } from '../../../../../backend/src/shared/models/item.model';
import { PAGE_SIZE } from '../../../../../backend/src/shared/config';

@Injectable({
  providedIn: 'root'
})
export class BuyingService {
  public selectedQuality: string;
  public selectedStrategy: string;
  public selectedItemsType: string;
  public currentQuery: string;
  public currentPage: number;
  public items: WowBuyingItem[];
  public totalItems: number;
  public pageSize: number = PAGE_SIZE;
  public suggestions: string[];
  public searchValue: string;

  constructor(private apiService: ApiService) {}

  public getBuyingList() {
    this.apiService
      .getBuyingList(this.currentQuery, this.currentPage)
      .subscribe(resp => {
        this.items = resp.items;
        this.totalItems = resp.totalItems;
      });
  }

  public getItemsHistory(itemId: string) {
    return this.apiService.getItemHistory(itemId);
  }

  public autocomplete(query: string) {
    this.currentQuery = query;
    return this.apiService.getSuggesntions(query);
  }
}
