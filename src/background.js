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

chrome.tabs.query({ active: true, currentWindow: true, lastFocusedWindow: true }, function (tabs) {
  console.log(tabs);
  chrome.tabs.sendMessage(tabs[0].id, { greeting: "Hello from background script!" });
});
