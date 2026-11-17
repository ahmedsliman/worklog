<?php

declare(strict_types=1);

namespace App\Infrastructure\ApiPlatform\State;

use ApiPlatform\Metadata\IriConverterInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Application\Timesheet\UpdateDays;
use App\Domain\Timesheet\Model\Day;
use App\Infrastructure\ApiPlatform\Dto\DayBulkUpdate;
use Doctrine\ORM\EntityManagerInterface;

/** @implements ProcessorInterface<DayBulkUpdate, void> */
final class DayBulkUpdateProcessor implements ProcessorInterface
{
    public function __construct(
        private readonly IriConverterInterface $iriConverter,
        private readonly EntityManagerInterface $entityManager,
        private readonly UpdateDays $updateDays,
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): void
    {
        $days = [];
        foreach ($data->days as $iri) {
            $day = $this->iriConverter->getResourceFromIri($iri);
            \assert($day instanceof Day);

            $days[] = $day;
        }

        $this->updateDays->update($days, $data->hours, $data->off);

        $this->entityManager->flush();
    }
}
