import { getElementXPath } from "./helper";

console.log("content script from vue");

chrome.runtime.sendMessage({ from: "content" }, (res) => {
  if (res && res.elementSelector) {
    const xpath = getElementXPath(res.elementSelector);
    if (xpath) {
      var xpathResult = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
      var nodes = [];
      var node;

      while ((node = xpathResult.iterateNext())) {
        nodes.push(node.textContent);
      }
      chrome.runtime.sendMessage(
        {
          message: "contentToBackgroundResponse",
          data: nodes,
        },
        (response) => {
          console.log(response);
        }
      );
    }
  }
});
