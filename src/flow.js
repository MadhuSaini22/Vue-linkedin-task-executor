import Handlebars from "handlebars/lib/handlebars";

const click = async (tabId, selector) => {
  console.log("clicked called");

  chrome.tabs.get(tabId, function (tab) {
    console.log(tab);
    chrome.tabs.executeScript(tabId, {
      code: `document.querySelector("${selector}").click();`,
    });
  });
  console.log("clicked closing");
};

const hitEnter = async (tabId, selector) => {
  console.log("hitEnter open");

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
  console.log("hitEnter close");
};

const screenshot = async (tabId) => {
  console.log("screenshot open");

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
                console.error(
                  "Failed to capture screenshot: Data is undefined"
                );
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
  console.log("highlight open");

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

  console.log("highlight close");
};

async function scrape(tabId, elementSelector) {
  chrome.tabs.sendMessage(
    tabId,
    { selector: elementSelector },
    function (response) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }

      if (response && response.data) {
        console.log(response.data); // Do something with the scraped data
      } else {
        console.error("Scraping failed. No data received.");
      }
    }
  );
}
export async function handleFlow(request, sender) {
  console.log({ sender });
  const commands = await fetch(
    chrome.runtime.getURL(`data/${request.event}.json`)
  ).then((response) => response.json());
  // console.log({ commands });
  let state = {};

  for (let command of commands) {
    let template = Handlebars.compile(command.url || "");
    let url = template(request.data);
    let tab; // Move the declaration outside the switch block

    switch (command.command) {
      case "open_tab":
        tab = await new Promise((resolve) =>
          chrome.tabs.create({ url: url }, resolve)
        );
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
        state.scrapedData = await scrape(state.lastTabId, command.selector);

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
  console.log({ state });
  chrome.runtime.sendMessage({ event: `${request.event}-result`, state });
}
