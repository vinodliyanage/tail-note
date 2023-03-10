export class Storage {
  private static storage = chrome.storage.local;

  public static async set(items: Object) {
    return this.storage.set(items);
  }

  public static async get(keys: String | String[]) {
    return this.storage.get(keys);
  }

  public static onChanged(
    callback: (changes: object, areaName: string) => void
  ) {
    chrome.storage.onChanged.addListener(callback);
  }
}
