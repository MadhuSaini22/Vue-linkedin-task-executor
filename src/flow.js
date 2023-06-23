import Handlebars from "handlebars/lib/handlebars";

const click = async (tabId, selector) => {
  chrome.tabs.get(tabId, function (tab) {
    console.log(tab);
    chrome.tabs.executeScript(tabId, {
      code: `document.querySelector("${selector}").click();`,
    });
  });
};

const hitEnter = async (tabId, selector) => {
  chrome.tabs.executeScript(tabId, {
    code: `
    var element = document.querySelector('${selector}');
    var event = new KeyboardEvent('keydown', {
      key: 'Enter',
      keyCode: 13,
      bubbles: true
    });
    element.dispatchEvent(event);
  `,
  });
};

const screenshot = async (tabId) => {
  return new Promise((resolve, reject) => {
    chrome.debugger.attach({ tabId }, "1.2", () => {
      chrome.debugger.sendCommand({ tabId }, "Page.enable", {}, () => {
        chrome.debugger.sendCommand(
          { tabId },
          "Page.captureScreenshot",
          {
            format: "png",
            quality: 100,
          },
          ({ data }) => {
            chrome.debugger.detach({ tabId }, () => {
              if (data) {
                const screenshotUrl = `data:image/png;base64,${data}`;

                resolve(screenshotUrl);
              } else {
                console.error("Failed to capture screenshot: Data is undefined");
                reject(new Error("Failed to capture screenshot"));
              }
            });
          }
        );
      });
    });
  });
};

const highlight = async (tabId, selector) => {
  chrome.tabs.executeScript(tabId, {
    code: `
    var elements = document.querySelectorAll('${selector}');
    if (elements.length > 0) {
      elements[0].style.border = '2px solid red';
      elements[0].style.backgroundColor = 'yellow';
      elements[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  `,
  });
};

async function scrape(tabId, elementSelector, request, state) {
  return new Promise((resolve) => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.from === "content") {
        sendResponse({ tabId, elementSelector });
      } else if (message.message === "contentToBackgroundResponse") {
        state.scrapedData = message.data;
        sendResponse({ event: `${request.event}-result`, state });
        resolve(message.data);
      }
      return true;
    });
  });
}

export async function handleFlow(request, sender) {
  console.log(sender);
  const commands = await fetch(chrome.runtime.getURL(`data/${request.event}.json`)).then((response) => response.json());
  let state = {};

  for (let command of commands) {
    let template = Handlebars.compile(command.url || "");
    let url = template(request.data);
    let tab;

    switch (command.command) {
      case "open_tab":
        tab = await new Promise((resolve) => chrome.tabs.create({ url: url }, resolve));
        state.lastTabId = tab.id;
        break;
      case "click":
        await click(state.lastTabId, command.selector);
        break;
      case "hitEnter":
        await hitEnter(state.lastTabId, command.selector);
        break;
      case "screenshot":
        state.screenshotData = await screenshot(state.lastTabId);
        break;
      case "highlight":
        await highlight(state.lastTabId, command.selector);
        break;
      case "scrape":
        state.scrapedData = await scrape(state.lastTabId, command.selector, request, state);

        break;
      case "send_event":
        chrome.tabs.query({}, (tabs) =>
          tabs.forEach((tab) => {
            chrome.tabs.sendMessage(tab.id, {
              event: command.event,
              data: command.data,
            });
          })
        );
        break;
      case "wait":
        await new Promise((resolve) => setTimeout(resolve, command.time));
        break;
    }
  }
}
