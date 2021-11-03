<template>
    <div class="modal fade" id="modalLoginForm" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
      aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
        <form action="" @submit.prevent="submitForm" method="post">
          <div class="modal-header text-center">
            <h4 class="modal-title w-100 font-weight-bold">Sign in</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body mx-3">
            <div class="form mb-3">
              <i class="fas fa-envelope prefix grey-text"></i>
              <label data-error="wrong" data-success="right" for="defaultForm-email">Your email</label>
              <input v-model="email" type="email" name="email" id="defaultForm-email" class="form-control validate">
            </div>

            <div class="form mb-3">
              <i class="fas fa-lock prefix grey-text"></i>
              <label data-error="wrong" data-success="right" for="defaultForm-pass">Your password</label>
              <input v-model="password" name="password" type="password" id="defaultForm-pass" class="form-control validate">
            </div>
            <div role="alert"  class="alert alert-danger" v-if="errors.length">
              <p v-for="error in errors" v-bind:key="error">
               <i class="fas fa-exclamation-triangle"></i> {{ error }}
              </p>
            </div>
          </div>
          <div class="modal-footer d-flex justify-content-center">
            <button class="btn btn-default" type="submit">Login</button>
          </div>
        </form>
        </div>
      </div>
    </div>
</template>

<script charset="utf-8">
import axios from "axios";
import Vue from 'vue'

export default Vue.extend({
    name: 'LogIn',
    data(){
        return {
            email: '',
            password: '',
            errors: [],
        }
    },
    mounted(){
        document.title = 'Log In'
    },
    methods: {
        async submitForm(){
            // Set to empty localStorage token before login
            axios.defaults.headers.common["Authorization"] = ""

            localStorage.removeItem('token')

            this.errors = []

            if(this.email === ''){
                this.errors.push('The email is missing')
            }
            if(this.password === ''){
                this.errors.push('The password is missing')
            }

            if(!this.errors.length){
                const formData = {
                    email: this.email,
                    password: this.password,
                }

                /* First get the csrf_token from django */
                await axios
                    .get('/get-token')
                    .then(response => {
                        const csrf_token = response.data.csrf_token
                        /* add csrf_token to axios headers */
                        /* console.log(csrf_token) */
                        axios.defaults.headers.common['X-CSRFToken'] = csrf_token
                    })
                    .catch(error => {
                        // TODO: Display toast message will error message
                        console.log(error)
                    })

                await axios
                    .post("/authjwt/create/", formData)
                    .then(response => {
                        /* TODO: Faire un toast pour dir afficher le msg de success */
                        /* console.log(response.data.access) */
                        /* console.log(response.data.refresh) */
                        const token = response.data.access
                        /* const refresh = data.refresh */

                        localStorage.setItem("token", token)
                        /* localStorage.setItem("refresh", refresh) */

                        // Update state token and refresh
                        this.$store.commit('setToken', token)
                        /* this.$store.commit('setRefresh', refresh) */

                        axios.interceptors.request.use(config => {
                           if (localStorage.getItem("token") != null)
                             config.headers["Authorization"] = "Bearer " + localStorage.getItem("token");
                           return config;
                         });
                    })
                    .catch(error => {
                        if(error.response) {
                            for(const property in error.response.data){
                                this.errors.push(property+": "+error.response.data[property])
                                /* this.errors.push(`$(property): $(error.response.data[property])`) */
                            }
                            console.log(JSON.stringify(error.response.data))
                        } else if (error.message) {
                            this.errors.push('Something wrong, Please again'),
                            console.log(JSON.stringify(error))
                        }
                    })
                }
            await this.getAuthUserData() // update user data
        },

        async getAuthUserData() {
          await axios
            .get("/authusers/me/")
            .then(response => {
              const authenticatedUserData = JSON.stringify(response.data);
              this.$store.commit('setAuthenticatedUserData', authenticatedUserData)
              localStorage.setItem("authenticatedUserData",
                      authenticatedUserData)
              console.log("User details")
              console.log(authenticatedUserData)

              this.$fire({
                title: "Login...",
                text: "Successfully login ! ",
                type: "success",
                timer: 3000
              })
              .then(r => {
               console.log(r.value);
              });
            })
            .then(() => window.location.reload())
            .catch(error => {
              console.log(error);
            });
        },

    },
})
</script>
