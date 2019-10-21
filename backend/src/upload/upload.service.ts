import { Injectable } from '@nestjs/common';

import { tedis } from '../database/index';

// An item or a stack of items
interface characterItem {
  itemId: string;
  count: number;
  name: string;
}

@Injectable()
export class UploadService {
  public getCharacterNames(content: string): string[] {
    const re = /^\t\t\[\"(.*?)\"\]/gm;
    const names: string[] = [];
    let name = re.exec(content);
    while (name != null) {
      names.push(name[1]);
      name = re.exec(content);
    }
    return names;
  }

  public async getCharacterItems(
    content: string,
    names: string[],
  ): Promise<characterItem[]> {
    const items = {};
    const itemIds: string[] = [];
    for (let i in names) {
      items[names[i]] = {};
      const characterContent = content
        .split(names[i])
        .slice(1)
        .join()
        .split('"equip"')[0];
      const re = /\"(\d+?:.+?)\"/gm;
      let item = re.exec(characterContent);
      while (item != null) {
        let count: number;
        const itemRow = item[1];
        const itemId = itemRow.split(':')[0];
        itemIds.push(itemId);
        if (itemRow.includes(';')) {
          count = parseInt(itemRow.split(';').slice(1)[0]);
        } else {
          count = 1;
        }
        items[names[i]][itemId] = (items[names[i]][itemId] || 0) + count;
        item = re.exec(characterContent);
      }
    }
    // @ts-ignore
    const itemNames = await tedis.hmget('id-name-map', ...itemIds);
    // A map between item ids and names
    const itemIdsNamesMap = itemIds.reduce(
      (obj, k, i) => ({ ...obj, [k]: itemNames[i] }),
      {},
    );
    const itemsList = [];
    for (let name of Object.keys(items)) {
      for (let itemId of Object.keys(items[name])) {
        itemsList.push({
          itemId,
          count: items[name][itemId],
          name: itemIdsNamesMap[itemId],
        });
      }
    }
    return itemsList;
  }

  public getCharactersGold(content: string) {
    let totalGold = 0;
    const re = /\[\"money\"\] = (\d+),/gm;
    let item = re.exec(content);
    while (item != null) {
      const characterGold = parseInt(item[1]);
      totalGold += characterGold;
      item = re.exec(content);
    }
    return totalGold;
  }

  public getAuctionItems(content: string): string[] {
    const re = /\[\"([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})\"\] = \"(.*?)\",/g;
    const items = [];
    let item = re.exec(content);
    while (item != null) {
      items.push(item[2]);
      item = re.exec(content);
    }
    return items;
  }

  public async processAuctionItems(
    items: string[],
    updatedAt: number,
  ): Promise<void> {
    const nameIdMap = await tedis.hgetall('name-id-map');
    for (const item of items) {
      let [name, count, quality, minBid, buyout] = item.split('||');
      if (name === '\\' || name === '') continue;
      let itemId = nameIdMap[name];
      if (!itemId) {
        name = name.split(' of ')[0];
        itemId = nameIdMap[name];
        if (!itemId) {
          continue;
        }
      }
      const fullItem = `${itemId}||${count}||${minBid}||${buyout}`;
      await tedis.zadd('ah-items', { [fullItem]: updatedAt });
      await tedis.hset('qualities', itemId, quality);
      await tedis.sadd('all-items-ids', itemId);
      await tedis.sadd('all-items-names', name);
    }
  }

  public getUpdatedTime(content: string) {
    const re = /AUCTIONATOR_LAST_SCAN_TIME = (\d+)/g;
    const timestamp = re.exec(content);
    while (timestamp != null) {
      return timestamp[1];
    }
  }

  public async processAuctionatorFile(file) {
    const content = file.buffer.toString();
    const items = this.getAuctionItems(content);
    const updatedAt = Number(this.getUpdatedTime(content));
    await this.processAuctionItems(items, updatedAt);
    const currentUpdateTime = Number(await tedis.get('latest-update'));
    if (updatedAt > currentUpdateTime) {
      await tedis.set('latest-update', updatedAt.toString());
    }
  }

  public async processBagbrotherFile(file) {
    const content = file.buffer.toString();
    const names = this.getCharacterNames(content);
    const items = await this.getCharacterItems(content, names);
    const totalGold = this.getCharactersGold(content);
    return { items, totalGold };
  }
}
