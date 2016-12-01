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
	
	var loadingElt = getByClass("loadingMessage");
	var instrElt = getByClass("instructions");
	var outroElt = getByClass("outro");
	
	var profileElt = getByClass("profileArea");
	var picsElt = getByClass("profilePictures");
	var nameElt = getByClass("profileName");
	var descElt = getByClass("profileDesc");
	
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
			img.className = "profilePicture";
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
