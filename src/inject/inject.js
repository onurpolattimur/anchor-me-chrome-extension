//store.set('user', { name:'Marcus' });
var watchMouse = true;
var mousePosition = {
	x: 0,
	y: 0
};

chrome.extension.sendMessage({}, function (response) {
	var readyStateCheckInterval = setInterval(function () {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);
			watchMouseEvent();

			// ----------------------------------------------------------
			// This part of the script triggers when page is done loading
			console.log("Hello. This message was sent from scripts/inject.js");
			// ----------------------------------------------------------

		}
	}, 10);
});

function watchMouseEvent() {

	const bodyElement = $("body");
	bodyElement.on('contextmenu', function (e) {
		mousePosition.x = e.pageX;
		mousePosition.y = e.pageY;
		console.log(e);
	})
	// bodyElement.on('mousemove mouseenter mouseleave', function (e) {
	// 	if (watchMouse) {
	// 		mousePosition.x = e.pageX;
	// 		mousePosition.y = e.pageY;
	// 	}
	// 	//console.log(e.pageX);
	// 	//console.log(e.pageY);
	// });


	//console.log(bodyElement);
}

function addAnchor(message) {
	console.log(message);
	console.log(mousePosition);
	const bodyElement = $("body");
	const bodyContent = bodyElement.html() + `<a class="git-anc-cls" id="${mousePosition.x}-${mousePosition.y}" style="position:absolute;left:${mousePosition.x}px;top:${mousePosition.y}px">OPT</a>`;
	$("body").html(bodyContent)

}

function getAnchors() {
	const anchors = $(".git-anc-cls").map(function () { return this.id }).get();
	console.log(anchors);
	return anchors;

}

chrome.extension.onMessage.addListener(function (message, sender, callback) {
	if (message.type == "ADD_ANCHOR") {
		addAnchor(message);
		return;
	}

	if (message.type == "GET_ANCHORS") {
		callback({ anchors: getAnchors() });
		return;
	}
});
