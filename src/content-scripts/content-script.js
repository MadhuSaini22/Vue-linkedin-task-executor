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

// Content script (content-script.js)
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log({ sender, sendResponse });
  if (request.message === "hello") {
    console.log('Received "hello" message from background script');
    // Do something in response to the message
  }
});

// console.log("firstssssssssssssssssssssssss");
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   console.log("ddddddddddddddddddddddddddddddddddddd");
//   if (request.selector) {
//     var xpathResult = document.evaluate(
//       request.selector,
//       document,
//       null,
//       XPathResult.ANY_TYPE,
//       null
//     );
//     var nodes = [];
//     var node;

//     while ((node = xpathResult.iterateNext())) {
//       nodes.push(node.textContent);
//     }

//     sendResponse({ data: nodes });
//   }
// });
