<template>
    <div class="modal fade" :id="'modalUpdatePochetteForm'+title" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
      aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
        <form @submit.prevent="submitForm" action="" method="post">
          <div class="modal-header text-center">
            <h4 class="modal-title w-100 font-weight-bold">Create new pochette</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body mx-3">
            <div class="mb-3">
              <label data-error="wrong" data-success="right" for="orangeForm-email">Album title</label>
              <input v-model="title" me="title" type="title" id="orangeForm-title" :placeholder="title" class="form-control validate">
            </div>

            <div class="input-group mb-3">
              <div class="input-group-prepend mb-1">
                <span class="input-group-text" id="inputGroupFileAddon01">Upload Album Cover</span>
              </div>
              <div class="custom-file">
                <input type="file" class="custom-file-input" id="inputGroupFile01"
                  aria-describedby="inputGroupFileAddon01"
                  @change="onFileChange($event)">
                <label class="custom-file-label" for="inputGroupFile01"></label>
              </div>
            </div>

            <!-- Material unchecked -->
            <div class="form-check">
                <input v-model="is_public" :placeholder="is_public" type="checkbox" class="form-check-input" id="materialUnchecked">
                <label class="form-check-label" for="materialUnchecked">Public</label>
            </div>

            <div role="alert"  class="alert alert-danger" v-if="errors.length">
              <p v-for="error in errors" v-bind:key="error">
               <i class="fas fa-exclamation-triangle"></i> {{ error }}
              </p>
            </div>
          </div>
          <div class="modal-footer d-flex justify-content-center">
            <button type="submit" class="btn btn-green">Create</button>
          </div>
        </form>
        </div>
      </div>
    </div>
</template>

<script charset="utf-8">
import Vue from 'vue'
import axios from 'axios';

export default Vue.extend({
    props: ['propPochette'],
    name: 'UpdatePochette',
    data() {
        return {
            title: '',
            is_public: Boolean,
            image: '',
            errors: [],
            pochette: {},
        }
    },
    computed: {
        authUser(){
            const data = JSON.parse(localStorage.getItem('authenticatedUserData'))
            console.log(data)
            if(data) return data
            else return {id: "", email: ""}
        },
    },

    mounted(){
        this.title = this.propPochette.title;
        this.image = this.propPochette.image;
        this.is_public = this.propPochette.is_public;
        this.pochette = this.propPochette;
    },

    methods: {
        async submitForm(){
            this.errors = []

            if(this.title === ''){
                this.errors.push('The title is missing')
            }
            if(this.image === ''){
                this.errors.push('The image cover is missing')
            }

            /* console.log(this.authUser.id) */
            /* !this.errors.length */
            if(!this.errors.length){
                var formData = new FormData();
                formData.append('title', this.title)
                formData.append('image', this.image)
                formData.append('is_public', this.is_public)
                formData.append('author', this.authUser.id)
                for (var p of formData) {
                  console.log(p);
                }

                /* First get the csrf_token from django */
                await axios
                    .get('/get-token')
                    .then(response => {
                        const csrf_token = response.data.csrf_token
                        /* add csrf_token to axios headers */
                        axios.defaults.headers.common['X-CSRFToken'] = csrf_token
                    })
                    .catch(error => {
                        if(error.response) {
                            for(const property in error.response.data){
                            this.errors.push("Something wrong ! Please reload and try again")
                                this.errors.push(`$(property): $(error.response.data[property])`)
                            }
                            console.log(JSON.stringify(error.response.data))
                        } else if (error.message) {
                            this.errors.push('Something wrong, Please again'),
                            console.log(JSON.stringify(error))
                        }
                    })

                await axios
                    .put("/pochettes/"+this.pochette.id+'/'+this.pochette.slug, formData)
                    .then(response => {
                        console.log(response.status)
                    })
                    .then(() => window.location.reload())
                    .catch(error => {
                        if(error.response) {
                            for(const property in error.response.data){
                                this.errors.push(property+": "+error.response.data[property])
                            }
                            console.log(JSON.stringify(error.response.data))
                        } else if (error.message) {
                            this.errors.push('Something wrong, Please again'),
                            console.log(JSON.stringify(error))
                        }
                    })
            }
        },

        /* to handle file input */
        onFileChange(event) {
          this.image = event.target.files[0];
        },
    },
})
</script>
