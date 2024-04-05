import { config } from 'dotenv';
import { join, resolve } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
config({ path: resolve(__dirname, '..', (process.env.NODE_ENV=='local' || process.env.NODE_ENV == 'development') ? '.development.env' : '.production.env') })
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
    rawBody: true,
  });
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'templates'));
  app.setViewEngine('hbs');
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',');
  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: '*',
    preflightContinue: false
  });

  const config = new DocumentBuilder()
    .setVersion('1.0')
    .setTitle('Backend Started Doc')
    .addBearerAuth({type: 'http', name: 'Bearer'})
    .setContact('Muhotasim Fuad', '', 'muhotasimF@gmail.com')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT,()=>{
    console.info(`🌏︎ server is up and running.
    \n backend \t=>\t ${process.env.API_URL}
    \n frontend\t=>\t ${process.env.APP_URL} \n`);
  });
}
bootstrap();
