import { Test, TestingModule } from '@nestjs/testing';
import { DynamicController } from './dynamic.controller';

describe('DynamicController', () => {
  let controller: DynamicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DynamicController],
    }).compile();

    controller = module.get<DynamicController>(DynamicController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
