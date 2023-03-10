import { findElement } from "./core/core";
import { Storage } from "./core/storage";
import "./style.css";
import logo from "/logo.png";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = /* html */ `
<div class="p-2.5 dark:bg-gray-900">
  <div class="flex flex-row justify-between items-center mb-3">
  
    <div class="flex flex-row gap-3 items-center">
      <img class="w-6 h-6" src=${chrome.runtime.getURL(logo)} alt=""/>
        <h2 class="text-lg font-medium dark:text-white">Tail Note</h2>
    </div>

    <div class="flex flex-row items-center gap-2">
      <span id="activeSpan" class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300 capitalize">Active</span>
      <label class="relative inline-flex items-center cursor-pointer">
      <input id="activeBtn" type="checkbox" value="" class="sr-only peer" checked>
      <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      </label>
    </div>

  </div>
 
  <div>
    <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Post w/ Note</label>
    <textarea 
      id="message" 
      rows="10"  
      class="
        block 
        p-2.5 
        w-full 
        text-sm 
      text-gray-900 
      bg-gray-50 
        rounded-lg border 
      border-gray-300 
      focus:ring-blue-500 
      focus:border-blue-500 
      dark:bg-gray-700 
      dark:border-gray-600
      dark:placeholder-gray-400 
      dark:text-white 
      dark:focus:ring-blue-500 
      dark:focus:border-blue-500"
     placeholder="Write your thoughts here..."></textarea>
  </div>
</div>
`;

const messageElement = findElement<HTMLTextAreaElement>("#message");
const activeBtn = findElement<HTMLButtonElement>("#activeBtn");
const actionSpan = findElement<HTMLSpanElement>("#activeSpan");

document.addEventListener("DOMContentLoaded", handleStart);
activeBtn.addEventListener("change", handleActive);
messageElement.addEventListener("input", handleMessage);

async function handleStart() {
  const { postscript, activeStatus } = await Storage.get([
    "postscript",
    "activeStatus",
  ]);

  messageElement.value = postscript;
  activeBtn.toggleAttribute("checked", activeStatus);
  actionSpan.textContent = activeStatus ? "Active" : "Deactive";
}

function handleActive(event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  actionSpan.textContent = checked ? "Active" : "Deactive";
  Storage.set({ activeStatus: checked });
}

function handleMessage(event: Event) {
  const value = (event.target as HTMLTextAreaElement).value;
  Storage.set({ postscript: value });
}
