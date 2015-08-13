function Alea() {
    var aela = this;
    this.audioContext;
    this.isPlaying = false;
    this.audioSource;
    this.buffer;
    this.analyser;
    this.isLoading = false;
    this.url;

    this.bass, this.mid, this.high;
    this.volume;


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
        if (this.audioSource !== undefined){
            this.audioSource.stop();
        }
        this.isPlaying = false;
    }

    this.playSound = function() {
        console.log("playSound")
        if (this.isPlaying) {
            this.stopSound();
        }
        // Source
        this.audioSource = this.audioContext.createBufferSource();
        this.audioSource.buffer = this.buffer;
        this.audioSource.connect(this.audioContext.destination);
                
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

    this.detectBeat = function() {
        this.bass = 0, this.mid = 0, this.high = 0;
        this.volume = 0;

        var bufferLength = this.analyser.frequencyBinCount;
        var freqData = new Uint8Array(bufferLength);
        this.analyser.getByteFrequencyData(freqData);

        for(var i = 0; i < bufferLength; i++) {
            if (i < 100){
                this.bass += freqData[i]
            }
            this.volume += freqData[i];
        }
        this.volume = this.volume / 5
    };
}
