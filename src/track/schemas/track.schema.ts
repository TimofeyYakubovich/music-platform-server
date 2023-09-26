
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { HydratedDocument } from 'mongoose';
import {Document} from 'mongoose';
import * as mongoose from 'mongoose'

// export type TrackDocument = HydratedDocument<Track>;
export type TrackDocument = Track & Document;

@Schema()
export class Track {

  @Prop()
  name: string;

  @Prop()
  artist: string;

  @Prop()
  text: string;

  @Prop()
  listens: number;

  @Prop()
  picture: string;

  @Prop()
  audio: string;

  // массив с коментариями массив типа Comment comments: Comment[]
  // в @Prop({}) указываем как эти сущнсти будут между собой связаны обозначем тип массив type: [] элимент каторого будет типа type: ObjectId
  // тоесть в самом массиве мы не будем хранить целиком комментарии а только ссылки на эти комментарии id
  // и указываем fer ссылку на схему Comment
  // @Prop({type: {type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]}})
  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]})
  comments: Comment[];

}

export const TrackSchema = SchemaFactory.createForClass(Track);