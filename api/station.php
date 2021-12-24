<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

require_once "./classes/DeparturesList.php";

#$apiData = file_get_contents("https://v5.vbb.transport.rest/stops/900000161002/departures?duration=30&language=de&express=false&ferry=false&bus=false&tram=false");

$apiData = file_get_contents("https://v5.db.transport.rest/stops/8011155/departures?duration=30&language=de&express=false&ferry=false&bus=false&tram=false");

$decodedApiData = json_decode($apiData);

$departuresListManager = new DeparturesList($decodedApiData);

$departures = $departuresListManager->createDeparturesList($decodedApiData);

/*for ($i = 0; $i < count($decodedApiData); $i++) {
    $departure = [
        "name" => $decodedApiData[$i]->line->name,
        "when" => $decodedApiData[$i]->when,
        "plannedWhen" => $decodedApiData[$i]->plannedWhen,
        "delay" => $decodedApiData[$i]->delay,
        "direction" => $decodedApiData[$i]->direction,
        "lastStation" => $decodedApiData[$i]->provenance,
        "notices" => $decodedApiData[$i]->remarks,
        "cancelled" => isset($decodedApiData[$i]->cancelled),
    ];

    array_push($departures, $departure);
}*/

header('Content-Type: application/json');
echo json_encode($departures);