<template>
  <div class="endBox" :style="getBg">
    <div class="dialog" :class="win == 2 ? 'dialog_top' : 'dialog_bottom'">
      <p v-if="win == 2">挑战成功！</p>
      <p v-else>挑战失败！</p>
      <p>分数：{{ score }} 分</p>
      <p @click="gotoPlay()">重新挑战</p>
      <p @click="gotowelcome()">回到首页</p>
    </div>

    <audio
      ref="winAudio"
      src="static/audio/game_win.mp3"
      @click="winPlay()"
    ></audio>
    <audio
      ref="failAudio"
      src="static/audio/game_fail.mp3"
      @click="failPlay()"
    ></audio>
  </div>
</template>

<script>
export default {
  name: "end",
  data() {
    return {
      win: null, // 1 失败  2 成功
      score: 0,
      backgroundImg: "",
    };
  },
  created() {
    const Query = this.$route.query;
    this.win = Query.win;
    this.score = Query.score;
  },
  mounted() {
    if (this.win == 2) {
      this.backgroundImg = "static/imgs/end_win.png";
      setTimeout(() => {
        this.winPlay();
      }, 500);
    } else {
      this.backgroundImg = "static/imgs/end_fail.png";
      setTimeout(() => {
        this.failPlay();
      }, 500);
    }
  },
  methods: {
    gotoPlay() {
      this.$refs.winAudio.pause();
      this.$refs.failAudio.pause();
      this.$router.push("/home");
    },
    gotowelcome() {
      this.$refs.winAudio.pause();
      this.$refs.failAudio.pause();
      this.$router.push("/");
    },
    winPlay() {
      this.$refs.winAudio.load();
      this.$refs.winAudio.play();
    },
    failPlay() {
      this.$refs.failAudio.load();
      this.$refs.failAudio.play();
    },
  },
  computed: {
    getBg() {
      return { backgroundImage: `url(${this.backgroundImg})` };
    },
  },
};
</script>

<style lang="scss" scoped>
.endBox {
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  position: relative;
}

.dialog {
  width: 100%;
  font-size: 100px;
  line-height: 150px;
  text-align: center;
  position: absolute;
}
.dialog_bottom {
  bottom: 30px;
}
.dialog_top {
  top: 30px;
}
</style>
