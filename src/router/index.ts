import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import store from "../store";
import Home from "../views/Home.vue";
import PochetteDetails from "../views/PochetteDetails.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/pochettes/:id/:slug",
    name: "pochettes",
    component: PochetteDetails
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (
    to.matched.some(record => record.meta.requireLogin) &&
    !store.state.isAuthenticated
  ) {
    next({ name: "LogIn", query: { to: to.path } });
  } else {
    next();
  }
});

export default router;
