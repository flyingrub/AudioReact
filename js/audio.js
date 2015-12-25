function Audio() {
    // Playing
    var aela = this;
    this.audioContext;
    this.isPlaying = false;
    this.isLoading = false;
    this.audioSource;
    this.analyser;
    this.url;
    this.player;

    this.init = function(player) {
        console.log("init")
        try {
            window.AudioContext = window.AudioContext||window.webkitAudioContext;
            this.audioContext = new AudioContext();

            this.player = player;
            // Source
            this.audioSource = this.audioContext.createMediaElementSource(player);
            this.audioSource.connect(this.audioContext.destination);
            this.player.onended = aela.onended;
            this.player.onerror = aela.onerror;
            this.player.ontimeupdate = updateTimeAudio;

            // Analyser
            this.analyser = this.audioContext.createAnalyser();
            this.audioSource.connect(this.analyser)
            this.analyser.smoothingTimeConstant = 0.1;
            this.analyser.fftSize = 1024;

        } catch(e) {
            alert('Web Audio API is not supported in this browser');
            throw(e);
        }
    };

    this.pause = function() {
        console.log("pause")
        this.isPlaying = false;
        this.player.pause();
    }

    this.toggle = function () {
        if (this.isPlaying) {
            this.pause();
        }  else if (this.player.src) {
            this.play();
        }
    }

    this.load = function(url) {
        this.isLoading = true;
        this.player.setAttribute('src', url);
        this.player.load();
        this.play();
    }

    this.play = function() {
        console.log("play")
        this.isLoading = false;
        this.firstTime = true;
        this.isPlaying = true;
        this.player.play();
    }

    this.onended = function(url) {
        aela.isPlaying = false;
        playNextFromTracklist();
    }

    this.onerror = function() {
        aela.isPlaying = false;
        showNotificationError();
    }

    // Analysing
    this.bass, this.mid, this.high;
    this.volume;
    this.smoothedVolume;
    this.smoothedBass;
    this.firstTime;
    this.thresold;
    this.beat;
    this.hold=100;
    this.beatAmount;

    this.detectBeat = function() {
        this.bass = 0, this.mid = 0, this.high = 0;
        this.volume = 0;

        var bufferLength = this.analyser.frequencyBinCount;
        var freqData = new Uint8Array(bufferLength);
        this.analyser.getByteFrequencyData(freqData);

        for(var i = 0; i < bufferLength; i++) {
            if (i < 20){
                this.bass += freqData[i]
            }
            this.volume += freqData[i];
        }

        this.bass = this.bass / 20;
        this.volume = this.volume / bufferLength;

        if (this.firstTime) {
            this.firstTime = false;
            this.thresold = this.volume+10;
            this.smoothedVolume = this.volume;
            this.smoothedBass = this.bass;
        } else {
            this.smoothedVolume += (this.volume  - this.smoothedVolume) * 0.2;
            this.smoothedBass += (this.bass  - this.smoothedBass) * 0.2;
        }
        if (this.smoothedVolume > this.thresold) {
             if (this.hold <= 0) {
                this.beat = true
                this.beatAmount = (this.smoothedVolume - this.thresold) * 2 /3 + 4
            } else {
                this.beat = false
            }
            this.hold = 50
            this.thresold = this.smoothedVolume;
        } else {
            if (this.hold > 0) {
                this.hold -=1;
            } else {
                this.thresold = this.thresold - 0.2
            }
            this.beat = false
        }
        //console.log("beatdetection", this.beat, this.hold, this.thresold)

    };
}
