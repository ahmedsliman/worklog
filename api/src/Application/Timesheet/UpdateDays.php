<?php

declare(strict_types=1);

namespace App\Application\Timesheet;

use App\Domain\Timesheet\Enum\Off;
use App\Domain\Timesheet\Model\Day;

final class UpdateDays
{
    /** @param iterable<Day> $days */
    public function update(iterable $days, ?int $hours, ?Off $off): void
    {
        foreach ($days as $day) {
            $day->setHours($hours);
            $day->setOff($off);
        }
    }
}
