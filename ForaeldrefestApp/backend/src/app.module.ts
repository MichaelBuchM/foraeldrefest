import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GroupAssignmentService } from './group-assignment/group-assignment.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, GroupAssignmentService],
})
export class AppModule {}
