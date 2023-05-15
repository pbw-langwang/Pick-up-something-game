<template>
  <div class="startBox">
    <div class="startBtn" :style="getBg">
      <p @click="gotoPlay()">开始挑战</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "welcome",
  methods: {
    gotoPlay() {
      this.$router.push("/home");
    },
  },
  computed: {
    getBg() {
      return { backgroundImage: `url(static/imgs/start.png)` };
    },
  },
};
</script>

<style lang="scss" scoped>
.startBox {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.startBtn {
  // background-image: url("static/imgs/start.png");  --> 不显示
  // background-image: url("../../public/static/imgs/start.png");  --> 显示
  background-size: 100% 100%;
  width: 1996px;
  height: 826px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 100px;
  p {
    margin-top: 100px;
  }
}
</style>
