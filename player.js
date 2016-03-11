window.onload = function() {
	var formatTime = function(rawTime) {
		var sec_num = parseInt(rawTime, 10);
		if(isNaN(sec_num)){
			return '00:00:00';
		}
		var hours   = Math.floor(sec_num / 3600);
		var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		var seconds = sec_num - (hours * 3600) - (minutes * 60);
		if (hours < 10){hours = '0' + hours;}
		if (minutes < 10){minutes = '0' + minutes;}
		if (seconds < 10){seconds = '0' + seconds;}
		return hours + ':' + minutes + ':' + seconds;
	}

	// Keep video standard JS DOM element for HTML5 Video API
	var video = document.getElementById("video"),
	videoContainer = $("#video-container"),
	controls = $("#video-controls"),
	playButton = $("#play-pause"),
	muteButton = $("#mute"),
	lightsButton = $("#lights"),
	fullScreenButton = $("#fullscreen"),
	timeCurrent = $("#timeCurrent"),
	timeDuration = $("#timeDuration"),
	seekBar = $("#seek-bar"),
	seekBarWrapper = $("#seek-bar-wrapper"),
	volumeBar = $("#volume-bar"),
	timeoutId = 0;
	videoContainer.mousemove(function() {
		controls.fadeIn('400');
		clearTimeout(timeoutId);
		timeoutId = window.setTimeout(function(){controls.fadeOut('100');}, 4000);
	});

	video.addEventListener("click", function(){
		if (video.paused == true) {
			video.play();
			playButton.html('<span class="icon-pause" aria-hidden="true"></span>');
		} else {
			video.pause();
			playButton.html('<span class="icon-play" aria-hidden="true"></span>');
		}
	}, false);
	video.addEventListener("timeupdate", function() {
		var value = (100 / video.duration) * video.currentTime;
		seekBar.val(value);
		timeCurrent.text(formatTime(video.currentTime));
		if(timeDuration.text() == '00:00:00'){
			timeDuration.text(formatTime(video.duration));
		}
	});
	playButton.click(function() {
		if (video.paused == true) {
			video.play();
			playButton.html('<span class="icon-pause" aria-hidden="true"></span>');
		} else {
			video.pause();
			playButton.html('<span class="icon-play" aria-hidden="true"></span>');
		}
	});
	muteButton.click(function() {
		if (video.muted == false) {
			video.muted = true;
			muteButton.text("Muted");
		} else {
			if(video.volume != 0){
				video.muted = false;
				muteButton.text(video.volume*100);
			}
		}
	});
	lights.addEventListener("click", function(){
		if($("span", this).hasClass('icon-sun-2')){
			$(this).html('<span class="icon-sun" aria-hidden="true"></span>');
			$("#page-cover").fadeOut(300, function() {            
				videoContainer.css({'z-index':1});
			});
		}
		else {
			$(this).html('<span class="icon-sun-2" aria-hidden="true"></span>');
			videoContainer.css({'z-index':9999});
			$("#page-cover").css("opacity",0.75).fadeIn(300);
		}
	});
	fullScreenButton.click(function() {
		if(!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
			if(video.requestFullscreen) {
				video.requestFullscreen();
			} else if(video.msRequestFullscreen) {
				video.msRequestFullscreen();
			} else if(video.mozRequestFullScreen) {
				video.mozRequestFullScreen();
			} else if(video.webkitRequestFullscreen) {
				video.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			}
		} else {
			if(document.exitFullscreen) {
				document.exitFullscreen();
			} else if(document.msExitFullscreen) {
				document.msExitFullscreen();
			} else if(document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if(document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			}
		}
	});
	seekBar.on('input', function() {
		var time = video.duration * (seekBar.val() / 100);
		video.currentTime = time;
	});
	seekBarWrapper.mousedown(function() {
		video.pause();
		playButton.html('<span class="icon-play" aria-hidden="true"></span>');
	});
	seekBarWrapper.mouseup(function() {
		video.play();
		playButton.html('<span class="icon-pause" aria-hidden="true"></span>');
	});
	volumeBar.on('input', function() {
		video.volume = volumeBar.val()/100;
		if(volumeBar.val() == 0){
			video.muted = true;
			muteButton.text("Muted")
		}
		else {
			video.muted = false;
			muteButton.text(volumeBar.val());
		}
	});
	videoContainer.mouseleave(function(){
		controls.fadeOut('400');
	});
	videoContainer.mouseenter(function(){
		controls.fadeIn('400');
	});
	timeDuration.text(formatTime(video.duration));
}