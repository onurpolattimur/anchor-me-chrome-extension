chrome.tabs.query({
    "active": true,
    "currentWindow": true
}, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: "GET_ANCHORS" }, (response) => {
        console.log(response);
        renderResponse(response);
    });
});

function renderResponse(response) {
    let content = "";
    response.anchors.forEach(element => {
        content += buildAnchorLink(element);
    });
    content = `<ul>${content}</ul>`
    console.log(content);

    $('#anchors').html(content);

    $('.anchor-link').on('click', function (event) {
        event.preventDefault();
        console.log("Event", event);
        updateURL(event.target.hash);
        return false;
    });
}

function updateURL(anchorId) {
    console.log(anchorId);
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        baseUrl = tabs[0].url.match(/.+?(?=#)/);
        targetUrl = (baseUrl === null ? tabs[0].url : baseUrl) + anchorId;
        console.log(targetUrl);
        chrome.tabs.update(tabs[0].id, {
            url: targetUrl
        });
    });

}


function buildAnchorLink(anchor) {
    // const anchorLink = `<div><a class="anchor-link" href=#${anchor.anchorId}>${anchor.name}</a></div>`
    const anchorLink = `<li><a class="anchor-link" href=#${anchor.anchorId}>${anchor.name}</a></li>`
    return anchorLink;
}