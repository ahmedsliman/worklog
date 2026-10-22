<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Day;
use App\Entity\Year;

final class YearDaysGenerator
{
    public function generate(Year $year): void
    {
        $holidays = [];
        foreach ($year->getRegion()->getPublicHolidays($year->getYear()) as $holiday) {
            $holidays[$holiday->getDate($year->getYear())->format('Y-m-d')] = $holiday;
        }

        $start = new \DateTimeImmutable(\sprintf('%d-01-01', $year->getYear()));
        $end = $start->modify('+1 year');

        for ($date = $start; $date < $end; $date = $date->modify('+1 day')) {
            $day = new Day($year, $date);
            $day->setPublicHoliday($holidays[$date->format('Y-m-d')] ?? null);

            $year->addDay($day);
        }
    }
}
