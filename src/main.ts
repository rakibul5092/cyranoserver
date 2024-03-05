import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { HttpExceptionFilter } from './modules/shared/https-exception.filter';
import { AppModule } from './app.module';
import { Logger, VersioningType } from '@nestjs/common';
import * as session from 'express-session';
import { urlencoded, json } from 'express';
/**
 * Bootstrap application
 */
async function bootstrap(): Promise<void> {
    Logger.log( `DATABASE_URL :${process.env.DATABASE_URL}`, 'Bootstrap' );
    const app = await NestFactory.create( AppModule );
    app.enableCors();

    app.use(
        session( {
            secret            : 'my-secret',
            resave            : false,
            saveUninitialized : false,
        } ),
    );

    app.use( json( { limit: '100mb' } ) );
    app.use( urlencoded( { extended: true, limit: '100mb' } ) );

    app.setGlobalPrefix( 'v1' );

    app.enableVersioning( {
        type: VersioningType.URI,
    } );

    app.useGlobalFilters( new HttpExceptionFilter() );

    const options = new DocumentBuilder()
        .setTitle( 'CYRANO SERVER' )
        .setDescription( 'cyrano server APIs' )
        .setVersion( '1.0' )
        .build();

    const document = SwaggerModule.createDocument( app, options );
    SwaggerModule.setup( 'docs', app, document );

    await app.listen( process.env.PORT || 3001 );
    Logger.log(
        `🚀 Server running on http://localhost:${process.env.PORT || 3001}`,
        'Bootstrap',
    );
    Logger.log( `THE ACTIVE ENV MODE is : ${process.env.MODE}`, 'Bootstrap' );
}

bootstrap();
