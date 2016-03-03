chrome.browserAction.onClicked.addListener(function(activeTab) {
    var newURL = chrome.extension.getURL("src/index.html");
    chrome.tabs.create({ url: newURL });
});
