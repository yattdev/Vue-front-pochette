<template>
    <div id="PochettesListComponent" class="row">
      <div class="col-lg-4 col-md-6 d-flex align-items-stretch my-md-2 my-ml-2"
        v-for="pochette in pochettes"
        v-bind:key="pochette.id">
        <div class="course-item" style="background-color: #ded">
          <div class="py-ml-3 py-md-2 bg-black">
              <img :src="pochette.image"
              class="img-fluid" alt="..."
              contain/>
          </div>
          <div class="course-content my-4 px-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <router-link :to="'/pochettes/'+pochette.id+'/'+pochette.slug" class="text-decoration-none"><h4>{{ pochette.title.substring(0,40) }}</h4></router-link>
            </div>
            <div>
              <strong class="author">by {{ pochette.author }} </strong>
              <span v-if="!pochette.is_public"><i class="fas fa-user-shield"></i>(limit access)</span>
              <hr>
            </div>
            <div class="trainer d-flex justify-content-between align-items-center">
              <button v-bind:class="(pochette.author_id !== authUser.id) ?
              'disabled trainer-profile mb-2 d-flex align-items-center btn btn-success btn-block':
              'trainer-profile mb-2 d-flex align-items-center btn btn-success btn-block'"
              data-toggle="modal" :data-target="'#modalUpdatePochetteForm'+pochette.title">
                Update
              </button>
              <update-pochette-component :propPochette="pochette"/>
              <button v-bind:class="(pochette.author_id !== authUser.id) ?
              'disabled trainer-profile mb-2 d-flex align-items-center btn btn-danger btn-block':
              'trainer-profile mb-2 d-flex align-items-center btn btn-danger btn-block'"
                @click="removePochette(pochette)">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div> <!-- End Course Item-->
    </div>

</template>

<script>
import { Vue } from 'vue-property-decorator';
import axios from "axios"
import UpdatePochette from '../views/UpdatePochette.vue';

export default Vue.component('PochettesListComponent', {
    props: ['propPochettesList', 'propAuthUserList'],
    name: 'PochettesListComponent',
    components: {
        "update-pochette-component": UpdatePochette,
    },

    data() {
        return {
            authUserIsAuthor: false,
        };
    },

    computed: {
        pochettes: function() {
            return this.propPochettesList
        },
        authUser(){
            const data = JSON.parse(localStorage.getItem('authenticatedUserData'))
            console.log(data)
            if(data) return data
            else return {id: "", email: ""}
        }
    },

    methods: {
        async removePochette(pochette){
            await this.$confirm("Are you sure?").then(() => {
                axios
                    .delete('/pochettes/'+pochette.id+'/'+pochette.slug)
                    .then((response) => {
                        console.log(response.status)
                    })
                    .catch((error) => {
                        console.log(error)
                    })

                this.$fire({
                  title: "Delete Album",
                  text: "Deleted successfully ! ",
                  type: "success",
                  timer: 3000
                }).then(r => {
                 console.log(r.value);
                });
            });
        }

    }
});
</script>

<style type="text/css" media="all">
    .image{
        margin-top: 1.25em;
        margin-right: 1.25em;
        margin-left: 1.25em;
        margin-bottom: 1.25em;
    }

    img {
        max-width: 100%;
        max-height: 100%;
    }

    .card-text{
        text-align: justify;
        font-size: small;
    }
    .price{
        font-size: large;
    }
</style>
