import { Injectable } from '@nestjs/common';

import { tedis } from '../database/index';
import { WowBuyingItem } from '@/shared/models/item.model';
import { PAGE_SIZE, QUERY_RESULTS_TTL } from '../shared/config';
import { filterOutliers, sortByProperty } from '../shared/utils';

@Injectable()
export class ItemsService {
  /**
   * Return suggestions for a given query
   */
  public async getSuggestions(query: string) {
    const suggestions = await tedis.zrangebylex(
      'all-items-names',
      `[${query}`,
      `[${query}\xff`,
    );
    return suggestions;
  }

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
      dbItems = await tedis.zrangebyscore('ah-items-by-score', fromTo, fromTo);
      dbItems = dbItems.filter((dbItem: string) => {
        return dbItem.startsWith(filterValue);
      });
    } else {
      dbItems = await tedis.zrangebyscore('ah-items-by-score', fromTo, fromTo);
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

  public groupItemsById(items) {
    const groupedItems = items.reduce((a, b) => {
      a[b.itemId] = a[b.itemId] || [];
      a[b.itemId].push(b);
      return a;
    }, Object.create(null));
    const itemsWithNested = [];
    for (let itemId of Object.keys(groupedItems)) {
      const groupItems = groupedItems[itemId];
      sortByProperty(groupItems, 'profit', true);
      const withHighestProfit = groupItems[0];
      withHighestProfit.nested = groupItems.slice(1, groupItems.length);
      itemsWithNested.push(withHighestProfit);
    }
    return itemsWithNested;
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
        'ah-items-by-lex',
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
      const buyoutsFiltered =
        buyouts.length >= 3 ? filterOutliers(buyouts) : buyouts;
      if (buyoutsFiltered.length === 0) continue;
      const sumBuyouts = buyoutsFiltered.reduce(function(a, b) {
        return a + b;
      });
      const avgBuyout = sumBuyouts / buyoutsFiltered.length;
      for (let item of itemsMap[k]) {
        const buyout = item.split('||')[3];
        if (!buyout || buyout === '0') continue;
        const count = parseInt(item.split('||')[1]);
        const buyoutPerOne = Math.floor(parseInt(buyout) / count);
        const profit = Math.floor(avgBuyout - buyoutPerOne);
        const ooo = {
          itemId,
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
    const itemsGrouped = this.groupItemsById(items);
    sortByProperty(itemsGrouped, 'profit', true);
    return {
      totalItems,
      items: itemsGrouped.slice(offset, offset + PAGE_SIZE),
    };
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

  public async getBuyoutHistory(itemId: string) {
    const items = await tedis.zrangebylex(
      'ah-items-by-lex',
      `[${itemId}||`,
      `[${itemId}||\xff`,
    );
    const itemsByDate = {};
    const itemObjects = [];
    const itemsByType = [];
    for (let item of items) {
      const count = Number(item.split('||')[1]);
      const buyout = Number(item.split('||')[3]);
      const updatedAt = Number(item.split('||')[4]);
      if (!(updatedAt in itemsByDate)) {
        itemsByDate[updatedAt] = [];
      }
      if (!buyout) continue;
      const itemObject = {
        count,
        buyout: Math.floor(buyout / count),
        updatedAt,
      };
      itemObjects.push(itemObject);
      itemsByDate[updatedAt].push(itemObject);
    }
    for (let timestamp of Object.keys(itemsByDate)) {
      const buyouts: number[] = itemsByDate[timestamp].map(
        itemInfo => itemInfo.buyout,
      );
      const buyoutsFiltered =
        buyouts.length >= 3 ? filterOutliers(buyouts) : buyouts;
      const counts: number[] = itemsByDate[timestamp].map(
        itemInfo => itemInfo.count,
      );
      if (!buyoutsFiltered.length || !counts.length) continue;
      const max = Math.max(...buyoutsFiltered);
      const min = Math.min(...buyoutsFiltered);
      const sumBuyouts = buyoutsFiltered.reduce(function(a, b) {
        return a + b;
      });
      const avg = Math.floor(sumBuyouts / buyoutsFiltered.length);
      const sumCounts = counts.reduce(function(a, b) {
        return a + b;
      });
      itemsByType.push({
        updatedAt: timestamp,
        max,
        min,
        avg,
        count: sumCounts,
      });
    }
    const itemObjectsSorted = sortByProperty(itemsByType, 'updatedAt');
    return itemObjectsSorted;
  }

  /**
   */
  public async getItemHistory(
    itemId: string,
    historyType: string,
  ): Promise<any> {
    switch (historyType) {
      case 'buyout':
        const history = this.getBuyoutHistory(itemId);
        return history;
      default:
        return [];
    }
  }
}
