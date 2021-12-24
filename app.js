const app = Vue.createApp({
    data() {
        return {
            isLoadingSpinnerActive: false,
            showSettingsButton: false,
            stations: [
                {name: "Alexanderplatz", stopId: 8011155, busStopsIncluded: false, tramStopsIncluded: false, departures: []},
                {name: "U Tierpark", stopId: 733088, busStopsIncluded: true, tramStopsIncluded: true, departures: []},
                {name: "U Spittelmarkt", stopId: 732543, busStopsIncluded: false, tramStopsIncluded: false, departures: []},
                {name: "S Karlshorst", stopId: 374336, busStopsIncluded: false, tramStopsIncluded: true, departures: []},
                {name: "Erkner", stopId: 8013477, busStopsIncluded: false, tramStopsIncluded: false, departures: []},
                {name: "Fürstenwalde/Spree", stopId: 8010120, busStopsIncluded: false, tramStopsIncluded: false, departures: []},
                {name: "Alfred-Kowalke-Str. (HWR)", stopId: 733107, busStopsIncluded: false, tramStopsIncluded: true, departures: []},
            ],
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
            this.lastUpdated = new Date();

            for (let s = 0; s < this.stations.length ; s++) {
                let stationDetails = this.stations[s];

                axios.get("https://personal-vbb-dashboard.ddev.site/api/get-departures.php", {
                    params: {stationName: stationDetails.name, duration: 30, stopId: stationDetails.stopId,
                            busStopsIncluded: stationDetails.busStopsIncluded, tramStopsIncluded: stationDetails.tramStopsIncluded}
                })
                    .then((response) => {
                        this.stations[s].departures = response.data;
                    });
            }

            this.isLoadingSpinnerActive = false;
        }
    },

    computed: {
        lastUpdatedOnlyHoursAndSeconds() {
            let hours = this.lastUpdated.getHours();
            let minutes = this.lastUpdated.getMinutes();
            let milliseconds = this.lastUpdated.getMilliseconds();

            if (minutes < 10) {
                minutes = "0"+minutes;
            }

            if (hours < 10) {
                hours = "0"+hours;
            }

            if (milliseconds < 10) {
                milliseconds = "0"+milliseconds;
            }

            return hours + ":" + minutes + ":" + milliseconds;
        }
    },

    mounted() {
        this.setupApplication();
        setInterval(this.fetchLines, 30000);
    }
});

viewModel = app.mount("#app");