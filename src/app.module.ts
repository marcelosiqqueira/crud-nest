import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { UserModule } from './user/user.mudule';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/entity/user.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.ENV === 'test' ? '.env.test' : '.env'
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }
    ),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'kailey.cummerata@ethereal.email',
            pass: 'beCPDns8ePKkWQ65hD'
        }
      },
      defaults: {
        from: '"nest-modules" <kailey.cummerata@ethereal.email>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '',
      port: Number(process.env.DB_PORT,),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        UserEntity
      ],
      synchronize: process.env.ENV === "development"
    }),
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }],
})
export class AppModule {}
