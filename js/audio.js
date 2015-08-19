function Alea() {
    // Playing
    var aela = this;
    this.audioContext;
    this.isPlaying = false;
    this.audioSource;
    this.buffer;
    this.analyser;
    this.isLoading = false;
    this.url;

    this.initAudio = function() {
        console.log("init")
        try {
            window.AudioContext = window.AudioContext||window.webkitAudioContext;
            this.audioContext = new AudioContext();
            this.loadUrl();
        } catch(e) {
            alert('Web Audio API is not supported in this browser' + e);
        }
    };

    this.stopSound = function() {
        console.log("stop")
        if (this.audioSource){
            this.audioSource.stop();
        }
        this.isPlaying = false;
        this.firstTIme = true
    }

    this.playSound = function() {
        console.log("playSound", this.buffer)
        if (this.isPlaying) {
            this.stopSound();
        }
        // Source
        this.audioSource = this.audioContext.createBufferSource();
        this.audioSource.buffer = this.buffer;
        this.audioSource.connect(this.audioContext.destination);
        this.audioSource.onended = function() {
            aela.isPlaying = false;
            console.log("end")
        }

        // Analyser
        this.analyser = this.audioContext.createAnalyser();
        this.audioSource.connect(this.analyser)
        this.analyser.smoothingTimeConstant = 0.1;
        this.analyser.fftSize = 1024;
        
        this.audioSource.start(0);
        this.isPlaying = true;
        this.isLoading = false;
    };

    this.loadUrl = function() {
        console.log("loadUrl")
        this.isLoading = true;
        var req = new XMLHttpRequest();
        req.open("GET", this.url, true);
        req.responseType = "arraybuffer";
        req.onload = function() {
            //decode the loaded data

            aela.audioContext.decodeAudioData(req.response, function(b) {
                aela.buffer = b;
                aela.playSound();
            });
        };
        req.onerror = function() {
            aela.isLoading = false;
            unPlayableSong();
        }
  
        req.send();

    };

    // Analysing
    this.bass, this.mid, this.high;
    this.volume;
    this.smoothedVolume;
    this.smoothedBass;
    this.firstTIme;
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

        if (this.firstTIme) {
            this.firstTIme = false;
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
