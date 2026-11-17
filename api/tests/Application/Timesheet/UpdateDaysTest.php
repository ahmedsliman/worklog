<?php

declare(strict_types=1);

namespace App\Tests\Application\Timesheet;

use App\Application\Timesheet\UpdateDays;
use App\Domain\Timesheet\Enum\Off;
use App\Domain\Timesheet\Model\Day;
use App\Domain\Timesheet\Model\Year;
use PHPUnit\Framework\TestCase;

/**
 * @internal
 *
 * @coversNothing
 */
final class UpdateDaysTest extends TestCase
{
    public function testRecordsHoursForSelectedDaysAndClearsTimeOff(): void
    {
        $year = new Year(2026);
        $selected = new Day($year, new \DateTimeImmutable('2026-01-05'));
        $selected->setOff(Off::VACATION);
        $otherSelected = new Day($year, new \DateTimeImmutable('2026-01-06'));
        $unselected = new Day($year, new \DateTimeImmutable('2026-01-07'));
        $unselected->setOff(Off::SICK);

        (new UpdateDays())->update([$selected, $otherSelected], 8, null);

        foreach ([$selected, $otherSelected] as $day) {
            self::assertSame(8, $day->getHours());
            self::assertNull($day->getOff());
        }
        self::assertSame(Off::SICK, $unselected->getOff());
    }

    public function testTimeOffReplacesHours(): void
    {
        $day = new Day(new Year(2026), new \DateTimeImmutable('2026-01-05'));
        $day->setHours(8);

        (new UpdateDays())->update([$day], null, Off::VACATION);

        self::assertSame(Off::VACATION, $day->getOff());
        self::assertNull($day->getHours());
    }

    public function testClearsExistingEntries(): void
    {
        $year = new Year(2026);
        $workingDay = new Day($year, new \DateTimeImmutable('2026-01-05'));
        $workingDay->setHours(8);
        $vacationDay = new Day($year, new \DateTimeImmutable('2026-01-06'));
        $vacationDay->setOff(Off::VACATION);

        (new UpdateDays())->update([$workingDay, $vacationDay], null, null);

        foreach ([$workingDay, $vacationDay] as $day) {
            self::assertNull($day->getHours());
            self::assertNull($day->getOff());
        }
    }
}
