import { Pipe, PipeTransform } from '@angular/core';

/**
 * Remove escape symbols from string
 * Example:
 * {{ 'A Thoroughly Read Copy of \"Nat Pagle's Extreme' Anglin.\"' | unescape }}
 * 'A Thoroughly Read Copy of "Nat Pagle's Extreme' Anglin."'
 */
@Pipe({ name: 'unescape' })
export class UnescapePipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/\\/g, '');
  }
}
