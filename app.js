const app = Vue.createApp({
    data() {
        return {
            isLoadingSpinnerActive: false,
            stations: ["Station 1", "Station 2"],
        }
    },

    methods: {

    },

    computed: {

    }
});

viewModel = app.mount("#app");