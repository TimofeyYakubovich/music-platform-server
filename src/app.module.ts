import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { TrackModule } from './track/track.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModule } from './file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
    // controllers: [AppController],
    // providers: [AppService]

  imports: [
    // для раздачи статики устанавливаем npm install --save @nestjs/serve-static
    // так же импортирукм ServeStaticModule 
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static') // указываем путь к папке с фалами
    }),
    // что бы покдлючить бд mongodb npm i @nestjs/mongoose mongoose
    MongooseModule.forRoot('mongodb+srv://user:1234@cluster0.u4ldrbc.mongodb.net/?retryWrites=true&w=majority'),
    TrackModule,
    FileModule
]
})
export class AppModule {}