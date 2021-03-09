(function ($, player) {
    function MusicPlayer(dom) {
        this.wrap = dom;
        this.dataList = [];
        this.indexObj = null; 
        this.timer = null; 
        this.curIndex = 0; 
        this.list = null; 

        this.progress = player.progress.pro(); 
    }

    MusicPlayer.prototype = {
        init() {
            this.getDom();
            this.getData("../mock/data.json");
        },
        getDom() {
            this.record = document.querySelector(".songImg img");
            this.controlBtns = document.querySelectorAll(".control li"); 
        },
        getData(url) {
            let that = this;
            $.ajax({
                url: url,
                method: "get",
                success: function (data) {
                    that.dataList = data; 
                    that.listPlay();
                    that.indexObj = new player.controlIndex(data.length); 
                    that.loadMusic(that.indexObj.index); 
                    that.musicControl(); 
                    that.dragProgress();
                },
                error: function () {
                    console.log("数据请求失败");
                }
            })
        },
        loadMusic(index) {
            player.render(this.dataList[index]);
            player.music.load(this.dataList[index].audioSrc);
            this.progress.renderAllTime(this.dataList[index].duration);

            
            if (player.music.status === "play") {
                player.music.play();
                this.controlBtns[2].className = "playing"; 
                this.imgRotate(0);
                this.progress.move(0);
            }
            this.list.changeSelect(index);
            this.curIndex = index;
            player.music.end(() => {
                this.loadMusic(this.indexObj.next());
            })
        },
        musicControl() { // 控制音乐，上一首，下一首
            // 上一首
            this.controlBtns[1].addEventListener("touchend", () => {
                player.music.status = "play";
                this.loadMusic(this.indexObj.prev());
            })

            // 播放，暂停
            this.controlBtns[2].addEventListener("touchend", () => {
                if (player.music.status === "play") {
                    player.music.pause(); 
                    this.controlBtns[2].className = ""; 
                    this.imgStop(); 
                } else {
                    player.music.play();
                    this.controlBtns[2].className = "playing";
                    let deg = this.record.dataset.rotate || 0;
                    this.imgRotate(deg); 
                    this.progress.move();
                }
            })

            // 下一首
            this.controlBtns[3].addEventListener("touchend", () => {
                player.music.status = "play";
                this.loadMusic(this.indexObj.next());
            })
        },
        imgRotate(deg) { // 旋转唱片
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                deg = +deg + 0.2; // 前面的加号是把字符串转为数字
                this.record.style.transform = `rotate(${deg}deg)`;
                this.record.dataset.rotate = deg; // 把旋转的角度存到标签身上，为了暂停后继续播放能取到
            }, 1000 / 60);
        },
        imgStop() {
            clearInterval(this.timer);
        },
        listPlay() { // 列表切歌
            this.list = player.listControl(this.dataList, this.wrap);
            this.controlBtns[4].addEventListener("touchend", () => {
                this.list.slideUp();
            })
            this.list.musicList.forEach((item, index) => {
                item.addEventListener("touchend", () => {
                    if (this.curIndex === index) {
                        return;
                    }
                    player.music.status = "play";
                    this.indexObj.index = index;
                    this.loadMusic(index);
                    this.list.slideDown();
                })
            });
        },
        dragProgress() {
            let that = this;
            const circle = player.progress.drag(document.querySelector(".circle"));
            circle.init();
            circle.start = function () {
                that.progress.stop();
            }
            circle.move = function (per) {
                that.progress.update(per);
            }
            circle.end = function (per) {
                const cutTime = per * that.dataList[that.indexObj.index].duration;
                player.music.playTo(cutTime);
                player.music.play();
                that.progress.move(per);
                let deg = that.record.dataset.rotate || 0;
                that.imgRotate(deg);
                that.controlBtns[2].className = "playing";

               
            }
        }
    }

    const musicPlayer = new MusicPlayer(document.getElementById("wrap"));
    musicPlayer.init();

})(window.Zepto, window.player);