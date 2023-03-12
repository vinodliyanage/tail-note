import {
  findElement,
  findFromChild,
  onWebpageChanged,
  sleep,
  waitElement,
} from "../core/core";
import { Storage } from "../core/storage";

(async () => {
  const MAX_DELAY = 5;

  const POST_BTN_SELECTOR = ".comments-comment-box__submit-button";
  const COMMENTBOX_SELECTOR = `.comments-comment-box__form .ql-editor[role="textbox"][contenteditable="true"]`;
  const PARENT_SELECTOR = "form.comments-comment-box__form";

  class CustomPostButton {
    private customButton;

    constructor(private commentBox: HTMLElement, private postBtn: HTMLElement) {
      this.customButton = this.createTemplate();
    }

    async append() {
      if (!(this.postBtn.parentElement instanceof HTMLElement)) return;
      this.postBtn.parentElement.append(this.customButton);

      const { activeStatus } = await Storage.get("activeStatus");
      this.handleActive(activeStatus);

      Storage.onChanged((changes: any) => {
        if ("activeStatus" in changes)
          this.handleActive(changes.activeStatus.newValue);
      });
    }

    isFound() {
      return !!this.postBtn.parentElement?.querySelector(
        ".tailnote-2efa7bd96ff233a92dca72194e3d53f9"
      );
    }

    handleClick = async () => {
      const { postscript } = await Storage.get("postscript");

      this.commentBox.innerHTML += `<p>${postscript}</p>`;
      this.commentBox.dispatchEvent(new Event("change"));
      await sleep(1);
      this.postBtn.click();
    };

    private handleActive(isActive: boolean) {
      if (!isActive) {
        this.customButton.style.display = "none";
        this.customButton.style.pointerEvents = "none";
        this.customButton.removeEventListener("click", this.handleClick);
      } else {
        this.customButton.style.display = "inline-block";
        this.customButton.style.pointerEvents = "auto";
        this.customButton.addEventListener("click", this.handleClick);
      }
    }

    private createTemplate() {
      const template = document.createElement("template");
      template.innerHTML = /* html */ `
        <span 
            class="tailnote-2efa7bd96ff233a92dca72194e3d53f9 comments-comment-box__submit-button mt3 artdeco-button artdeco-button--1 artdeco-button--primary ember-view"
            style="background-color: rgb(5, 150, 105); cursor: pointer;"
        >Post w/ Note</span>`;
      return template.content.firstElementChild?.cloneNode(true) as HTMLElement;
    }
  }

  async function main() {
    const config = {
      attributes: false,
      characterData: true,
    };

    onWebpageChanged({ config }, async (results) => {
      const { target, mutation } = results;
      if (mutation.type !== "characterData") return;

      const parent = findFromChild<HTMLFormElement>(PARENT_SELECTOR, target);
      if (!parent) return;

      const postBtn = await waitElement<HTMLButtonElement>(
        POST_BTN_SELECTOR,
        MAX_DELAY,
        parent
      );

      const commentBox = findElement<HTMLElement>(COMMENTBOX_SELECTOR, parent);

      if (!postBtn) return;
      if (!commentBox) return;

      const customPostButton = new CustomPostButton(commentBox, postBtn);
      if (!customPostButton.isFound()) customPostButton.append();
    });
  }

  main();
})();
