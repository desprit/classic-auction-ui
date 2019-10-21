import { Pipe, PipeTransform } from '@angular/core';

/**
 * Transforms a string into gold-formatted value
 * Example:
 * {{ '974912' | toGold }}
 * '97g 49s 12c'
 */
@Pipe({ name: 'toGold' })
export class StringToGoldPipe implements PipeTransform {
  transform(valueAsNumber: number): string {
    let value = valueAsNumber.toString();
    const belowZero = value[0] === '-';
    const prefix = belowZero ? '-' : '';
    value = belowZero ? value.slice(1, value.length) : value;
    if (value.length <= 2) {
      if (value === '0') {
        return '-';
      }
      return `${prefix}${value}c`;
    } else {
      let silverValue: string;
      const copperValue = value.slice(value.length - 2, value.length);
      if (value.length <= 4) {
        if (value.length == 4) {
          silverValue = value.slice(value.length - 4, value.length - 2);
        } else {
          silverValue = value.slice(value.length - 3, value.length - 2);
        }
        return `${prefix}${silverValue}s ${copperValue}c`;
      } else {
        silverValue = value.slice(value.length - 4, value.length - 2);
        const goldValue = value.slice(0, value.length - 4);
        return `${prefix}${goldValue}g ${silverValue}s ${copperValue}c`;
      }
    }
  }
}
