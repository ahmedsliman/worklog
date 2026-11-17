<?php

declare(strict_types=1);

namespace App\Infrastructure\ApiPlatform\State;

use ApiPlatform\Doctrine\Common\State\PersistProcessor;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Domain\Timesheet\Model\Year;
use App\Domain\Timesheet\Service\YearDaysGenerator;

/** @implements ProcessorInterface<Year, Year> */
final class YearPersistProcessor implements ProcessorInterface
{
    public function __construct(
        private readonly PersistProcessor $persistProcessor,
        private readonly YearDaysGenerator $yearDaysGenerator,
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        $this->yearDaysGenerator->generate($data);

        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
