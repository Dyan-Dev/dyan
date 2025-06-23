import { Test, TestingModule } from '@nestjs/testing';
import { SchemasController } from './schemas.controller';

describe('SchemasController', () => {
  let controller: SchemasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchemasController],
    }).compile();

    controller = module.get<SchemasController>(SchemasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
