import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAuthenticated: false,
    authenticatedUserData: {},
    token: "",
    refresh: "",
    isLoading: true
  },
  mutations: {
    // Initialize token auth
    initializeStore(state) {
      // Authen token verification
      if (localStorage.getItem("token")) {
        state.token = JSON.stringify(localStorage.getItem("token"));
        state.isAuthenticated = true;
      } else {
        state.token = "";
        state.isAuthenticated = false;
      }
    },

    // Toggle loading feature
    setIsLoading(state, status) {
      state.isLoading = status;
    },

    setToken(state, token) {
      state.token = token;
      state.isAuthenticated = true;
      // this.getAuthUserData(state);
    },

    setRefresh(state, refresh) {
      state.refresh = refresh;
    },

    removeToken(state) {
      state.token = "";
      state.refresh = "";
      state.isAuthenticated = false;
    },

    setAuthenticatedUserData(state, data) {
      state.authenticatedUserData = data;
    },

    removeAuthenticatedUserData(state) {
      state.authenticatedUserData = {};
    }
  },
  actions: {},
  modules: {}
});
