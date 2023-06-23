export function getElementXPath(selector) {
  const element = document.querySelector(selector);

  if (!element) {
    console.error("Element not found");
    return null;
  }

  // Helper function to get the XPath of an element recursively
  function getXPath(element) {
    if (element.tagName.toLowerCase() === "html") {
      return "/html";
    }

    let index = 1;
    let sibling = element.previousElementSibling;

    while (sibling) {
      if (sibling.tagName === element.tagName) {
        index++;
      }
      sibling = sibling.previousElementSibling;
    }

    return `${getXPath(element.parentNode)}/${element.tagName.toLowerCase()}[${index}]`;
  }

  return getXPath(element);
}
