(function (root) {
    function AudioManage() {
        this.audio = new Audio();
        this.status = "pause";
    }

    AudioManage.prototype = {
        load(src) {
            this.audio.src = src;
            this.audio.load();
        },
        play() {
            this.audio.play();
            this.status = "play";
        },
        pause() {
            this.audio.pause();
            this.status = "pause";
        },
        end(fn) {
            this.audio.onended = fn;
        },
        playTo(time) {
            this.audio.currentTime = time; 
        }
    }
    root.music = new AudioManage();
})(window.player || (window.player = {}))