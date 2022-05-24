import { ValidationPipe, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as compression from 'compression'
import helmet from 'helmet'
import { Transport } from '@nestjs/microservices'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.connectMicroservice({
        transport: Transport.RMQ,
        options: {
            urls: [process.env["MQ_URL"]],
            queue: 'suppliers',
            queueOptions: {
                durable: false
            }
        },
    })

    app.useGlobalPipes(new ValidationPipe({
        transform: true
    }))

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
