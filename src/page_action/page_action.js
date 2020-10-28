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
    console.log(content);

    $('#anchors').html(content);

    $('.anchor-link').on('click', function (event) {
        event.preventDefault();
        console.log(event);
        updateURL(event.target.hash);
    });
}

function updateURL(anchorId) {
    console.log(anchorId);
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        let url = tabs[0].url;
        url = url.match(/.+?(?=#)/) + anchorId;
        chrome.tabs.update(tabs[0].id, {
            url: url
        });
    });

}


function buildAnchorLink(url) {
    const anchorLink = `<div><a class="anchor-link" href=#${url}>${url}</a></div>`
    return anchorLink;
}