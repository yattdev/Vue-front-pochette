<template>
    <Spinner class="loader" :name="loading ? 'circle' : ''" color="#32B5B6"/>
</template>

<script>
import Vue from 'vue'
import Spinner from 'vue-spinkit'

export default Vue.component('Loader',{
    data() {
        return { }
    },
    computed: {
        loading(){
            return this.$store.state.isLoading;
        }
    },
    components: {
        "Spinner": Spinner,
    }
})
</script>


<style scoped>
.loader {
    left: 50%;
    margin-left: -4em;
    top: 50%;
    margin-top: 4em;
    width: 100px;
    height: 100px;
}
</style>
