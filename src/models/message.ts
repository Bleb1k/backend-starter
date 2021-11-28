import { Ref, getModelForClass, prop } from '@typegoose/typegoose'
import { Types } from 'mongoose'
import { User } from '@/models/user'

export class Message {
  @prop({ required: true })
  text!: string
  @prop({ required: true, index: true, ref: () => User })
  author!: Ref<User, Types.ObjectId>
}

export const MessageModel = getModelForClass(Message)
