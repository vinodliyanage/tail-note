import { Storage } from "./core/storage";

chrome.runtime.onInstalled.addListener(() => {
  Storage.set({
    activeStatus: true,
    postscript: "",
  });
});
