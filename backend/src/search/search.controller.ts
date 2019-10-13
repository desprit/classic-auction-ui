import { Controller, Post, Body } from '@nestjs/common';

import {
  SearchRequestPayload,
  SearchResponse,
} from '../../../shared/models/search.model';

@Controller('search')
export class SearchController {
  @Post()
  async upload(@Body() payload: SearchRequestPayload): Promise<SearchResponse> {
    console.log(payload);
    return {
      success: true,
      data: [],
    };
  }
}
