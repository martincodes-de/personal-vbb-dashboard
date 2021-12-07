const app = Vue.createApp({
    data() {
        return {
            isLoadingSpinnerActive: false,
            stations: ["Berlin Alexanderplatz", "Station 2"],
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
        },

        loadSettingsFromLocalStorage() {
            let savedSettings = localStorage.getItem("settings");

            if (savedSettings !== null) {
                let savedSettingsObject = JSON.parse(savedSettings);
                this.settings.refreshTimeInSeconds = savedSettingsObject.refreshTimeInSeconds;
            } else {
                console.info("Keine Einstellungen wurden gespeichert / gefunden!");
            }
        }
    },

    computed: {

    },

    beforeMount() {
        this.loadSettingsFromLocalStorage();
    }
});

viewModel = app.mount("#app");