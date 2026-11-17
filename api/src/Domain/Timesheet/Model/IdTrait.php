<?php

declare(strict_types=1);

namespace App\Domain\Timesheet\Model;

use Doctrine\ORM\Mapping as ORM;

trait IdTrait
{
    #[ORM\Column]
    #[ORM\GeneratedValue]
    #[ORM\Id]
    private ?int $id = null;

    public function getId(): ?int
    {
        return $this->id;
    }
}
