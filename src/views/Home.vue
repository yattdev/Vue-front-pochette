<template>
  <div id="Home container mt-4">

  <main id="main">

    <!-- ======= Popular Cours Section ======= -->
    <section id="popular-cours" class="cours">
      <div class="container" data-aos="fade-up">

        <div class="section-title">
          <h2>Pochettes D'albums</h2>
          <p>Les derniers pochettes albums</p>
        </div>

        <pochette-list-component :propPochettesList="pochettesList"/>
      </div>
    </section><!-- End Popular Cours Section -->

    <!-- ======= Trainers Section ======= -->
  </main><!-- End #main -->

  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import PochettesListComponent from '@/components/PochettesListComponent.vue'; // @ is an alias to /src
import axios from "axios";
/* import HeaderComponent from "@/components/HeaderComponent.vue"; */
/* import SectionComponent from "@/components/SectionComponent.vue"; */

export default Vue.extend({
    name: 'Home',
    data() {
        return {
            pochettesList: {},
        }
    },

    components: {
        'pochette-list-component': PochettesListComponent,
        /* "header-component": HeaderComponent, */
        /* "section-component": SectionComponent, */
    },

    mounted(){
        this.getPochettesList();
    },

    methods: {
       async getPochettesList() {
            this.$store.commit('setIsLoading', true)
            axios.interceptors.request.use(config => {
               if (localStorage.getItem("token") != null)
                 config.headers["Authorization"] = "Bearer " + localStorage.getItem("token");
               return config;
             });
            await axios
                .get('/pochettes/')
                .then(response => {
                        this.pochettesList = Array.from(response.data);
                        console.log(this.pochettesList);
                })
                .catch(error => {
                    console.log(error)
                })
                document.title = "Liste des pochettes"
            this.$store.commit('setIsLoading', false)
        },
    }
})
</script>
