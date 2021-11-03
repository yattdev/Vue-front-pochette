import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import axios from "axios";
import VueAxios from "vue-axios";
import { BootstrapVue, IconsPlugin, PaginationPlugin } from "bootstrap-vue";
import VueSimpleAlert from "vue-simple-alert";

// Simple but cool alert(), confirm(), prompt() for Vue.js.
Vue.use(VueSimpleAlert);

// Import Bootstrap an BootstrapVue CSS files (order is important)
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

axios.defaults.baseURL = "https://album-pochette.herokuapp.com/api/v1";
Vue.use(VueAxios, axios); // Use axios in Vue 3

// import "./app.scss"; // my custom scss

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

// Use BootstrapVue pagination
Vue.use(PaginationPlugin);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
