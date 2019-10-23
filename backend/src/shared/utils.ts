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

export function compare(a: { [key: string]: any }, b: { [key: string]: any }) {
  if (a.profit > b.profit) {
    return -1;
  }
  if (a.profit < b.profit) {
    return 1;
  }
  return 0;
}
