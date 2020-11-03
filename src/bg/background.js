chrome.extension.onMessage.addListener(
  function (request, sender, sendResponse) {
    chrome.pageAction.show(sender.tab.id);
    sendResponse();
  }
);


function genericOnClick(info, tab) {
  //Add all you functional Logic here
  chrome.tabs.query({
    "active": true,
    "currentWindow": true
  }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      type: "ADD_ANCHOR",
      content: ""
    });
  });
}


chrome.contextMenus.create({
  title: "Add Anchor",
  contexts: ["page", "selection", "image", "link"],  // ContextType
  onclick: genericOnClick // A callback function
});

