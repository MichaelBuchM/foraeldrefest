import { Body, Controller, Post } from '@nestjs/common';
import {
  GroupAssignmentService,
  Person,
} from './group-assignment/group-assignment.service';

@Controller()
export class AppController {
  constructor(
    private readonly groupAssignmentService: GroupAssignmentService,
  ) {}

  @Post('guests')
  createGroupAssignments(@Body() guestsData: any) {
    const guests: Person[] = guestsData.guests;
    this.groupAssignmentService.setPeople(guests);
    return this.groupAssignmentService.getGroupAssignments();
  }
}
