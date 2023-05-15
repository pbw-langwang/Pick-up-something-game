const path = require("path");
const resolve = (dir) => path.join(__dirname, dir);
module.exports = {
  publicPath:
    process.env.NODE_ENV === "production"
      ? "./" // 生产环境
      : "/", // 开发环境
  chainWebpack(config) {
    config.resolve.alias.set("@", resolve("src"));
  },
};
