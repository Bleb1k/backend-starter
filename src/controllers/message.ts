import {
  Body,
  Controller,
  Ctx,
  CurrentUser,
  Delete,
  Flow,
  Get,
  Post,
  Put,
  State,
} from 'amala'
import { Context } from 'koa'
import { DocumentType } from '@typegoose/typegoose'
import { Message, MessageModel } from '@/models/message'
import { User } from '@/models/user'
import MessageValidator from '@/validators/MessageValidator'
import auth from '@/middleware/auth'
import checkUser from '@/middleware/checkUser'

@Controller('/message')
@Flow(auth)
export default class MessageController {
  @Post('/')
  createMessage(
    @Body({ required: true }) { text }: MessageValidator,
    @CurrentUser() author: User
  ) {
    return MessageModel.create({ text, author })
  }

  @Get('/:id')
  @Flow(checkUser)
  getMessage(@State('message') message: DocumentType<Message>) {
    return message
  }

  @Put('/:id')
  @Flow(checkUser)
  updateMessage(
    @Ctx() ctx: Context,
    @State('message') message: DocumentType<Message>,
    @Body({ required: true }) { text }: MessageValidator
  ) {
    message.text = text
    return message.save()
  }

  @Delete('/:id')
  @Flow(checkUser)
  deleteMessage(@State('message') message: DocumentType<Message>) {
    return message.deleteOne()
  }
}
