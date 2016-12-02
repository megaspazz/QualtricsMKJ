Qualtrics.SurveyEngine.addOnload(function()
{
	/*Place Your Javascript Below This Line*/
	
	// PROGRAM CONSTANTS HERE =======================
	
	var qualtrics = this;
	
	var Types = {
		TEXT: "TEXT",
		IMAGE: "IMAGE"
	}
	
	var topColorName = "green";
	var botColorName = "blue";
	
	var flashTime = 320;
	
	var spaceKey = 32;     // Space bar key
	var leftKey  = 69;    // 'E' key
	var riteKey  = 73;    // 'I' key
	
	var inputID = "QR~" + this.questionId;
	var inputElt = $(inputID);
	
	var loadingElt = getByClass("loadingMessage");
	var instrElt = getByClass("instructions");
	var trialInstrElt = getByClass("trialInstructions");
	var outroElt = getByClass("outro");
	var testAreaElt = getByClass("testArea");
	
	var topLeftCat = getByClass("topLeftCat");
	var topRiteCat = getByClass("topRiteCat");
	
	var botLeftCat = getByClass("botLeftClass");
	var botRiteCat = getByClass("botRiteClass");
	
	var leftCatTop = getByClass("leftCatTop");
	var leftCatBot = getByClass("leftCatBot");
	
	var riteCatTop = getByClass("riteCatTop");
	var riteCatBot = getByClass("riteCatBot");
	
	var promptTableElt = getByClass("promptTable");
	var promptElt = getByClass("prompt");
	var wrongElt = getByClass("wrong");
	
	// STUDY-SPECIFIC CONSTANTS HERE ================
	
	var Labels = {
		EUROPEAN_AMERICAN: "European American",
		AFRICAN_AMERICAN: "African American",
		GOOD: "Good",
		BAD: "Bad"
	};
	
	var Categories = {
		TOP: "Top",
		BOT: "Bot"
	};
	
	var topLabel1 = Labels.EUROPEAN_AMERICAN;
	var topPrompts1 = generateImagePrompts([
		"http://i.imgur.com/tv3ZlCw.jpg",
		"http://i.imgur.com/vdEDIDp.jpg",
		"http://i.imgur.com/kqJqDWl.jpg",
		"http://i.imgur.com/tBi50P0.jpg",
		"http://i.imgur.com/Bny77r0.jpg",
		"http://i.imgur.com/Nxf4wET.jpg"
	], topLabel1);
	
	var topLabel2 = Labels.AFRICAN_AMERICAN;
	var topPrompts2 = generateImagePrompts([
		"http://i.imgur.com/MfijVQp.jpg",
		"http://i.imgur.com/fUNex5R.jpg",
		"http://i.imgur.com/RMHE748.jpg",
		"http://i.imgur.com/RiN4gbb.jpg",
		"http://i.imgur.com/OAKAEXh.jpg",
		"http://i.imgur.com/QFngGdN.jpg"
	], topLabel2);
	
	var botLabel1 = Labels.GOOD;
	var botPrompts1 = generateTextPrompts([
		"Joy",
		"Love",
		"Peace",
		"Wonderful",
		"Pleasure",
		"Glorious",
		"Laughter",
		"Happy"
	], botLabel1);
	
	var botLabel2 = Labels.BAD;
	var botPrompts2 = generateTextPrompts([
		"Agony",
		"Terrible",
		"Horrible",
		"Nasty",
		"Evil",
		"Awful",
		"Failure",
		"Hurt"
	], botLabel2);
	
	var allPrompts = joinArrays(
		topPrompts1,
		topPrompts2,
		botPrompts1,
		botPrompts2
	);
	
	// PROGRAM VARIABLES ============================
	
	var blockInput = true;
	
	var loadedElts = 0;
	
	var trial = 0;
	
	var responses = [];
	
	var topLeftLabel = null;
	var topRiteLabel = null;
	var botLeftLabel = null;
	var botRiteLabel = null;
	
	var trialResponse = [];
	
	var startTime = null;
	var index = -1;
	var currWrongs = 0;
	
	var state = {};
	
	// INITIALIZATION ===============================
	
	qualtrics.hideNextButton();
	
	inputElt.style.display = "none";
	
	setExtraData(allPrompts);
	
	if (Math.random() < 0.5) {
		state.topLeft = topLabel1;
		state.topRite = topLabel2;
	} else {
		state.topLeft = topLabel2;
		state.topRite = topLabel1;
	}
	if (Math.random() < 0.5) {
		state.botLeft = botLabel1;
		state.botRite = botLabel2;
	} else {
		state.botLeft = botLabel2;
		state.botRite = botLabel1;
	}
	
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
	
	function randomNoConsecRepeat(arr, len) {
		if (len <= 0) {
			return [];
		}
		var rand = [];
		for (var i = 0; i < len; i++) {
			var minIdx = Math.min(i, 1);
			var idx = randInt(minIdx, arr.length);
			rand.push(arr[idx]);
			swap(arr, 0, idx);
		}
		return rand;
	}
	
	function getByClass(className) {
		var elts = document.getElementsByClassName(className);
		return elts ? elts[0] : null;
	}
	
	function getClassList(elt) {
		return elt.className.split(/\s+/g);
	}
	
	function setClassList(elt, classes) {
		elt.className = classes.join(" ");
	}
	
	function addClass(elt, classToAdd) {
		var classes = getClassList(elt);
		for (var i = 0; i < classes.length; i++) {
			if (classes[i] === classToAdd) {
				return elt;
			}
		}
		classes.push(classToAdd);
		setClassList(elt, classes);
		return elt;
	}
	
	function removeClass(elt, classToRemove) {
		var classes = getClassList(elt);
		var filteredClasses = [];
		for (var i = 0; i < classes.length; i++) {
			if (classes[i] !== classToRemove) {
				filteredClasses.push(classes[i]);
			}
		}
		setClassList(elt, filteredClasses);
		return elt;
	}
	
	function show(elt) {
		if (elt) {
			removeClass(elt, "hidden");
		}
	}
	
	function hide(elt) {
		if (elt) {
			addClass(elt, "hidden");
		}
	}
	
	function setExtraData(prompts) {
		for (var i = 0; i < prompts.length; i++) {
			prompts[i].extraData = {};
			switch (prompts[i].association) {
				case topLabel1:
				case topLabel2:
					prompts[i].extraData.category = Categories.TOP;
					break;
				case botLabel1:
				case botLabel2:
					prompts[i].extraData.category = Categories.BOT;
					break;
			}
			switch (prompts[i].type) {
				case Types.TEXT:
					var colorClass = "colorCat" + prompts[i].extraData.category;
					var textElt = document.createElement("div");
					textElt.innerHTML = prompts[i].text;
					textElt.className = colorClass;
					elementLoaded();
					prompts[i].extraData.element = textElt;
					break;
				case Types.IMAGE:
					var imgElt = document.createElement("img");
					imgElt.src = prompts[i].url;
					imgElt.className = "testImage";
					imgElt.onload = elementLoaded;
					prompts[i].extraData.element = imgElt;
					break;
			}
		}
		return prompts;
	}
	
	function unsetExtraData(prompts) {
		for (var i = 0; i < prompts.length; i++) {
			delete prompts[i].extraData;
		}
		return prompts;
	}
	
	function generateTextPrompts(texts, assoc) {
		var arr = [];
		for (var i = 0; i < texts.length; i++) {
			arr.push({
				type: Types.TEXT,
				text: texts[i],
				association: assoc
			});
		}
		return arr;
	}
	
	function generateImagePrompts(urls, assoc) {
		var arr = [];
		for (var i = 0; i < urls.length; i++) {
			arr.push({
				type: Types.IMAGE,
				url: urls[i],
				association: assoc
			});
		}
		return arr;
	}
	
	function appendPrompts(arr, label) {
		switch (label) {
			case topLabel1:
				appendArray(arr, topPrompts1);
				break;
			case topLabel2:
				appendArray(arr, topPrompts2);
				break;
			case botLabel1:
				appendArray(arr, botPrompts1);
				break;
			case botLabel2:
				appendArray(arr, botPrompts2);
				break;
		}
		return arr;
	}
	
	function makePrompts(label1, label2) {
		var arr = [];
		appendPrompts(arr, label1);
		appendPrompts(arr, label2);
		return arr;
	}
	
	function tryLabel(leftElt, riteElt, leftLabel, riteLabel) {
		if (leftLabel || riteLabel) {
			leftElt.innerHTML = leftLabel;
			riteElt.innerHTML = riteLabel;
			show(leftElt);
			show(riteElt);
			return true;
		} else {
			hide(leftElt);
			hide(riteElt);
			return false;
		}
	}
	
	function clearChildren(elt) {
		while (elt.lastChild) {
			elt.removeChild(elt.lastChild);
		}
	}
	
	// PROGRAM LOGIC ===================================
	
	function elementLoaded() {
		loadedElts++;
		if (loadedElts === allPrompts.length) {
			blockInput = false;
			hide(loadingElt);
			show(instrElt);
			show(testAreaElt);
			nextTrial();
		}
	}
	
	function nextTrial() {
		trial++;
		return startTrial(trial);
	}
	
	function startTrial(num) {
		switch (num) {
			case 1:
				initializeTrial(state.topLeft, state.topRite, null, null, 4, "<div>Put your middle or index fingers on the <strong>E</strong> and <strong>I</strong> keys of your keyboard.  Words or images representing the categories at the top will appear one-by-one in the middle of the screen.  When the item belongs to a category on the left, press the <strong>E</strong> key; when the item belongs to a category on the right, press the <strong>I</strong> key.  Items belong to only one category.  If you make an error, an <strong class=\"colorWrong\">X</strong> will appear - fix the error by hitting the other key.</div><br /><div>This is a timed sorting task.  <strong>GO AS FAST AS YOU CAN</strong> while making as few mistakes as possible.  Going too slow or making too many errors will result in an uninterpretable score.  This task will take about 5 minutes to complete.</div>");
				return true;
			case 2:
				initializeTrial(null, null, state.botLeft, state.botRite, 4, "<div><strong>See above, the categories have changed.</strong>  The items for sorting have changed as well.  The rules, however, are the same.</div><br /><div>When the items belong to a category on the left, press the <strong>E</strong> key; when the item belongs to a category on the right, press the <strong>I</strong> key.  Items belong to only one category.  An <strong class=\"colorWrong\">X</strong> appears after an error - fix the error by hitting the other key.  <strong>GO AS FAST AS YOU CAN.</strong></div>");
				return true;
			case 3:
				initializeTrial(state.topLeft, state.topRite, state.botLeft, state.botRite, 4, "<div><strong>See above, the four categories you saw separately now appear together.</strong>  Remember, each item belongs to only one gruop.  For example, if the categories <strong>flower</strong> and <strong>good</strong> appeared on separate sides above - pictures or words meaning <strong>flower</strong> would go in the <strong>flower</strong> category, not the <strong>good</strong>category.</div><br /><div>The <strong class=\"colorCatTop\">" + topColorName + "</strong> and <strong class=\"colorCatBot\">" + botColorName + "</strong> labels and items may help to identify the appropriate category.  Use the <strong>E</strong> and <strong>I</strong> keys to categorize items into the four groups <strong>left</strong> and <strong>right</strong>, and correct errors by hitting the other key.</div>");
				return true;
			case 4:
				initializeTrial(state.topLeft, state.topRite, state.botLeft, state.botRite, 8, "<div><strong>Sort the same four categories again.</strong>  Remember to go as fast as you can while making as few mistakes as possible.</div><br /><div>The <strong class=\"colorCatTop\">" + topColorName + "</strong> and <strong class=\"colorCatBot\">" + botColorName + "</strong> labels and items may help to identify the appropriate category.  Use the <strong>E</strong> and <strong>I</strong> keys to categorize items into the four groups <strong>left</strong> and <strong>right</strong>, and correct the errors by hitting the other key.</div>");
				return true;
			case 5:
				initializeTrial(state.topRite, state.topLeft, null, null, 4, "<div><strong>Notice above, there are only two categories and they have switched positions.</strong>  The concept that was previously on the left is now on the right, and the concept that was on the right is now on the left.  Practice this new configuration.<div><br /><div>Use the <strong>E</strong> and <strong>I</strong> keys to categorize items left and right, and correct errors by hitting the other key.</div>");
				return true;
			case 6:
				initializeTrial(state.topRite, state.topLeft, state.botLeft, state.botRite, 4, "<div><strong>See above, the four categories now appear together in a new configuration.</strong>  Remember, each item belongs to only one group.</div><br /><div>The <strong class=\"colorCatTop\">" + topColorName + "</strong> and <strong class=\"colorCatBot\">" + botColorName + "</strong> labels and items may help to identify the appropriate category.  Use the <strong>E</strong> and <strong>I</strong> keys to categorize items into the four groups <strong>left</strong> and <strong>right</strong>, and correct errors by hitting the other key.</div>");
				return true;
			case 7:
				initializeTrial(state.topRite, state.topLeft, state.botLeft, state.botRite, 8, "<div><strong>Sort the same four categories again.</strong>  Remember to go as fast as you can while making as few mistakes as possible.</div><br /><div>The <strong class=\"colorCatTop\">" + topColorName + "</strong> and <strong class=\"colorCatBot\">" + botColorName + "</strong> labels and items may help to identify the appropriate category.  Use the <strong>E</strong> and <strong>I</strong> keys to categorize items into the four groups <strong>left</strong> and <strong>right</strong>, and correct errors by hitting the other key.</div>");
				return true;
			default:
				return false;
		}
	}
	
	function initializeTrial(topLeft, topRite, botLeft, botRite, numPrompts, instrHTML) {
		topLeftLabel = topLeft;
		topRiteLabel = topRite;
		botLeftLabel = botLeft;
		botRiteLabel = botRite;
		
		var hasCatTop = tryLabel(leftCatTop, riteCatTop, topLeftLabel, topRiteLabel);
		var hasCatBot = tryLabel(leftCatBot, riteCatBot, botLeftLabel, botRiteLabel);
		
		var showOr = hasCatTop && hasCatBot;
		var orElts = document.getElementsByClassName("or");
		for (var i = 0; i < orElts.length; i++) {
			if (showOr) {
				show(orElts[i]);
			} else {
				hide(orElts[i]);
			}
		}
		
		var topPrompts = makePrompts(topLeftLabel, topRiteLabel);
		var botPrompts = makePrompts(botLeftLabel, botRiteLabel);
		
		if (topPrompts.length == 0) {
			prompts = randomNoConsecRepeat(botPrompts, numPrompts);
		} else if (botPrompts.length == 0) {
			prompts = randomNoConsecRepeat(topPrompts, numPrompts);
		} else {
			prompts = [];
			for (var i = 0; i < numPrompts; i++) {
				if (i % 2 == 0) {
					var idx = randInt(0, topPrompts.length);
					prompts.push(topPrompts[idx]);
				} else {
					var idx = randInt(0, botPrompts.length);
					prompts.push(botPrompts[idx]);
				}
			}
		}
		
		index = -1;
		
		trialResponse = {
			trial: trial,
			state: {
				topLeft: topLeft,
				topRight: topRite,
				botLeft: botLeft,
				botRight: botRite
			},
			data: []
		};
		
		trialInstrElt.innerHTML = instrHTML;
		
		show(instrElt);
		hide(promptTableElt);
		hide(promptElt);
		hide(wrongElt);
	}
	
	function getCorrectKey() {
		console.log(prompts[index]);
		switch (prompts[index].association) {
			case topLeftLabel:
			case botLeftLabel:
				return leftKey;
			case topRiteLabel:
			case botRiteLabel:
				return riteKey;
		}
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
					show(promptTableElt);
					showNextQuestion();	
				}
			} else if (index < prompts.length) {
				if (key === leftKey || key === riteKey) {
					if (key === getCorrectKey()) {
						recordResponse();
						if (index < prompts.length - 1) {
							showNextQuestion();
						} else {
							responses.push(trialResponse);
							if (!nextTrial()) {
								unsetExtraData(allPrompts);
								inputElt.value = JSON.stringify(responses);
								hide(testAreaElt);
								show(outroElt);
								qualtrics.showNextButton();
							}
						}
					} else {
						currWrongs++;
						show(wrongElt);
					}
				}
			}
		}
	}
	
	function showNextQuestion() {
		hide(wrongElt);
		hide(promptElt);
		blockInput = true;
		setTimeout(function() {
			index++;
			currWrongs = 0;
			show(promptElt);
			if (index < prompts.length) {
				console.log(prompts);
				console.log(index);
				console.log(prompts[index]);
				clearChildren(promptElt);
				promptElt.appendChild(prompts[index].extraData.element);
				startTime = performance.now();
			}
			blockInput = false;
		}, flashTime);
	}
	
	function recordResponse() {
		var currTime = performance.now();
		trialResponse.data.push({
			promptData: prompts[index],
			time: currTime - startTime,
			incorrect: currWrongs
		});
	}
});
