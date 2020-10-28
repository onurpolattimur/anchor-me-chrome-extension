// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });
//var store = new Store();

//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function (request, sender, sendResponse) {
    chrome.pageAction.show(sender.tab.id);
    sendResponse();
  }
);


function genericOnClick(info, tab) {
  console.log("item " + info.menuItemId + " was clicked");
  console.log("info: " + JSON.stringify(info));
  console.log("tab: " + JSON.stringify(tab));

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


searchUrbanDict = function (word) {
  var query = word.selectionText;
  console.log("test");
  //chrome.tabs.create({ url: "http://www.urbandictionary.com/define.php?term=" + store.get('user').name });
};

chrome.contextMenus.create({
  title: "Add Anchor",
  contexts: ["page", "selection", "image", "link"],  // ContextType
  onclick: genericOnClick // A callback function
});

