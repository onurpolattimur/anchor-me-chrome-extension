var mousePosition = {
	x: 0,
	y: 0
};

var anchorList = [];

chrome.extension.sendMessage({}, function (response) {
	var readyStateCheckInterval = setInterval(function () {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);
			watchMouseEvent();
		}
	}, 10);
});

function watchMouseEvent() {
	const bodyElement = $("body");
	bodyElement.on('contextmenu', function (e) {
		mousePosition.x = e.pageX;
		mousePosition.y = e.pageY;
	})
}

function getInput(addedTagId) {
	$(`[id="${addedTagId}"]`).on('click', "label.editable span", function () {
		var $lbl = $(this);
		var o = $lbl.text();
		var $txt = $(`<input type="text" class="editable-label-text" value="${o}" />`);
		$lbl.replaceWith($txt);
		$txt.focus();

		$txt.blur(function () {
			$txt.replaceWith($lbl);
		})
			.keydown(function (evt) {
				if (evt.keyCode == 13) {
					var no = $(this).val();
					$lbl.text(no);
					$txt.replaceWith($lbl);
					updateAnchor(addedTagId,no);
				}
			});
	});
}

function updateAnchor(anchorId, label){
	let anchor = anchorList.find(x=> x.id === anchorId);
	if(anchor){
		anchor.label = label;
	}
}

function addAnchor(message) {
	const anchorId = `${mousePosition.x}-${mousePosition.y}`
	const bodyElement = $("body");
	const content = `
	<div class="anchor-holder" style="position:absolute;left:${mousePosition.x-40}px;top:${mousePosition.y-21}px; color: #f95727;z-index: 999999;" id="${mousePosition.x}-${mousePosition.y}">
		<label class="editable" style="color:#f95727;display: flex;justify-content: center;align-items: center;"><img src="https://i.hizliresim.com/2Gvc7q.png" style="width:30px" /><span>${anchorId}</span></label>
  	</div>`
	$("body").append(content);
	getInput(`${mousePosition.x}-${mousePosition.y}`);
	anchorList.push({
		id:`${mousePosition.x}-${mousePosition.y}`,
		label: anchorId
	})

}

function getAnchors() {
	return anchorList;
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
