import { ApiResponse } from './api.model';

export interface WowAHItem {
  name: string;
  itemId: string;
  bidPerUnit: string;
  count: string;
  bid: string;
  buyoutPerUnit: string;
  buyout: string;
  updatedAt: string;
  icon?: string;
}

export interface WowBuyingItem {
  icon?: string;
  name: string;
  itemId: string;
  buyout: number;
  profit: number;
  profitPct: number;
}

export interface WowCharacterItem {
  name: string;
  itemId: string;
  count: number;
}

export interface SearchRequestPayload {
  query: string;
}

export interface SearchResponse extends ApiResponse {
  data: {
    items: WowAHItem[];
    totalItems: number;
  };
}

export interface BuyingListResponse extends ApiResponse {
  data: {
    items: WowBuyingItem[];
    totalItems: number;
  };
}
