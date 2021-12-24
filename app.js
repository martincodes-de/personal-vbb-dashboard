const app = Vue.createApp({
    data() {
        return {
            isLoadingSpinnerActive: false,
            showSettingsButton: false,
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
            this.isLoadingSpinnerActive = true;
            axios.get("https://personal-vbb-dashboard.ddev.site/api/station.php")
                .then((response) => {
                    this.lines = response.data;
                    this.isLoadingSpinnerActive = false;
                });
        }
    },

    computed: {
        lastUpdatedOnlyHoursAndSeconds() {
            let hours = this.lastUpdated.getHours();
            let minutes = this.lastUpdated.getMinutes();

            if (minutes < 10) {
                minutes = "0"+minutes;
            }

            if (hours < 10) {
                hours = "0"+hours;
            }

            return hours + ":" + minutes;
        }
    },

    mounted() {
        this.setupApplication();
        setInterval(this.fetchLines, 30000);
    }
});

viewModel = app.mount("#app");