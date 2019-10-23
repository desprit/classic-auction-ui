import { Pipe, PipeTransform } from '@angular/core';

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
    value = value.replace('g.', goldCoin);
    value = value.replace('s.', silverCoin);
    value = value.replace('c.', bronzeCoin);
    value = `<div class="price-wrapper">${value}</div>`;
    return value;
  }
  transform(valueAsNumber: number): string {
    let value = valueAsNumber.toString();
    const belowZero = value[0] === '-';
    const prefix = belowZero ? '-' : '';
    value = belowZero ? value.slice(1, value.length) : value;
    if (value.length <= 2) {
      if (value === '0') {
        return '-';
      }
      return this.addCoins(`${prefix}${value}c.`);
    } else {
      let silverValue: string;
      const copperValue = value.slice(value.length - 2, value.length);
      if (value.length <= 4) {
        if (value.length == 4) {
          silverValue = value.slice(value.length - 4, value.length - 2);
        } else {
          silverValue = value.slice(value.length - 3, value.length - 2);
        }
        return this.addCoins(`${prefix}${silverValue}s. ${copperValue}c.`);
      } else {
        silverValue = value.slice(value.length - 4, value.length - 2);
        const goldValue = value.slice(0, value.length - 4);
        return this.addCoins(
          `${prefix}${goldValue}g. ${silverValue}s. ${copperValue}c.`
        );
      }
    }
  }
}
