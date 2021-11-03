<template>
  <html lang="en" id="App">
    <head>
      <!-- Google Fonts -->
      <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Raleway:300,300i,400,400i,500,500i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i" rel="stylesheet">
      <!-- Favicons -->
      <link href="./assets/img/favicon.png" rel="icon">
      <link href="./assets/img/apple-touch-icon.png" rel="apple-touch-icon">

      <!-- Vendor CSS Files -->
      <link href="./assets/vendor/animate.css/animate.min.css" rel="stylesheet">
      <link href="./assets/vendor/aos/aos.css" rel="stylesheet">
      <link href="./assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
      <link href="./assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
      <link href="./assets/vendor/boxicons/css/boxicons.min.css" rel="stylesheet">
      <link href="./assets/vendor/remixicon/remixicon.css" rel="stylesheet">
      <link href="./assets/vendor/swiper/swiper-bundle.min.css" rel="stylesheet">
        <!-- Font Awesome -->
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css">
        <!-- Google Fonts -->
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap">
        <!-- Material Design Bootstrap -->
        <link href="https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.19.1/css/mdb.min.css" rel="stylesheet">

    </head>
    <body>
      <!-- ======= Header ======= -->
      <header id="header" class="">
        <div class="container d-flex align-items-center">

          <h1 class="logo me-auto"><router-link to="/">Gestion pochette albums</router-link></h1>
            <span v-if="authUser.id">Signed as <strong class="mx-2">  {{ authUser.email }}</strong></span>
            <router-link v-if="!isAuthenticated"
                class="get-started-btn bg-success" to=""
                data-toggle="modal" data-target="#modalLoginForm">
                <i class="far fa-user"></i> Sign-In
            </router-link>
            <router-link v-if="!isAuthenticated"
                class="get-started-btn bg-primary" to=""
                data-toggle="modal" data-target="#modalRegisterForm">
                <i class="fas fa-user-plus"></i> Sign-Up
            </router-link>
            <a v-if="isAuthenticated"
            href="#" class="get-started-btn bg-danger"
            v-on:click="log_out">
                <i class="fas fa-sign-out-alt"></i> Log Out
            </a>
            <router-link v-if="isAuthenticated"
            to="" class="get-started-btn bg-dark"
            data-toggle="modal" data-target="#modalPochetteForm">
                <i class="fas fa-upload"></i> Upload Pochette
            </router-link>
        </div>
      </header><!-- End Header -->

      <bounce-loader :loading="loading" color="#cc181e" size="50"></bounce-loader>
      <!-- Login SignIn modal vue -->
      <signup-component/>
      <create-pochette-component/>
      <signin-component/>

      <router-view/>

      <!-- ======= Footer ======= -->
      <footer id="footer" class="fixed-bottom">
        <div class="container d-md-flex py-4">

          <div class="me-md-auto text-center text-md-start">
            <div class="copyright">
              &copy; Copyright <strong><span>Yattdeveloper@gmail.com</span></strong>.
            </div>
          </div>
        </div>
      </footer><!-- End Footer -->

    </body>
  </html>
</template>

<script>
// Get the modal
var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
</script>

<script charset="utf-8">
/* <!-- Template Main CSS File --> */
require("@/assets/css/style.css");

import axios from 'axios';
import { Vue } from 'vue-property-decorator';
import Overlay from 'vuejs-overlay';
import LogIn from './views/LogIn'
import SignUp from './views/SignUp'
import Pochette from './views/Pochette';
import BounceLoader from 'vue-spinner/src/BounceLoader.vue'

export default Vue.extend({
    data() {
        return {
            loading: true,
        }
    },
    components: {
        "overlay": Overlay,
        "signup-component": SignUp,
        "signin-component": LogIn,
        "create-pochette-component": Pochette,
        BounceLoader,
    },
    beforeCreate(){
        this.$store.commit('initializeStore');

        const token = this.$store.state.token
        if(token){
            axios.defaults.headers.common['Authorization'] = "Token " + token
        }
        else {
            axios.defaults.headers.common['Authorization'] = ""
        }
    },

    computed: {
        isAuthenticated() {
            return this.$store.state.isAuthenticated
        },

        authUser(){
            const data = JSON.parse(localStorage.getItem('authenticatedUserData'))
            console.log(data)
            if(data) return data
            else return {id: "", email: ""}
        },

        loading_b(){
            return this.$store.isLoading;
        }
    },

    methods: {
        log_out(){
            /* log-out user */
            const token = localStorage.getItem('token')
            this.$store.commit('removeToken', token)
            this.$store.commit('removeAuthenticatedUserData')

            localStorage.removeItem('token')
            localStorage.removeItem('refresh')
            localStorage.removeItem('authenticatedUserData')

            axios.defaults.headers.common["Authorization"] = ""
            axios.defaults.headers.common['X-CSRFToken'] = ""

            window.location.reload(); // Reload current page
        },
     }

});
</script>
