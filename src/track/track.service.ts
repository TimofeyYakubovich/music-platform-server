import { Injectable } from '@nestjs/common';
import { Track, TrackDocument } from './schemas/track.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateTrackDto } from './dto/create-track.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FileService, FileType } from 'src/file/file.service';

@Injectable()
export class TrackService {

    constructor(@InjectModel(Track.name) private trackModel: Model<TrackDocument>,
                @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
                private fileService: FileService) {}

    async create(dto: CreateTrackDto, picture, audio): Promise<Track> {
        // в createFile передаем тип файла из file.service и сам файл
        const audioPath = this.fileService.createFile(FileType.AUDIO, audio) // этот метод вернет строку с названием файла
        const picturePath = this.fileService.createFile(FileType.IMAGE, picture)
        // при создании трека прослушывания будут равны 0 listens: 0 picture, audio переадем как название файлов
        // по этим названием будем на клиенте их получать сервер юудет раздавать их как статику
        const track = await this.trackModel.create({...dto, listens: 0, audio: audioPath, picture: picturePath})
        return track;
    }

    // async getAll(): Promise<Track[]> {
    //     const tracks = await this.trackModel.find()
    //     return tracks
    // }

    // подефолту count = 10, offset = 0
    async getAll(count = 10, offset = 0): Promise<Track[]> {
        // после вызыва функции trackModel.find() вызываем .skip(Number(offset)) тоесть запрос пропустит первый 10 строк и .limit(Number(count)
        // каторый устанавливает количество получаемых треков
        const tracks = await this.trackModel.find().skip(Number(offset)).limit(Number(count))
        return tracks
    }

    async getOne(id: ObjectId): Promise<Track> {
        // когда отправляем запрос на получение все треков нам комментарии не нужны достаточно только id в comments
        // но когда отправляем запрос на получение конкретного трека при детальном просмотре то нам уже нужны полноценные комменатрии 
        // для этого после findById(id) доболвяем .populate('comments') и указываем ято надо подтянуть 
        // теперь при отправке запроса в comments получаем не только id а весь объект 
        const track = await this.trackModel.findById(id).populate('comments')
        return track
    }

    // async delete(id: ObjectId): Promise<ObjectId> { // возвращаем только id
    async delete(id: ObjectId): Promise<ObjectId> {
        const track = await this.trackModel.findByIdAndDelete(id)
        return track._id
    }

    // функция будет добовлять комментарий конкретному треку
    async addComment(dto: CreateCommentDto): Promise<Comment> {
        // поулчаем ссначало track что бы в массив comments добвить id комментария и затем перезаписать объект в бд
        console.log(dto.trackId)
        const track = await this.trackModel.findById(dto.trackId) 
        // создаем коментарий монго для этого коментария создаст id 
        const comment = await this.commentModel.create({...dto})
        // в схеме трека в массве comments должны находиться id комментариев
        console.log(track)
        track.comments.push(comment._id)
        await track.save(); // перезаписываем изминения в бд
        return comment;
    }

    async listen(id: ObjectId) {
        const track = await this.trackModel.findById(id) 
        track.listens += 1;
        track.save(); // await не лобовляем так как нас не особо интересует результат выплнения фунции save
    }

    async search(query: string): Promise<Track[]> {
        const tracks = await this.trackModel.find({
            // искать будем по названию трека регулярного выражения параметром в него передаем query и 2 параметром передаем флаг i
            // что бы не было чувствительности к регистру
            name: {$regex: new RegExp(query, 'i')}
        }) 
        return tracks
    }

}
