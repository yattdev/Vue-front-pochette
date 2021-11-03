<template>
    <div class="modal fade" id="modalRegisterForm" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
      aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
        <form @submit.prevent="submitForm" action="" method="post">
          <div class="modal-header text-center">
            <h4 class="modal-title w-100 font-weight-bold">Sign up</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body mx-3">
            <div class="mb-3">
              <i class="fas fa-envelope prefix grey-text"></i>
              <label data-error="wrong" data-success="right" for="orangeForm-email">Your email</label>
              <input v-model="email" name="email" type="email" id="orangeForm-email" class="form-control validate">
            </div>

            <div class="mb-3">
              <i class="fas fa-lock prefix grey-text"></i>
              <label data-error="wrong" data-success="right" for="orangeForm-pass">Your password</label>
              <input v-model="password" name="password" type="password" id="password" class="form-control validate">
              <em>it must contain at least 8 characters.</em>
            </div>

            <div class="mb-3">
              <i class="fas fa-lock prefix grey-text"></i>
              <label data-error="wrong" data-success="right" for="orangeForm-pass">Repeat password</label>
              <input v-model="password2" name="password2" type="password" id="password2" class="form-control validate">
            </div>
            <div role="alert"  class="alert alert-danger" v-if="errors.length">
              <p v-for="error in errors" v-bind:key="error">
               <i class="fas fa-exclamation-triangle"></i> {{ error }}
              </p>
            </div>
          </div>
          <div class="modal-footer d-flex justify-content-center">
            <button type="submit" class="btn btn-deep-orange">Sign up</button>
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
    name: 'SignUp',
    data(){
        return {
            email: '',
            username: '',
            password: '',
            password2: '',
            errors: [],
        }
    },
    methods: {
        async submitForm(){
            this.errors = []

            if(this.email === ''){
                this.errors.push('The email is missing')
            }
            if(this.password === ''){
                this.errors.push('The password is missing')
            }
            if(this.password2 !== this.password){
                this.errors.push("The passwords doesn't match")
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
                        axios.defaults.headers.common['X-CSRFToken'] = csrf_token
                    })
                    .catch(error => {
                        // TODO: Display toast message will error message
                        console.log(error)
                    })

                await axios
                    .post("/authusers/", formData)
                    .then(response => {
                        /* TODO: Faire un toast pour dir afficher le msg de success */
                        const token = response.data.data.access

                        localStorage.setItem("token", token)
                        this.$store.commit('setToken', token)

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
            console.log(localStorage.getItem("token"))
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
                    title: "SignUp...",
                    text: "Successfully signed ! ",
                    type: "success",
                    timer: 3000
                  }).then(r => {
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
