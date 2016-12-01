Qualtrics.SurveyEngine.addOnload(function()
{
	/*Place Your Javascript Below This Line*/
	
	// PROGRAM CONSTANTS HERE =======================
	
	var qualtrics = this;
	
	var fixationTime = 1000;
	var primeTime = 15;
	var maskTime = 2000;
	var stimulusTime = 250;
	
	var fixationText = "+";
	var maskText = "XXXXX";
	
	var spaceKey = 32;     // Space bar key
	var leftKey  = 69;    // 'E' key
	var riteKey  = 73;    // 'I' key
	
	var inputID = "QR~" + this.questionId;
	var inputElt = $(inputID);
	
	var loadingElt = getByClass("loadingMessage");
	var instrElt = getByClass("instructions");
	var outroElt = getByClass("outro");
	
	var testAreaElt = getByClass("testArea");
	var displayTextElt = getByClass("displayText");
	var wrongElt = getByClass("wrong");
	
	// STUDY-SPECIFIC CONSTANTS HERE ================
	
	var prompts = shuffle([
		{
			primer: "herp derp",
			stimulus: "nyan",
			isWord: true
		},
		{
			primer: "espagnol",
			stimulus: "jajaja",
			isWord: false
		},
		{
			primer: "ASIAN",
			stimulus: "EXOTIC",
			isWord: true
		}
	]);
	
	// PROGRAM VARIABLES ============================
	
	var blockInput = false;
	
	var responses = [];
	
	var index = -1;
	var startTime = null;
	var currWrongs = 0;
	var timerId = null;
	
	// INITIALIZATION ===============================
	
	qualtrics.hideNextButton();
	
	inputElt.style.display = "none";
	
	// HELPER FUNCTIONS ==============================
	
	function appendArray(arr, add) {
		for (var i = 0; i < add.length; i++) {
			arr.push(add[i]);
		}
		return arr;
	}
	
	function joinArrays(/* array1, array2, array3, ... */) {
		var arr = [];
		for (var i = 0; i < arguments.length; i++) {
			for (var j = 0; j < arguments[i].length; j++) {
				arr.push(arguments[i][j]);
			}
		}
		return arr;
	}
	
	function copyOf(obj) {
		var copy = {};
		for (var key in obj) {
			copy[key] = obj[key];
		}
		return copy;
	}
	
	function swap(arr, i, j) {
		if (i != j) {
			var tmp = arr[i];
			arr[i] = arr[j];
			arr[j] = tmp;
		}
		return arr;
	}
	
	function randInt(lo, hi) {
		return ~~(Math.random() * (hi - lo) + lo);
	}
	
	function shuffle(arr) {
		for (var i = arr.length - 1; i > 0; i--) {
			var idx = randInt(0, i);
			swap(arr, i, idx);
		}
		return arr;
	}
	
	function getByClass(className) {
		var elts = document.getElementsByClassName(className);
		return elts ? elts[0] : null;
	}
	
	function show(elt) {
		if (elt) {
			elt.style.display = "inherit";	
		}
	}
	
	function hide(elt) {
		if (elt) {
			elt.style.display = "none";
		}
	}
	
	function setVisible(elt) {
		if (elt) {
			elt.style.visibility = "visible";
		}
	}
	
	function setHidden(elt) {
		if (elt) {
			elt.style.visibility = "hidden";
		}
	}
	
	function clearChildren(elt) {
		while (elt.lastChild) {
			elt.removeChild(elt.lastChild);
		}
	}
	
	// PROGRAM LOGIC ===================================
	
	function startNextTrial() {
		index++;
		if (index < prompts.length) {
			blockInput = true;
			currWrongs = 0;
			setHidden(wrongElt);
			show(displayTextElt);
			displayTextElt.innerHTML = fixationText;
			setTimeout(showPrimer, fixationTime);
		} else {
			inputElt.value = JSON.stringify(responses);
			hide(testAreaElt);
			show(outroElt);
			qualtrics.showNextButton();
		}
	}
	
	function showPrimer() {
		displayTextElt.innerHTML = prompts[index].primer;
		setTimeout(showMask, primeTime);
	}
	
	function showMask() {
		displayTextElt.innerHTML = maskText;
		setTimeout(showStimulus, maskTime);
	}
	
	function showStimulus() {
		displayTextElt.innerHTML = prompts[index].stimulus;
		blockInput = false;
		startTime = performance.now();
		timerId = setTimeout(hideText, stimulusTime);
	}
	
	function hideText() {
		hide(displayTextElt);
	}
	
	document.onkeydown = function(e) {
		var key = window.event ? (event.keyCode || event.which) : (e.keyCode || e.which);
		if (key === spaceKey) {
			e.preventDefault();
		}
		if (!blockInput) {
			if (index < 0) {
				if (key === spaceKey) {
					hide(instrElt);
					show(testAreaElt);
					startNextTrial();
				}
			} else if (index < prompts.length) {
				if (key === leftKey || key === riteKey) {
					var correctKey = prompts[index].isWord ? riteKey : leftKey;
					if (key === correctKey) {
						clearTimeout(timerId);
						recordResponse();
						startNextTrial();
					} else {
						currWrongs++;
						setVisible(wrongElt);
					}
				}
			}
		}
	}
	
	function recordResponse() {
		var currTime = performance.now();
		responses.push({
			promptData: prompts[index],
			time: currTime - startTime,
			incorrect: currWrongs
		});
	}
});
