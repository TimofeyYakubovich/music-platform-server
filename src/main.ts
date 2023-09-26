
// точка входа в приложение

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


const start = async () => {
    try {
        const PORT = process.env.PORT || 5000;
        const app = await NestFactory.create(AppModule) 
        app.enableCors() // корс что бы отправлять запросы с браузера без проблем
        await app.listen(PORT, () => console.log(`server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()