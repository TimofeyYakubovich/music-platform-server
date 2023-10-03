
// точка входа в приложение

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';

const start = async () => {
    try {
        const PORT = process.env.PORT || 5000;
        const app = await NestFactory.create(AppModule)
        app.use(json({ limit: '50mb' }));
        app.use(urlencoded({ extended: true, limit: '50mb' }));
        app.enableCors({
            origin: 'https://music-platform-client.vercel.app', // Укажите домен, с которого разрешены запросы
            // origin: '*', // Укажите домен, с которого разрешены запросы
            methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS', // Укажите разрешенные HTTP-методы
            credentials: true, // Разрешить передачу куки и заголовков авторизации
        }) // корс что бы отправлять запросы с браузера без проблем
        await app.listen(PORT, () => console.log(`server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()