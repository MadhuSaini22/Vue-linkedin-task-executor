// Listen for any custom event starting with 'jug-'
// window.addEventListener("message", (event) => {
//   // Check if event data is an object and has the event key starting with 'jug-'
//   if (
//     typeof event.data === "object" &&
//     Object.prototype.hasOwnProperty.call(event.data, "event") &&
//     event.data.event.startsWith("jug-")
//   ) {
//     // Send the event data to the background script
//     console.log({ event });
//     chrome.runtime.sendMessage(event.data);
//   }
// });

console.log("content script from vue");
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
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log({ message });

  sendResponse("Message received!");
});
