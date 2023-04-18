import { Test, TestingModule } from '@nestjs/testing';
import { GroupAssignmentService } from './group-assignment.service';

describe('GroupAssignmentService', () => {
  let service: GroupAssignmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupAssignmentService],
    }).compile();

    service = module.get<GroupAssignmentService>(GroupAssignmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
