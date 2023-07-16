interface AnyObject {
  /**
   * Author: ChatGPT
   */
  [key: string]: any;
}

export function removeNullOrEmptyValues<T = AnyObject>(obj: T): T {
  /**
   * Author: ChatGPT
   */

  const result: AnyObject = {};

  for (const key in obj) {
    const value = obj[key];

    if (value !== null && value !== "") {
      if (typeof value === "object" && !Array.isArray(value)) {
        result[key] = removeNullOrEmptyValues(value);
      } else {
        result[key] = value;
      }
    }
  }

  return result as T;
}

export function removeObjectValueByKey<T = AnyObject>(obj: T, key: string): T {
  /**
   * Author: ChatGPT
   */

  const result: T = { ...obj };

  if (result.hasOwnProperty(key)) {
    delete result[key];
  }

  return result as T;
}

export function sortByKey<T>(array: T[], key: keyof T): T[] {
  /**
   * Author: ChatGPT
   */

  return array.sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];

    if (valueA < valueB) {
      return -1;
    } else if (valueA > valueB) {
      return 1;
    } else {
      return 0;
    }
  });
}
