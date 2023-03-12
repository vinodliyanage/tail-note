export function sleep(seconds: number) {
  return new Promise((resolve, reject) => {
    try {
      const timeout = setTimeout(() => {
        clearTimeout(timeout);
        resolve(true);
      }, seconds * 1000);
    } catch (_) {
      reject(false);
    }
  });
}

export function findElement<T = Node>(
  query: string,
  target: HTMLElement | Document = document
) {
  return target.querySelector(query) as T;
}

export function findElements<T = Node[] | []>(
  query: string,
  target: Document | HTMLElement = document
) {
  return Array.from(target.querySelectorAll(query)) as T;
}

export function waitElement<T = HTMLElement>(
  selector: string,
  maxDelay: number,
  target: HTMLElement | Document = document
): Promise<T | null> {
  return Promise.race([
    new Promise((resolve: (value: T | null) => void) => {
      const interval = setInterval(() => {
        const element = findElement<T>(selector, target);
        if (element) {
          clearInterval(interval);
          resolve(element);
        }
      });
    }),
    new Promise((resolve: (value: null) => void) => {
      const timeout = setTimeout(() => {
        clearTimeout(timeout);
        resolve(null);
      }, maxDelay * 1000);
    }),
  ]);
}

export function onWebpageChanged(
  options: { target?: HTMLElement; config?: MutationObserverInit | {} },
  callbackfunction: (results: {
    observer: MutationObserver;
    target: Node;
    mutation: MutationRecord;
  }) => void
) {
  const { config = {}, target = document.body } = options;

  new MutationObserver(
    (mutationList: MutationRecord[], observer: MutationObserver) => {
      for (const mutation of mutationList) {
        callbackfunction({ observer, target: mutation.target, mutation });
      }
    }
  ).observe(target, {
    attributes: true,
    childList: true,
    subtree: true,
    ...config,
  });
}

export function findFromChild<T = Node>(selector: string, child: Node) {
  let temp = child?.parentElement;

  while (temp) {
    const element = findElement<T>(selector, temp);
    if (element) return element;
    temp = temp?.parentElement;
  }
  return null;
}
