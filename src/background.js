// import { handleFlow } from "./flow";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.event && message.event.startsWith("jug-")) {
    // Process the message or perform any necessary actions
    console.log("Received message:", message);

    // handleFlow(message, sender);
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

// Background script (background.js)
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  console.log(tabs);
  const tab = tabs[0];
  chrome.tabs.sendMessage(tab.id, { message: "hello" });
});
