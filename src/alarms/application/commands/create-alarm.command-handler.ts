import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { CreateAlarmCommand } from './create-alarm.command';
import { AlarmRepository } from '../ports/alarm.repository';
import { AlarmFactory } from '../../domain/factories/alarm.factory';
import { AlarmCreatedEvent } from '../../domain/events/alarm-created.event';

@CommandHandler(CreateAlarmCommand)
export class CreateAlarmCommandHandler
  implements ICommandHandler<CreateAlarmCommand>
{
  private readonly logger = new Logger(CreateAlarmCommandHandler.name);

  constructor(
    private readonly alarmRepository: AlarmRepository,
    private readonly alarmFactory: AlarmFactory,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateAlarmCommand) {
    this.logger.debug(
      `Processing "CreateAlarmCommand" with data: ${JSON.stringify(command)}`,
    );
    const alarm = this.alarmFactory.create(command.name, command.severity);
    const newAlarm = this.alarmRepository.save(alarm);
    this.eventBus.publish(new AlarmCreatedEvent(alarm));

    return newAlarm;
  }
}
