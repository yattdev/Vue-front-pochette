<template>
<!-- Page Content -->
<div class="container mb-10">
    <!-- Portfolio Item Heading -->
    <h1 class="my-4">Pochette:
      <em>{{ pochetteDetails.title }}</em>
    </h1>

    <!-- Portfolio Item Row -->
    <div class="row">

      <div class="col-md-6 mr-5">
        <img class="img-fluid" :src="pochetteDetails.image_for_detail_page" alt="">
      </div>

      <div class="col-md-4">
        <h3 class="my-3">Pochette Description</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam viverra euismod odio, gravida pellentesque urna varius vitae. Sed dui lorem, adipiscing in adipiscing et, interdum nec metus. Mauris ultricies, justo eu convallis placerat, felis enim.</p>
        <h3 class="my-3">Pochette Details</h3>
        <ul>
          <li>Author: <strong>{{ pochetteDetails.author }}</strong></li>
          <li>Public:
            <strong v-if="pochetteDetails.is_public">YES</strong>
            <strong v-else>No</strong>
          </li>
          <li>Album title: <strong>{{ pochetteDetails.title }}</strong></li>
        </ul>
      </div>

    </div>
    <!-- /.row -->
  </div>
  <!-- /.container -->
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import axios from "axios"

export default Vue.component('PochetteDetail', {
    name: 'PochetteDetail',
    data() {
        return {
            pochetteDetails: {}
        };
    },
    watch: {
        $route(to,) {
            if(to.name === 'pochettes'){
                this.getPochetteDetails()
            }
        },
    },

    mounted(){
        this.getPochetteDetails()
    },

    methods: {
        /* fetch pochette details by pochette id/slug */
        async getPochetteDetails(){
            /* console.log(this.$route.params.slug) */
            this.$store.commit('setIsLoading', true)
            const pochetteId = this.$route.params.id
            const pochetteSlug = this.$route.params.slug
            if (pochetteId) {
                await axios
                    .get('/pochettes/'+pochetteId+'/'+pochetteSlug)
                    .then(response => {
                        /* Update data -> this.pochetteDetails */
                        this.pochetteDetails = response.data
                        console.log(this.pochetteDetails)
                    })
                    .catch(error => {
                        console.log(error)
                    });
            }
            else{
                // Return to home
                this.$router.push('/')
            }
            this.$store.commit('setIsLoading', false)
        },

    },

});
</script>
