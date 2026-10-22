<?php

declare(strict_types=1);

namespace App\Dto;

use App\Entity\Day;
use App\Enum\Off;
use Symfony\Component\Validator\Constraints as Assert;

final class DayBulkUpdate
{
    /** @var list<string> */
    #[Assert\All([new Assert\Type('string')])]
    #[Assert\Count(min: 1)]
    public array $days = [];

    #[Assert\Range(min: 0, max: Day::MAX_HOURS)]
    public ?int $hours = null;

    public ?Off $off = null;
}
