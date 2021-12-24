const app = Vue.createApp({
    data() {
        return {
            isLoadingSpinnerActive: false,
            stations: ["Berlin Alexanderplatz", "Station 2"],
            settings: {
                showSettingsSuccessAlert: false,
                refreshTimeInSeconds: 30
            },
            lines: [],
            lastUpdated: new Date()
        }
    },

    methods: {
        setupApplication() {
          this.loadSettingsFromLocalStorage();
          this.fetchLines();
        },

        saveSettingsInLocalStorage() {
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
        },

        fetchLines() {
            axios.get("https://personal-vbb-dashboard.ddev.site/api/station.php")
                .then(function (response) {
                    this.lines = response.data;
                });
        }
    },

    computed: {
        lastUpdatedOnlyHoursAndSeconds() {
            let hours = this.lastUpdated.getHours();
            let minutes = this.lastUpdated.getMinutes();

            return hours + ":" + minutes;
        }
    },

    mounted() {
        this.setupApplication();
    }
});

viewModel = app.mount("#app");