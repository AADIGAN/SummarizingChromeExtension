chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
      id: "summarize",
      title: "Summarize Terms and Conditions",
      contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "summarize") {
      chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: (selectedText) => {
              localStorage.setItem('textToSummarize', selectedText);
              chrome.runtime.sendMessage({ action: "openSummaryPage" });
          },
          args: [info.selectionText]
      });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openSummaryPage") {
    const successUrl = chrome.runtime.getURL("success.html");
    chrome.tabs.create({ url: successUrl });
  }
});
