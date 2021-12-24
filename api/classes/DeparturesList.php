<?php

class DeparturesList {
    private array $interestedLineNames = [
        "U 2",
        "U 5",
        "RE 1",
        "S 3",
        "RB 14",
        "STR M17",
        "STR 27",
        "STR 21"
    ];

    public function __construct() {

    }

    public function getRawDeparturesListFromDbApi(int $stopId, int $duration, bool $bus = false, bool $tram  = false): array {
        $busState = "false";
        $tramState = "false";

        if ($bus) {
            $busState = "true";
        }

        if ($tram) {
            $tramState = "true";
        }

        $apiData = file_get_contents("https://v5.db.transport.rest/stops/{$stopId}/departures?duration={$duration}&language=de&express=false&ferry=false&bus={$busState}&tram={$tramState}");
        return json_decode($apiData);
    }

    public function createDeparturesList(array $departuresModels): array {
        $departuresViewModels = [];

        for ($i = 0; $i < count($departuresModels); $i++) {
            $model = $departuresModels[$i];
            $departureViewModel = $this->createViewModel($model);

            if ($this->isDepartureInteresting($departureViewModel["name"], $this->interestedLineNames)) {
                array_push($departuresViewModels, $departureViewModel);
            }
        }

        return $departuresViewModels;
    }

    private function createViewModel(stdClass $departure): array {
        $name = $this->createLineName($departure->line->name, $departure->direction);
        $when = $this->formatDateString($departure->when);

        return [
            "name" => $name,
            "when" => $when,
            "whenTime" => $this->formatDepartureTimeOnly($departure->when),
            "plannedWhen" => $this->formatDateString($departure->plannedWhen),
            "plannedWhenTime" => $this->formatDepartureTimeOnly($departure->plannedWhen),
            "delay" => $this->convertDelayToMinutes($departure->delay),
            "direction" => $departure->direction,
            "lastStation" => $departure->provenance,
            "notices" => $departure->remarks,
            "cancelled" => isset($departure->cancelled),
            "updateableId" => $this->createUpdatableId($name, $when)
        ];
    }

    private function createUpdatableId(string $name, string $when): string {
        return "id-{$name}-{$when}-only-vuejs";
    }

    private function formatDateString(string $date): string {
        $date = new DateTime($date);
        return $date->format("d.m.Y H:i");
    }

    private function formatDepartureTimeOnly(string $date): string {
        $date = new DateTime($date);
        return $date->format("H:i");
    }

    private function createLineName(string $name, string $direction): string {
        $name = str_replace(", Berlin", "", $name);
        $direction = str_replace(", Berlin", "", $direction);
        $name = str_replace("(Berlin)", "", $name);
        $direction = str_replace("(Berlin)", "", $direction);
        return "{$name} {$direction}";
    }

    private function convertDelayToMinutes(?int $seconds): int {

        if (is_null($seconds)) {
            return 0;
        }

        return $seconds / 60;
    }

    private function isDepartureInteresting(string $name, array $interestedNames): bool {
        $interestedCount = 0;

        foreach ($interestedNames as $interestedName) {
            if (str_contains($name, $interestedName)) {
                $interestedCount++;
            }
        }

        if ($interestedCount > 0) {
            return true;
        }

        return false;
    }
}