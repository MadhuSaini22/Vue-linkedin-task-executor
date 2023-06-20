// import { handleFlow } from "./flow";

import { handleFlow } from "./flow";

chrome.runtime.onMessage.addListener(() => {
  console.log("Hello from the background");

  chrome.tabs.executeScript({
    file: "content-script.js",
  });
});

// // Listen for events from the content script
// chrome.runtime.onMessage.addListener((request, sender) => {
//   console.log({ request, sender });
//   console.log({ request });
//   if (request && request.event && request.event.startsWith("jug-")) {
//     console.log("success");
//     // handleFlow(request, sender);
//   }
// });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.event && message.event.startsWith("jug-")) {
    // Process the message or perform any necessary actions
    console.log("Received message:", message);

    handleFlow(message, sender);
    // Send a response back to the popup script
    const response = {
      event: "jug-linkedin-result",
      data: {
        // Result data
      },
    };
    sendResponse(response);
  }
  return true;
});
