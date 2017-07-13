Qualtrics.SurveyEngine.addOnload(function()
{
	/*Place Your Javascript Below This Line*/
	
	// PROGRAM CONSTANTS HERE =======================
	
	var qualtrics = this;
	
	var spaceKey = 32;    // Space bar key
	var leftKey  = 37;    // Left arrow key
	var riteKey  = 39;    // Right arrow key
	
	var inputID = "QR~" + this.questionId;
	var inputElt = $(inputID);
	
	var loadingElt = getByClass("tindr_loadingMessage");
	var instrElt = getByClass("tindr_instructions");
	var outroElt = getByClass("tindr_outro");
	
	var profileElt = getByClass("tindr_profileArea");
	var picsElt = getByClass("tindr_profilePictures");
	var nameElt = getByClass("tindr_profileName");
	var descElt = getByClass("tindr_profileDesc");
	
	// USER-DEFINED PARAMETERS HERE =================
	
	var profiles = shuffle([
		{
			id: "X1337",
			name: "Master Yi",
			url: "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/MasterYi_0.jpg",
			description: "Melee, Jungler, Hard Carry"
		},
		{
			id: "X1338",
			name: "Ashe",
			url: "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ashe_0.jpg",
			description: "Marksman, Utility, Carry"
		},
		{
			id: "X1339",
			name: "Jax",
			url: "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jax_4.jpg",
			description: "Flexible, Melee, Duelist"
		},
		{
			id: "X1340",
			name: "Annie",
			url: "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/Annie_8.jpg",
			description: "Young, Cute, Deadly"
		}
	]);
	
	// PROGRAM VARIABLES ============================
	
	var imageElts = [];
	
	var responses = [];
	
	var index = -1;
	var loaded = 0;
	var currImage = null;
	var startTime = null;
	
	// INITIALIZATION ===============================
	
	qualtrics.hideNextButton();
	
	inputElt.style.display = "none";
	
	preloadProfilePictures();
	
	// HELPER FUNCTIONS ==============================
	
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
	
	function shuffle(arr) {
		for (var i = arr.length - 1; i > 0; i--) {
			var idx = ~~(Math.random() * (i + 1));
			var tmp = arr[i];
			arr[i] = arr[idx];
			arr[idx] = tmp;
		}
		return arr;
	}
	
	function preloadProfilePictures() {
		for (var i = 0; i < profiles.length; i++) {
			var img = document.createElement("img");
			img.className = "tindr_profilePicture hidden";
			img.src = profiles[i].url;
			picsElt.appendChild(img);
			img.onload = imageLoaded;
			imageElts.push(img);
		}
	}
	
	// PROGRAM LOGIC ===================================
	
	function imageLoaded() {
		loaded++;
		if (loaded === profiles.length) {
			hide(loadingElt);
			show(instrElt);
		}
	}
	
	function recordResponse(key) {
		var swipe = (key === leftKey) ? 'L' : 'R';
		var currTime = performance.now();
		var elapsedTime = currTime - startTime;
		responses.push({
			profile: profiles[index],
			choice: swipe,
			time: elapsedTime
		});
	}
	
	function loadNextQuestion() {
		index++;
		if (index < profiles.length) {
			var prof = profiles[index];
			hide(currImage);
			currImage = imageElts[index];
			show(currImage);
			nameElt.innerHTML = prof.name;
			descElt.innerHTML = prof.description;
			startTime = performance.now();
		} else {
			inputElt.value = JSON.stringify(responses);
			hide(profileElt);
			show(outroElt);
			qualtrics.showNextButton();
		}
	}
	
	document.onkeydown = function(e) {
		if (loaded === profiles.length) {
			var key = window.event ? (event.keyCode || event.which) : (e.keyCode || e.which);
			if (index < 0) {
				if (key === spaceKey) {
					hide(instrElt);
					show(profileElt);
					loadNextQuestion();
				}
			} else if (index < profiles.length) {
				if (key === leftKey || key === riteKey) {
					recordResponse(key);
					loadNextQuestion();
				}
			}
		}
	}
});
