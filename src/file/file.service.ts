import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs' // стандартный модуль Node.js для работы с файламиы
import * as path from 'path' // и для работы с путями
import * as uuid from 'uuid' // что бы генерировать рандомные назания для файлов npm i uuid

export enum FileType {
    AUDIO = 'audio',
    IMAGE = 'image'
}

@Injectable()
export class FileService {
    
    // функция создания файла бует записыать файл на диск
    // у каждого файла будет уникальное значение и у каждого файла будет свой тип для типа сделаем перечисление FileType
    // в зависимости от этого типа будем добовляь файлы в соответствующие папки
    createFile(type: FileType, file): string {
        try {
            // в библиотеке multer есть поле originalname из которого можно вытащить расширение файла делем его по точкам .split('. ')
            // тоесть на выходе будет массив состоящий из слов и забераем последний элимент .pop()
            const fileExtension = file.originalname.split('. ').pop()
            const fileName = uuid.v4() + '.' + fileExtension // генерируем уникальное название для файла и добовляем расширение файла
            // далее надо получить путь к этому файлу
            // получаем текущую папку с попомщью __dirname возвращаемся на одну '..' так как сейчас находимся в папке files
            // и затем заходим в папку static функция resolve все это склеит в нормальный путь
            // что бы audio и image не лежали в куче в одной папке добовляем к пути type что бы файлы раскидывалисб по отдельным папкам
            const filePath = path.resolve(__dirname, '..', 'static', type)
            if (!fs.existsSync(filePath)) { // если по этому пути ничего не существует до создаем папку функцией mkdirSync
                // 1 параметр путь 2 опция recursive: true тоесть ели какой то папки в этом пути не будет то Node.js их создаст
               fs.mkdirSync(filePath, {recursive: true})
            }
            // после того как убедились чо папку по такому пути существует то записываем туда файл
            // функцией path.join склеиваем путь с название файла
            // и по итогу файл запишется в файловую систему
            fs.writeFileSync(path.join(filePath, fileName), file.buffer)
            return type + '/' + fileName // из этой функции возвращаем тип файла + / + название файла
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    // функция удаления файла бует удфлять файл с диска
    removeFile(fileName: string) {

    }

}
