// apps/backend/src/app.module.ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EndpointController } from './endpoint/endpoint.controller';
import { DynamicController } from './dynamic/dynamic.controller';
import { AuthModule } from './auth/auth.module';
import { JwtMiddleware } from './auth/jwt.middleware';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['../../.env', '.env'],
      isGlobal: true,
    }),
    JwtModule.register({
      secret: (() => {
        console.log('JWT_SECRET:', process.env.JWT_SECRET);
        return process.env.JWT_SECRET;
      })(),
      signOptions: { expiresIn: '10m' },
    }),
    AuthModule,
  ],
  controllers: [AppController, EndpointController, DynamicController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
