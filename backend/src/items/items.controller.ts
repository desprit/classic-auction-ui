import { Controller, Post, Body, Get, Param, Query, Res } from '@nestjs/common';

import { tedis } from '../database/index';

import {
  SearchRequestPayload,
  SearchResponse,
  BuyingListResponse,
} from '../shared/models/item.model';
import { ApiResponse } from '../shared/models/api.model';
import { ItemsService } from './items.service';
import { PAGE_SIZE } from '../shared/config';

const QUERY_RESULTS_TTL = 60 * 60 * 10; // 10 hours

@Controller('items')
export class ItemsController {
  constructor(private itemsService: ItemsService) {}

  @Get('updated-time')
  async getUpdateTime(): Promise<ApiResponse> {
    const updatedAt = await tedis.get('latest-update');
    return {
      success: true,
      data: Number(updatedAt) * 1000,
    };
  }
  @Get('autocomplete')
  async getSuggestions(@Query('query') query: string): Promise<ApiResponse> {
    const suggestions = await this.itemsService.getSuggestions(query);
    return {
      success: true,
      data: suggestions,
    };
  }
  @Get('buying')
  async getBuyingList(
    @Query('page') page: string,
    @Query('query') query: string,
  ): Promise<BuyingListResponse> {
    const offset = page ? parseInt(page) * PAGE_SIZE : 0;
    const { totalItems, items } = await this.itemsService.getBuyingList(
      query,
      offset,
    );
    return {
      success: true,
      data: { items, totalItems },
    };
  }
  @Get()
  async getItems(
    @Query('page') page: string,
    @Query('onlyLatest') onlyLatest: string,
  ): Promise<SearchResponse> {
    const offset = page ? parseInt(page) * PAGE_SIZE : 0;
    const itemsData = [];
    const latestScan = Number(await tedis.get('latest-update'));
    const queryId = `database-${latestScan}-${offset}`;
    const existingResults = await tedis.get(queryId);
    if (existingResults) {
      const data = JSON.parse(existingResults.toString());
      if (data.items && data.items.length > 0) {
        return {
          success: true,
          data,
        };
      }
    }
    const searchFrom = onlyLatest ? latestScan.toString() : '-inf';
    const searchTo = onlyLatest ? latestScan.toString() : '+inf';
    const items = await tedis.zrangebyscore('ah-items', searchFrom, searchTo, {
      withscores: 'WITHSCORES',
    });
    const totalItems = Object.keys(items).length;
    for (let info of Object.keys(items).slice(offset, offset + PAGE_SIZE)) {
      if (!info) break;
      let [itemId, count, bid, buyout] = info.split('||');
      const name = await tedis.hget('id-name-map', itemId);
      if (!name) {
        continue;
      }
      const infoObject = {
        name,
        itemId,
        icon: `items/icons/${itemId}`,
        count: parseInt(count),
        bidPerUnit: Math.floor(parseInt(bid) / parseInt(count)),
        buyoutPerUnit: Math.floor(parseInt(buyout) / parseInt(count)),
        bid: parseInt(bid),
        buyout: parseInt(buyout),
        updatedAt: Number(items[info]) * 1000,
      };
      itemsData.push(infoObject);
    }
    await tedis.setex(
      queryId,
      QUERY_RESULTS_TTL,
      JSON.stringify({ totalItems, items: itemsData }),
    );
    return {
      success: true,
      data: {
        totalItems,
        items: itemsData,
      },
    };
  }
  @Post()
  async searchItem(
    @Body() payload: SearchRequestPayload,
  ): Promise<SearchResponse> {
    console.log(payload);
    return {
      success: true,
      data: { items: [], totalItems: 0 },
    };
  }

  @Get('icons/:imgName')
  test(@Param('imgName') imgPath, @Res() res) {
    const imgName = imgPath.split('items/icons/').slice(-1)[0];
    const imgFullPath = `/data/need-more-gold/items/${imgName}.png`;
    return res.sendFile(imgFullPath);
  }
}
