import { handleFlow } from "./flow";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.event && message.event.startsWith("jug-")) {
    // Process the message or perform any necessary actions

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
  // if (message.from == "content") {
  //   sendResponse("connection from background established");
  // }
  return true;
});
