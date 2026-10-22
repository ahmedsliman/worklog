<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\IriConverterInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Dto\DayBulkUpdate;
use App\Entity\Day;
use Doctrine\ORM\EntityManagerInterface;

/** @implements ProcessorInterface<DayBulkUpdate, void> */
final class DayBulkUpdateProcessor implements ProcessorInterface
{
    public function __construct(
        private readonly IriConverterInterface $iriConverter,
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): void
    {
        foreach ($data->days as $iri) {
            $day = $this->iriConverter->getResourceFromIri($iri);
            \assert($day instanceof Day);

            $day->setHours($data->hours);
            $day->setOff($data->off);
        }

        $this->entityManager->flush();
    }
}
