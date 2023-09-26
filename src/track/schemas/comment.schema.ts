
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
// import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose'
import { Track } from './track.schema';

// export type CommentDocument = HydratedDocument<Comment>;
export type CommentDocument = Comment & Document;

@Schema()
export class Comment {

  @Prop()
  username: string;

  @Prop()
  text: string;

  // указываем к какому треку принадлещит комментарий
  // в @Prop указываем тип type уже не массив и ссылка ref на сам трек
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Track'})
  track: Track;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);