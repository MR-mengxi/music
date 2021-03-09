(function (root) {
    //进度条
    function Progress() {
        this.durTime = 0;
        this.frameId = null;
        this.startTime = 0;
        this.lastPercent = 0;
        this.init();
    }
    Progress.prototype = {
        init: function () {
            console.log('init');

            this.getDom();
        },
        getDom: function () {
            this.curTime = document.querySelector('.curTime');
            this.circle = document.querySelector('.circle');
            this.frontBg = document.querySelector('.frontBg');
            this.totalTime = document.querySelector('.totalTime');
        },
        renderAllTime: function (time) {
            this.durTime = time;

            time = this.formatTime(time);

            this.totalTime.innerHTML = time;
        },
        formatTime: function (time) {
            time = Math.round(time);

            //266
            let m = Math.floor(time / 60);
            let s = time % 60;

            m = m < 10 ? '0' + m : m;
            s = s < 10 ? '0' + s : s;

            return m + ':' + s;
        },
        move: function (per) {
            cancelAnimationFrame(this.frameId);
            let that = this;

            this.lastPercent = per === undefined ? this.lastPercent : per;

            this.startTime = new Date().getTime();

            function frame() {
                let curTime = new Date().getTime();
                let per = that.lastPercent + (curTime - that.startTime) / (that.durTime * 1000);

                if (per <= 1) {
                    that.update(per);
                } else {
                    cancelAnimationFrame(that.frameId);
                }

                that.frameId = requestAnimationFrame(frame);
            }
            frame();
        },
        update: function (per) {
            let time = this.formatTime(per * this.durTime);
            this.curTime.innerHTML = time;

            this.frontBg.style.width = per * 100 + '%';

            let l = per * this.circle.parentNode.offsetWidth;
            this.circle.style.transform = 'translateX(' + l + 'px)';
        },
        stop: function () {
            cancelAnimationFrame(this.frameId);

            let stopTime = new Date().getTime();

            this.lastPercent += (stopTime - this.startTime) / (this.durTime * 1000);

        }
    }

    function instanceProgress() {
        return new Progress();
    }



    function Drag(obj) {
        this.obj = obj;
        this.startPointX = 0;
        this.startLeft = 0;
        this.percent = 0;
    }
    Drag.prototype = {
        init() {
            this.obj.style.transform = `translateX(0)`;

            this.obj.addEventListener("touchstart", (ev) => {
                this.startPointX = ev.changedTouches[0].pageX;
                this.startLeft = parseFloat(this.obj.style.transform.split("(")[1]);
                this.start && this.start();
            });

            this.obj.addEventListener("touchmove", (ev) => {
                this.disPointX = ev.changedTouches[0].pageX - this.startPointX;
                let l = this.startLeft + this.disPointX;
                if (l < 0) {
                    l = 0;
                } else if (l > this.obj.offsetParent.offsetWidth) {
                    l = this.obj.offsetParent.offsetWidth;
                }
                this.obj.style.transform = `translateX${l}px`;

                this.percent = l / this.obj.offsetParent.offsetWidth;
                this.move && this.move(this.percent);

                ev.preventDefault();
            });

            this.obj.addEventListener("touchend", () => {
                this.end && this.end(this.percent);
            });
        }
    }
    function instanceDrag(obj) {
        return new Drag(obj)
    }

    root.progress = {
        pro: instanceProgress,
        drag: instanceDrag
    }

})(window.player || (window.player = {}));