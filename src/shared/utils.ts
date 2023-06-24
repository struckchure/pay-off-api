interface AnyObject {
  /**
   * Author: ChatGPT
   */
  [key: string]: any;
}

export function removeNullOrEmptyValues(obj: AnyObject): AnyObject {
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

  return result;
}

export function removeObjectValueByKey<T = object>(
  obj: Record<string, T>,
  key: string,
): Record<string, T> {
  /**
   * Author: ChatGPT
   */

  const result: Record<string, T> = { ...obj };

  if (result.hasOwnProperty(key)) {
    delete result[key];
  }

  return result;
}
