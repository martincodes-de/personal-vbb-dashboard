<?php

class DeparturesList {
    public function __construct(array $decodedAPIDataList) {
    }

    public function createDeparturesList(array $departuresModels): array {
        $departuresViewModels = [];

        for ($i = 0; $i < count($departuresModels); $i++) {
            $model = $departuresModels[$i];
            $departureViewModel = $this->createViewModel($model);

            array_push($departuresViewModels, $departureViewModel);
        }

        return $departuresViewModels;
    }

    private function createViewModel(stdClass $departure): array {
        return [
            "name" => $this->createLineName($departure->line->name, $departure->direction),
            "when" => $this->formatDateString($departure->when),
            "whenTime" => $this->formatDepartureTimeOnly($departure->when),
            "plannedWhen" => $this->formatDateString($departure->plannedWhen),
            "plannedWhenTime" => $this->formatDepartureTimeOnly($departure->plannedWhen),
            "delay" => $this->convertDelayToMinutes($departure->delay),
            "direction" => $departure->direction,
            "lastStation" => $departure->provenance,
            "notices" => $departure->remarks,
            "cancelled" => isset($departure->cancelled),
        ];
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
        return "{$name} {$direction}";
    }

    private function convertDelayToMinutes(?int $seconds): int {

        if (is_null($seconds)) {
            return 0;
        }

        return $seconds / 60;
    }
}