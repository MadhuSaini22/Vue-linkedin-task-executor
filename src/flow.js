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

// function getElementXPath(element) {
//   if (element && element.tagName) {
//     var xpath = "";
//     for (; element && element.nodeType == 1; element = element.parentNode) {
//       var id =
//         Array.from(element.parentNode.children)
//           .filter(function (sibling) {
//             return sibling.tagName === element.tagName;
//           })
//           .indexOf(element) + 1;
//       id > 1 ? (id = "[" + id + "]") : (id = "");
//       xpath = "/" + element.tagName.toLowerCase() + id + xpath;
//     }
//     return xpath;
//   }
//   return "";
// }

// // Function to get XPath of an element in a specific tab
// function getXPathInTab(tabId, selector) {
//   chrome.tabs.get(tabId, function (tab) {
//     if (chrome.runtime.lastError) {
//       console.error(chrome.runtime.lastError.message, tab);
//       return;
//     }

//     chrome.tabs.executeScript(tabId, { code: "document.querySelector('" + selector + "')" }, function (results) {
//       if (chrome.runtime.lastError) {
//         console.error(chrome.runtime.lastError.message);
//         return;
//       }

//       var element = results[0];
//       var xpath = getElementXPath(element);
//       console.log("XPath:", xpath);
//       // Do something with the XPath here
//     });
//   });
// }

// const getElementXPath = (selector) => {
//   const element = document.querySelector(selector);

//   if (!element) {
//     console.error("Element not found");
//     return;
//   }

//   if (element.id !== "") {
//     // If the element has an ID, use it to construct the XPath
//     return `id("${element.id}")`;
//   }

//   const paths = [];

//   // Iterate through ancestors of the element
//   for (; element && element.nodeType === Node.ELEMENT_NODE; element = element.parentNode) {
//     let tagName = element.tagName.toLowerCase();
//     let index = 1;

//     // Check if the element has siblings with the same tag name
//     if (element.parentNode && element.parentNode.children) {
//       const siblings = element.parentNode.children;
//       for (let i = 0; i < siblings.length; i++) {
//         const sibling = siblings[i];
//         if (sibling.tagName === tagName) {
//           if (sibling === element) {
//             break;
//           }
//           index++;
//         }
//       }
//     }

//     // Add the tag name and index to the XPath
//     let pathIndex = index > 1 ? `[${index}]` : "";
//     paths.splice(0, 0, tagName + pathIndex);
//   }

//   // Join the XPath parts and return the final XPath
//   return paths.length ? `/${paths.join("/")}` : null;
// };

// const scrape = async (tabId, xpath) => {
//   console.log("scrape open");

//   return new Promise((resolve, reject) => {
//     chrome.tabs.executeScript(
//       tabId,
//       {
//         code: `
//       const result = document.evaluate('${xpath}', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
//       result.singleNodeValue ? result.singleNodeValue.textContent : null;
//     `,
//       },
//       (result) => {
//         if (chrome.runtime.lastError) {
//           reject(chrome.runtime.lastError);
//         } else {
//           resolve(result[0]);
//         }
//       }
//     );
//   });
// };

export async function handleFlow(request, sender) {
  console.log({ sender });
  const commands = await fetch(chrome.runtime.getURL(`data/${request.event}.json`)).then((response) => response.json());
  // console.log({ commands });
  let state = {};

  for (let command of commands) {
    let template = Handlebars.compile(command.url || "");
    let url = template(request.data);
    let tab; // Move the declaration outside the switch block

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
        // state.scrapedData = await getXPathInTab(state.lastTabId, command.selector);
        // Function to get the XPath of an element

        // Function to send a message to the content script and retrieve the XPath
        // chrome.tabs.sendMessage(state.lastTabId, command.selector, (response) => {
        //   console.log("XPath:", response);
        // });
        chrome.runtime.sendMessage({ message: "Hello from the background scriptSDSSSSSSdd!" });

        // await scrape(state.lastTabId, command.xpath);
        break;
      case "send_event":
        chrome.tabs.query({}, (tabs) =>
          tabs.forEach((tab) => {
            chrome.tabs.sendMessage(tab.id, { event: command.event, data: command.data });
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
