import { Pipe, PipeTransform } from '@angular/core';
import { convertToGold } from '../../../../../backend/src/shared/utils';

/**
 * Transforms a string into gold-formatted value
 * Example:
 * {{ '974912' | toGold }}
 * '97g 49s 12c'
 */
@Pipe({ name: 'toGold' })
export class StringToGoldPipe implements PipeTransform {
  addCoins(value: string) {
    const goldCoin = '<span class="gold-coin coin"></span>';
    const silverCoin = '<span class="silver-coin coin"></span>';
    const bronzeCoin = '<span class="bronze-coin coin"></span>';
    value = value.replace('g ', goldCoin);
    value = value.replace('s ', silverCoin);
    value = value.replace(/c$/, bronzeCoin);
    value = `<div class="price-wrapper">${value}</div>`;
    return value;
  }
  transform(valueAsNumber: number): string {
    const value = convertToGold(valueAsNumber);
    const valueWithIcons = this.addCoins(value);
    return valueWithIcons;
  }
}
