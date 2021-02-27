/**
 * Temporary workaround for secondary monitors on MacOS where redraws don't happen
 * @See https://bugs.chromium.org/p/chromium/issues/detail?id=971701
 */
if (
    // From testing the following conditions seem to indicate that the popup was opened on a secondary monitor
    window.screenLeft < 0 ||
    window.screenTop < 0 ||
    window.screenLeft > window.screen.width ||
    window.screenTop > window.screen.height
) {
    chrome.runtime.getPlatformInfo(function (info) {
        if (info.os === 'mac') {
            const fontFaceSheet = new CSSStyleSheet()
            fontFaceSheet.insertRule(`
          @keyframes redraw {
            0% {
              opacity: 1;
            }
            100% {
              opacity: .99;
            }
          }
        `)
            fontFaceSheet.insertRule(`
          html {
            animation: redraw 1s linear infinite;
          }
        `)
            document.adoptedStyleSheets = [
                ...document.adoptedStyleSheets,
                fontFaceSheet,
            ]
        }
    })
}

chrome.tabs.query({
    "active": true,
    "currentWindow": true
}, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: "GET_ANCHORS" }, (response) => {
        renderResponse(response);
    });
});

function renderResponse(response) {
    let content = "";
    response.anchors.forEach(element => {
        content += buildAnchorLink(element);
    });
    content = `<ul>${content}</ul>`

    $('#anchors').html(content);

    $('.anchor-link').on('click', function (event) {
        event.preventDefault();
        updateURL(event.target.hash);
        return false;
    });
}

function updateURL(anchorId) {
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        baseUrl = tabs[0].url.match(/.+?(?=#)/);
        targetUrl = (baseUrl === null ? tabs[0].url : baseUrl) + anchorId;
        chrome.tabs.update(tabs[0].id, {
            url: targetUrl
        });
    });

}


function buildAnchorLink(anchor) {
    const anchorLink = `<li><a class="anchor-link" href=#${anchor.id}>${anchor.label}</a></li>`
    return anchorLink;
}