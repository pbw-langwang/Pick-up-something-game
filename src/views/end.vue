<template>
  <div class="endBox" :style="getBg">
    <div class="dialog" :class="win == 2 ? 'dialog_top' : 'dialog_bottom'">
      <p v-if="win == 2">挑战成功！</p>
      <p v-else>挑战失败！</p>
      <p>分数：{{ score }} 分</p>
      <p @click="gotoPlay()">重新挑战</p>
      <p @click="gotowelcome()">回到首页</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "end",
  data() {
    return {
      win: null,
      score: 0,
      backgroundImg: "",
    };
  },
  created() {
    const Query = this.$route.query;
    this.win = Query.win;
    this.score = Query.score;
    if (this.win == 1) {
      this.backgroundImg = "static/imgs/end_win.png";
    } else {
      this.backgroundImg = "static/imgs/end_fail.png";
    }
  },
  methods: {
    gotoPlay() {
      this.$router.push("/home");
    },
    gotowelcome() {
      this.$router.push("/");
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
