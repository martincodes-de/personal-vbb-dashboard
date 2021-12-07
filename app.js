const app = Vue.createApp({
    data() {
        return {
            isLoadingSpinnerActive: false,
            stations: ["Station 1", "Station 2"],
            settings: {
                showSettingsSuccessAlert: false,
                refreshTimeInSeconds: 30
            }
        }
    },

    methods: {
        saveSettingsInLocalStorage(event) {
            let settings = {
                refreshTimeInSeconds: this.settings.refreshTimeInSeconds
            }

            this.settings.showSettingsSuccessAlert = true;
            setTimeout(() => {
                this.settings.showSettingsSuccessAlert = false;
            }, 5000);

            localStorage.setItem("settings", JSON.stringify(settings));
        }
    },

    computed: {

    }
});

viewModel = app.mount("#app");