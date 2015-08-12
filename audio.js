var Alea = function() {
    var aela = this;
    this.audioContext;
    this.isPlaying = false;
    this.audioSource;
    this.buffer;
    this.analyser;
    this.isLoading = false;
    this.file;

    this.bass, this.mid, this.high;
    this.volume;


    this.initAudio = function() {
        try {
            window.AudioContext = window.AudioContext||window.webkitAudioContext;
            audioContext = new AudioContext();
            this.loadFile();
            if (this.audioSource) {
                this.audioSource.stop();
            }
        } catch(e) {
            alert('Web Audio API is not supported in this browser' + e);
        }
    };

    this.playSound = function() {
        // Source
        this.audioSource = audioContext.createBufferSource();
        this.audioSource.buffer = buffer;
        this.audioSource.connect(audioContext.destination);
                
        // Analyser
        this.analyser = audioContext.createAnalyser();
        this.audioSource.connect(this.analyser)
        this.analyser.smoothingTimeConstant = 0.1;
        this.analyser.fftSize = 1024;
        
        this.audioSource.start(0);
        this.isPlaying = true;
        this.isLoading = false;
    };

    this.loadFile = function() {
        this.isLoading = true;
        var req = new XMLHttpRequest();
        req.open("GET", this.file, true);
        req.responseType = "arraybuffer";
        req.onload = function() {
            //decode the loaded data

            audioContext.decodeAudioData(req.response, function(b) {
                buffer = b;
                aela.playSound();
            });
        };
        req.onerror = function() {
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
