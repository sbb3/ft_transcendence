import { Body, Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { response, Response } from 'express';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ChatService } from './chat.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDataDto } from './dto/create-message-data.dto';
import { EmailQueryDto } from './dto/email-query.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {

	constructor(private chatService : ChatService) { }

	@Post('messageData')
	@UseGuards(JwtGuard)
	@ApiBody({type : CreateMessageDataDto})
	async createMessageData(@Body() createMessageDto :  CreateMessageDataDto, @Res() response : Response) {
		try {
			await this.chatService.createMessageData(createMessageDto);

			return response.status(201).json({message : "Message data created."})
		}
		catch (error) {
			if (error.status)
				return response.status(error.status).json(error);
			return response.status(500).json(error);
		}
	}

	@Post('conversation')
	@UseGuards(JwtGuard)
	@ApiBody({type : CreateConversationDto})
	async createConversation(@Body() createConversationDto : CreateConversationDto,
		@Res() response : Response) {
		try {
			await this.chatService.createConversation(createConversationDto);

			return response.status(201).json({message : 'Conversation created.'})
		}
		catch (error) {
			if (error.status)
				return response.status(error.status).json(error);
			return response.status(500).json(error);
		}
	}

}
