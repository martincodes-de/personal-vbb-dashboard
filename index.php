<?php

$apiData = file_get_contents("https://v5.vbb.transport.rest/stops/900000161002/departures?duration=30&language=de&express=false&ferry=false&bus=false&tram=false");

$decodedApiData = json_decode($apiData);

#var_dump($decoded[2]);

$vms = [];

for ($i = 0; $i < count($decodedApiData); $i++) {
    $vm = [
        "name" => $decodedApiData[$i]->line->name,
        "wann" => $decodedApiData[$i]->when,
        "geplantWann" => $decodedApiData[$i]->plannedWhen,
        "verspaetung" => $decodedApiData[$i]->delay,
        "richtung" => $decodedApiData[$i]->direction,
        "endstation" => $decodedApiData[$i]->provenance,
        "hinweise" => $decodedApiData[$i]->remarks,
        "ausfall" => isset($decodedApiData[$i]->cancelled),
    ];

    array_push($vms, $vm);
}

header('Content-Type: application/json');
echo json_encode($vms);