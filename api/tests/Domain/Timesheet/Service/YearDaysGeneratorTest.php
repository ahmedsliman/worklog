<?php

declare(strict_types=1);

namespace App\Tests\Domain\Timesheet\Service;

use App\Domain\Timesheet\Enum\PublicHoliday;
use App\Domain\Timesheet\Enum\Region;
use App\Domain\Timesheet\Model\Year;
use App\Domain\Timesheet\Service\YearDaysGenerator;
use PHPUnit\Framework\TestCase;

/**
 * @internal
 *
 * @coversNothing
 */
final class YearDaysGeneratorTest extends TestCase
{
    private YearDaysGenerator $generator;

    protected function setUp(): void
    {
        $this->generator = new YearDaysGenerator();
    }

    public static function provideGeneratesEveryDayOfTheYearCases(): iterable
    {
        yield 'leap year' => [2024, 366];
        yield 'non leap year' => [2026, 365];
    }

    /**
     * @dataProvider provideGeneratesEveryDayOfTheYearCases
     */
    public function testGeneratesEveryDayOfTheYear(int $year, int $expected): void
    {
        $entity = new Year($year);
        $entity->setRegion(Region::BE);

        $this->generator->generate($entity);

        self::assertCount($expected, $entity->getDays());
    }

    public function testAppliesPublicHolidaysOfTheRegion(): void
    {
        $year = new Year(2026);
        $year->setRegion(Region::BE);

        $this->generator->generate($year);

        $holiday = $year->getDay(new \DateTimeImmutable('2026-01-01'));
        self::assertNotNull($holiday);
        self::assertSame(PublicHoliday::NEW_YEAR, $holiday->getPublicHoliday());

        $regularDay = $year->getDay(new \DateTimeImmutable('2026-01-02'));
        self::assertNotNull($regularDay);
        self::assertNull($regularDay->getPublicHoliday());
    }
}
