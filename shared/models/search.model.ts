import { ApiResponse } from './api.model';

export interface SearchRequestPayload {
  query: string;
}

export interface SearchResponse extends ApiResponse {
  data?: string[];
}
