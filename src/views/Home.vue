<template>
  <div class="home">
    <div class="factoryBox">
      <div
        class="product"
        v-for="item in creatList"
        :key="item.id"
        :id="'product' + item.id"
        :style="getStyle(item)"
      >
        <img :src="item.backImgurl" />
      </div>
    </div>

    <div class="scoreBox">
      <p>
        时间：
        <span :class="GameDuration < 20 ? 'redTxt' : ''">
          {{ GameDuration }} 秒
        </span>
      </p>
      <p>分数：{{ score }}</p>
    </div>

    <div class="player" @click="goto($event)">
      <img
        :style="getStyle2()"
        src="../assets/imgs/xiong/x1.png"
        alt="小熊头像"
      />
    </div>

    <audio
      ref="zongziAudio"
      src="static/audio/zongzi.mp3"
      @click="zingziPlay()"
    ></audio>
  </div>
</template>

<script>
// 消息
import Stomp from "stompjs";
import { MQ_SERVICE, MQ_USERNAME, MQ_PASSWORD } from "@/tools/stompSet.js";

import { v4 as uuidv4 } from "uuid";

export default {
  name: "Home",
  data() {
    return {
      createProductTimer1: null,
      createProductTimer2: null,
      creatList: [],
      playerObj: {
        winX: 0,
      },
      score: 0,

      // 消息
      client: Stomp.client(MQ_SERVICE),

      // 游戏时长
      // eslint-disable-next-line
      GameDuration: gloableData.gameTime,
      GameDurationTimer: null,
    };
  },
  created() {
    const _this = this;
    class Factory {
      constructor(winX, winY, index, type) {
        this.id = uuidv4();
        this.winX = winX;
        this.winY = winY;
        this.timer = null;
        this.type = type;
        this.zIndex = type;
        // type： 1 粽子  2  五毒
        if (this.type == 1) {
          this.backImgurl = require(`../assets/imgs/zongzi/z${index}.png`);
        } else {
          this.backImgurl = require(`../assets/imgs/wudu/du${index}.png`);
        }
        this.fall();
      }

      fall() {
        this.timer = setInterval(() => {
          // eslint-disable-next-line
          this.winY += gloableData.Dropdistance;
          // 碰到熊猫事件
          if (
            this.winX >= _this.playerObj?.winX - 150 &&
            this.winX <= _this.playerObj?.winX + 150 &&
            this.winY >= 2160 - 180 * 2 &&
            this.winY < 2140
          ) {
            // 为粽子 加分
            if (this.type == 1) {
              clearInterval(this.timer);
              this.timer = null;
              const index = _this.creatList.findIndex((item) => {
                return item.winX == this.winX;
              });
              if (index >= 0) {
                // eslint-disable-next-line
                _this.score += gloableData.gameScore;

                // 播放声音
                _this.zingziPlay();

                // 防止五毒在最下面积累过多
                if (index < 3) {
                  _this.creatList.splice(index, 1);
                } else {
                  _this.creatList.splice(index, 1);
                  _this.creatList.splice(0, 1);
                }
              }
            } else {
              // 为五毒，失败
              clearInterval(this.timer);
              this.timer = null;
              const index = _this.creatList.findIndex((item) => {
                return item.winX == this.winX;
              });

              // 播放声音
              if (document.getElementById("dumusic")) {
                const dumusic = document.getElementById("dumusic");
                dumusic.play();
              }

              if (index >= 0) {
                _this.$router.push({
                  path: "/end",
                  query: {
                    // win  1 失败  2 成功
                    win: 1,
                    score: _this.score,
                  },
                });
              }
            }
          } else {
            // 下落触底事件
            if (this.winY > 2160) {
              clearInterval(this.timer);
              this.timer = null;
              // 加上这个判断就不会让消失线上移
              // 大致原因：清除第一个过快
              // eslint-disable-next-line
              if (_this.creatList.length > gloableData.Maxnum - 1) {
                const index = _this.creatList.findLastIndex((item) => {
                  // eslint-disable-next-line
                  return item.winY >= 2160;
                });
                _this.creatList.splice(0, index - 1);
              }
            }
          }
          // eslint-disable-next-line
        }, gloableData.Droptime);
      }
    }

    this.createProductTimer1 = setInterval(() => {
      const X = Math.random() * 390 * 10;
      const I = Math.floor(Math.random() * 5) + 1;

      // 避免重叠
      let canshow;
      if (this.creatList.length > 1) {
        canshow =
          X < this.creatList[this.creatList.length - 1].winX - 300 ||
          X > this.creatList[this.creatList.length - 1].winX + 300;
      } else {
        canshow = true;
      }

      // eslint-disable-next-line
      if (canshow && this.creatList.length < gloableData.Maxnum) {
        const product = new Factory(X, 0, I, 2);
        this.creatList.push(product);
      }
      // eslint-disable-next-line
    }, gloableData.Wdtime * 1000);

    this.createProductTimer2 = setInterval(() => {
      const X = Math.random() * 390 * 10;
      const I = Math.floor(Math.random() * 3) + 1;
      // eslint-disable-next-line
      if (this.creatList.length < gloableData.Maxnum) {
        const product = new Factory(X, 0, I, 1);
        this.creatList.push(product);
      }
      // eslint-disable-next-line
    }, gloableData.Zztime * 1000);

    this.GameDurationTimer = setInterval(() => {
      this.GameDuration--;
      if (this.GameDuration <= 0) {
        this.$router.push({
          path: "/end",
          query: {
            win: 2,
            score: _this.score,
          },
        });
      }
    }, 1000);

    // 消息
    this.connect();
  },
  methods: {
    getStyle(data) {
      return {
        left: data.winX + "px",
        top: data.winY + "px",
        zIndex: data.zIndex,
      };
    },
    getStyle2() {
      return {
        left: this.playerObj?.winX + "px",
      };
    },
    goto(e) {
      this.playerObj.winX = e.clientX;
    },
    zingziPlay() {
      this.$refs.zongziAudio.load();
      this.$refs.zongziAudio.play();
    },

    // 消息
    connect() {
      var headers = {
        login: MQ_USERNAME,
        passcode: MQ_PASSWORD,
      };
      this.client.connect(headers, this.onConnected, this.onFailed);
      this.client.heartbeat.outgoing = 0; // 客户端不发送
      this.client.heartbeat.incoming = 10000;
    },
    // eslint-disable-next-line
    onConnected(frame) {
      console.log("mq连接成功");
      // eslint-disable-next-line
      var event_message = gloableData.stomp_event_message;
      this.client.subscribe(
        event_message,
        this.responseCallbackArea,
        this.onFailed
      );
    },
    onFailed(frame) {
      console.log("连接失败: " + frame);
      this.client = Stomp.client(MQ_SERVICE);
      this.connect();
    },
    // 处理
    responseCallbackArea(frame) {
      const detail = JSON.parse(frame.body);
      console.log(detail);
    },
  },
  beforeDestroy() {
    clearInterval(this.createProductTimer1);
    clearInterval(this.createProductTimer2);
    clearInterval(this.GameDurationTimer);

    this.createProductTimer1 = null;
    this.createProductTimer2 = null;
    this.GameDurationTimer = null;

    this.creatList = [];
    this.score = 0;
    this.playerObj = {
      winX: 4200,
    };
    setTimeout(() => {
      this.playerObj = null;
    }, 4000);
  },
};
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  background: url("~@/assets/imgs/3_bak.jpeg");
  background-size: 100% 100%;
}
.factoryBox {
  width: 100%;
  height: 0px;
  background-color: aqua;
  position: relative;
  top: 0px;
}
.product {
  position: absolute;
  width: 180px;
  height: 180px;
  img {
    width: 100%;
    height: 100%;
  }
}
.scoreBox {
  position: fixed;
  top: 20px;
  left: 40px;
  font-size: 50px;
  color: orange;
  .redTxt {
    color: red;
    font-size: 60px;
  }
}
.player {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 180px;
  z-index: 9;
  img {
    position: absolute;
    width: 180px;
    height: 180px;
  }
}
</style>
