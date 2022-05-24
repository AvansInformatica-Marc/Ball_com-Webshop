import { ValidationPipe, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as compression from 'compression'
import helmet from 'helmet'
import { Transport } from '@nestjs/microservices'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { supplierMqOptions, validationOptions } from './app.constants'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.connectMicroservice({
        transport: Transport.RMQ,
        options: supplierMqOptions,
    })

    app.useGlobalPipes(new ValidationPipe(validationOptions))

    app.enableVersioning({
        type: VersioningType.URI,
    })

    app.enableCors()

    app.use(compression())

    app.use(helmet())

    const config = new DocumentBuilder()
        .setTitle('Supplier management')
        .setDescription('The supplier management API')
        .setVersion('1')
        .addTag("supplier query")
        .addTag("supplier command")
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('', app, document);

    await app.startAllMicroservices()
    await app.listen(3000)
}

bootstrap()
