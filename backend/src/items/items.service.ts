import { Injectable } from '@nestjs/common';

import { tedis } from '../database/index';
import { WowAHItem, WowBuyingItem } from '@/shared/models/item.model';

const PAGE_SIZE = 15;
const QUERY_RESULTS_TTL = 60 * 60 * 10; // 10 hours

function compare(a, b) {
  if (a.profit > b.profit) {
    return -1;
  }
  if (a.profit < b.profit) {
    return 1;
  }
  return 0;
}

@Injectable()
export class ItemsService {
  /**
   * Save page of the buying list to Redis
   */
  public async saveBuyingListRedis(
    queryId: string,
    totalItems: number,
    items: WowBuyingItem[],
  ): Promise<void> {
    await tedis.setex(
      queryId,
      QUERY_RESULTS_TTL,
      JSON.stringify({ totalItems, items }),
    );
  }
  /**
   * Get page of the buying list from Redis
   */
  public async getFromRedis(
    queryId: string,
  ): Promise<null | { totalItems: number; items: WowBuyingItem[] }> {
    const existingList = await tedis.get(queryId);
    if (existingList) {
      const data = JSON.parse(existingList.toString());
      if (data.items && data.items.length > 0) {
        return data;
      }
    }
    return null;
  }

  /**
   * Get existing items from AH and group by itemId
   */
  public async getDbItems(
    query: string,
    latestScan: number,
  ): Promise<{ totalItems: number; itemsMap: { [key: string]: string[] } }> {
    const fromTo = latestScan.toString();
    const nameIdMap = await tedis.hgetall('name-id-map');
    let dbItems;
    if (query) {
      const itemId = nameIdMap[query];
      const filterValue = `${itemId}||`;
      dbItems = await tedis.zrangebyscore('ah-items', fromTo, fromTo);
      dbItems = dbItems.filter(dbItem => dbItem.startsWith(filterValue));
    } else {
      dbItems = await tedis.zrangebyscore('ah-items', fromTo, fromTo);
    }
    const totalItems = Object.keys(dbItems).length;
    const itemsMap = {};
    for (let k of dbItems) {
      const itemId = k.split('||')[0];
      if (itemsMap[itemId]) {
        itemsMap[itemId].push(k);
      } else {
        itemsMap[itemId] = [k];
      }
    }
    return { totalItems, itemsMap };
  }

  /**
   * Create a page of buying list
   */
  public async generateBuyingList(
    query: string,
    offset: number,
    latestScan: number,
  ): Promise<{ totalItems: number; items: WowBuyingItem[] }> {
    const idNameMap = await tedis.hgetall('id-name-map');
    const { totalItems, itemsMap } = await this.getDbItems(query, latestScan);
    const items = [];
    for (let k of Object.keys(itemsMap)) {
      const itemId = k;
      const olderItems = await tedis.zrangebylex(
        'ah-items',
        `[${itemId}||`,
        `[${itemId}||\xff`,
      );
      const buyouts = olderItems
        .map(i => {
          const count = parseInt(i.split('||')[1]);
          const buyout = i.split('||')[3];
          if (buyout) {
            return Math.floor(parseInt(buyout) / count);
          } else {
            return null;
          }
        })
        .filter(i => !!i);
      if (buyouts.length === 0) continue;
      const sumBuyouts = buyouts.reduce(function(a, b) {
        return a + b;
      });
      const avgBuyout = sumBuyouts / buyouts.length;
      for (let item of itemsMap[k]) {
        const buyout = item.split('||')[3];
        if (!buyout || buyout === '0') continue;
        const count = parseInt(item.split('||')[1]);
        const buyoutPerOne = Math.floor(parseInt(buyout) / count);
        const profit = Math.floor(avgBuyout - buyoutPerOne);
        const ooo = {
          icon: `items/icons/${itemId}`,
          name: idNameMap[itemId],
          count,
          buyout: parseInt(buyout),
          profit,
          profitPct: Math.floor((profit / parseInt(buyout)) * 100),
        };
        items.push(ooo);
      }
    }
    items.sort(compare);
    return { totalItems, items: items.slice(offset, offset + PAGE_SIZE) };
  }

  /**
   * Return a page of the buying list
   */
  public async getBuyingList(
    query: string,
    offset: number,
  ): Promise<{ totalItems: number; items: WowBuyingItem[] }> {
    const latestScan = Number(await tedis.get('latest-update'));
    const queryId = `buying-${latestScan}-${offset}`;
    // const cachedItems = await this.getFromRedis(queryId);
    // if (cachedItems) {
    //   return cachedItems;
    // }
    const { totalItems, items } = await this.generateBuyingList(
      query,
      offset,
      latestScan,
    );
    // await this.saveBuyingListRedis(queryId, totalItems, items);
    return { totalItems, items };
  }
}
