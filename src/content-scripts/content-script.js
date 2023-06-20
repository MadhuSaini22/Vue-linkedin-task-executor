// Listen for any custom event starting with 'jug-'
window.addEventListener("message", (event) => {
  console.log("ccc 1");
  // Check if event data is an object and has the event key starting with 'jug-'
  if (
    typeof event.data === "object" &&
    Object.prototype.hasOwnProperty.call(event.data, "event") &&
    event.data.event.startsWith("jug-")
  ) {
    // Send the event data to the background script
    console.log({ event });
    chrome.runtime.sendMessage(event.data);
  }
});
console.log("content script from vue");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { selector } = message;
  const element = document.querySelector(selector);

  if (element) {
    element.style.border = "2px solid yellow";
    // Add any additional highlighting logic as needed
  }

  sendResponse();
});
