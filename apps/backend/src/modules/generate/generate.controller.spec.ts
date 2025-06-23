import { Test, TestingModule } from '@nestjs/testing';
import { GenerateController } from './generate.controller';

describe('GenerateController', () => {
  let controller: GenerateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenerateController],
    }).compile();

    controller = module.get<GenerateController>(GenerateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
