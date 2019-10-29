export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function filterOutliers(someArray: number[]) {
  var values = someArray.concat();
  values.sort(function(a, b) {
    return a - b;
  });
  /* Find a generous IQR. This is generous because if (values.length / 4)
   * is not an int, then really you should average the two elements on either
   * side to find q1.
   */
  var q1 = values[Math.floor(values.length / 4)];
  // Likewise for q3.
  var q3 = values[Math.ceil(values.length * (3 / 4))];
  var iqr = q3 - q1;
  // Then find min and max values
  var maxValue = q3 + iqr * 1.5;
  var minValue = q1 - iqr * 1.5;
  // Then filter anything beyond or beneath these values.
  var filteredValues = values.filter(function(x) {
    return x <= maxValue && x >= minValue;
  });
  return filteredValues;
}

export function sortByProperty(
  array: { [key: string]: any }[],
  propertyName: string,
  reverse: boolean = false,
) {
  return array.sort(function(a, b) {
    if (reverse) {
      return b[propertyName] - a[propertyName];
    }
    return a[propertyName] - b[propertyName];
  });
}

export function compare(
  a: { [key: string]: any },
  b: { [key: string]: any },
  compareBy: string,
) {
  if (a[compareBy] > b[compareBy]) {
    return -1;
  }
  if (a[compareBy] < b[compareBy]) {
    return 1;
  }
  return 0;
}

/**
 * Transforms a string into gold-formatted value
 * Example:
 * {{ '974912' | toGold }}
 * '97g 49s 12c'
 */
export function convertToGold(valueAsNumber: number): string {
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
