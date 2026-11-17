<?php

declare(strict_types=1);

require '/app/vendor/autoload.php';

use App\Domain\Timesheet\Enum\Region;

$data = ['regions' => [], 'holidays' => []];
foreach (Region::cases() as $region) {
    $iri = '/regions/' . $region->name;
    $data['regions'][] = ['@id' => $iri, 'value' => $region->value];
    for ($year = 2020; $year <= 2030; ++$year) {
        foreach ($region->getPublicHolidays($year) as $holiday) {
            $date = $holiday->getDate($year)->format('Y-m-d');
            $data['holidays'][$iri][$date] = [
                '@id' => '/public_holidays/' . $holiday->name,
                'value' => $holiday->value,
            ];
        }
    }
}
echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR) . "\n";
