import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFiles, Query } from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { ObjectId } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('tracks')
export class TrackController {

    constructor(private trackService : TrackService) {}

    @Post()
    // в nest работа с файлами идет с помощью бибилиотеки multer что бы подгружать обложку и саму аудио дорожку для трека
    // метод оборачиваем декоратор @UseInterceptors и затем с этими файлами можно работать внутри сервиса сдесьб будет несколько файлов
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'picture', maxCount: 1 }, // maxCount количество файлов 1
        { name: 'audio', maxCount: 1 },
    ]))
    // что бы работать с фалами внутри функции используем декоратор @UploadedFiles()
    create(@UploadedFiles() files, @Body() dto: CreateTrackDto) {
        // console.log(files) // это объект с 2 полями picture и audio это массивы в каорых может быть несколько файлов но так как мы указали 
        // 1 файл то в них по 1 файлу диструктуризацией дустаем их 
        const {picture, audio} = files
        // picture[0], audio[0] массивы поэтоу файлы достаем по 0 индексу так как там все 1 файл
        return this.trackService.create(dto, picture[0], audio[0]);
    }

    // @Get()
    // getAll() {
    //     return this.trackService.getAll()
    // }

    // так как треков может быть много сделам пагинацию на получение сех треков
    // для этог в этом методе будем ожидать 2 @Query параметра count - количество треков каторый должен вернуть запрос
    // и offset отступ например получили 50 треков перешли на 2 страницу и отступ над сделать 50 что бы получить следующте 50 треков
    @Get()
    getAll(@Query('count') count: number,
           @Query('offset') offset: number) {
        return this.trackService.getAll(count, offset)
    }

    // функция поиска
    @Get('/search')
    search(@Query('query') query: string) {
        return this.trackService.search(query)
    }
    
    @Get(':id') // id будем плучать из параметров сторки запроса
    getOne(@Param('id') id: ObjectId) {
        return this.trackService.getOne(id)
    }

    @Delete(':id')
    delete(@Param('id') id: ObjectId) {
        return this.trackService.delete(id)
    }

    @Post('/comment')
    addComment(@Body() dto: CreateCommentDto) {
        return this.trackService.addComment(dto);
    }

    // функция будет увеличивать количество прослушиваний на клиенте как дз
    // когда трек заканчивается будем отправлять этот запрос
    @Post('/listen/:id')
    listen(@Param('id') id: ObjectId) {
        return this.trackService.listen(id)
    }

}
