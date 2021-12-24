<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

require_once "./classes/DeparturesList.php";

$stationName = $_GET["stationName"];
$stopId = $_GET["stopId"];
$duration = $_GET["duration"];
$busStopsIncluded = $_GET["busStopsIncluded"];
$tramStopsIncluded = $_GET["tramStopsIncluded"];

$departuresListManager = new DeparturesList();

$apiData = $departuresListManager->getRawDeparturesListFromDbApi($stopId, $duration, $busStopsIncluded, $tramStopsIncluded);
$departures = $departuresListManager->createDeparturesList($apiData);

header('Content-Type: application/json');
echo json_encode($departures);