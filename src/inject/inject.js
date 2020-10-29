//http://pixelartmaker.com/art/08ede37db9c6da7
//http://pixelartmaker.com/art/2d886149d3becab
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
	})

	console.log($('.holder'));
}

function getInput(addedTagId) {
	$('.anchor-holder').on('click', "label.editable", function () {
		var $lbl = $(this), o = $lbl.text(),
			$txt = $('<input type="text" class="editable-label-text" value="' + o + '" />');
		$lbl
			.replaceWith($txt);
		$txt.focus();

		$txt.blur(function () {
			$txt.replaceWith($lbl);
		})
			.keydown(function (evt) {
				if (evt.keyCode == 13) {
					var no = $(this).val();
					$lbl.text(no);
					$txt.replaceWith($lbl);
				}
			});
	});
	const el = $(`#${addedTagId} label.editable`);

	//$('#' + addedTagId).click();

}

function addAnchor(message) {
	console.log(message);
	console.log(mousePosition);
	const anchorId = `${mousePosition.x}-${mousePosition.y}`
	const bodyElement = $("body");
	const content = `
	<div class="anchor-holder" style="position:absolute;left:${mousePosition.x-40}px;top:${mousePosition.y-21}px; color: #f95727;z-index: 999999;" id="${mousePosition.x}-${mousePosition.y}">
		<label class="editable" style="display: flex;justify-content: center;align-items: center;">	<img src="https://i.hizliresim.com/2Gvc7q.png" style="width:30px" />${anchorId}</label>
  	</div>`
	//const bodyContent = bodyElement.html() + `<a class="git-anc-cls" id="${mousePosition.x}-${mousePosition.y}" style="position:absolute;left:${mousePosition.x}px;top:${mousePosition.y}px">OPT</a>`;
	const bodyContent = bodyElement.html() + content;
	$("body").html(bodyContent)
	getInput(`${mousePosition.x}-${mousePosition.y}`);

}

function getAnchors() {
	console.log($(".anchor-holder"));

	const anchors = $(".anchor-holder").map(function () { return { name: $(this).children('.editable').text(), anchorId: this.id } }).get();
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
