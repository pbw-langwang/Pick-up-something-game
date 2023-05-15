import Vue from "vue";
import VueRouter from "vue-router";
import welcome from "../views/welcome.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "welcome",
    component: welcome,
  },
  {
    path: "/home",
    name: "Home",
    // eslint-disable-next-line
    component: ()=>import("../views/Home.vue")
  },
  {
    path: "/end",
    name: "end",
    // eslint-disable-next-line
    component: ()=>import("../views/end.vue")
  },
];

const router = new VueRouter({
  routes,
});

export default router;
