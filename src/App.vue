<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  mounted() {
    const audiodom2 = document.createElement("audio");
    audiodom2.setAttribute("id", "dumusic");
    audiodom2.setAttribute("src", "static/audio/du.mp3");
    document.body.appendChild(audiodom2);
  },
};
</script>

<style lang="scss">
@import url("./assets/css/common.scss");

#app {
  width: 4096px;
  height: 2160px;
  overflow: hidden;
}
</style>
