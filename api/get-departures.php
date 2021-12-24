<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

require_once "./classes/DeparturesList.php";

$departuresListManager = new DeparturesList();

$apiData = $departuresListManager->getRawDeparturesListFromDbApi(8011155, 60, true, false);

$departures = $departuresListManager->createDeparturesList($apiData);

header('Content-Type: application/json');
echo json_encode($departures);