import { Body, Controller, Get, ParseIntPipe, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ChatService } from './chat.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDataDto } from './dto/create-message-data.dto';
import { EmailQueryDto, MembersQueryDto } from './dto/email-query.dto';

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

	@Get('conversations')
	@UseGuards(JwtGuard)
	@ApiQuery({name : 'email'})
	async getConversations(@Res() response : Response, @Query() emailQuery : EmailQueryDto) {
		try {
			const data = await this.chatService.getAllUserConversations(emailQuery.email);
			
			return response.status(200).json(data);
		}
		catch (error) {
			if (error.status)
				return response.status(error.status).json(error);
			return response.status(500).json(error);
		}
	}

	@Get('conversation')
	@UseGuards(JwtGuard)
	@ApiQuery({name : 'id'})
	async getConversation(@Res() response : Response, @Query('id', ParseIntPipe) conversationId : number) {
		try {
			const data = await this.chatService.getConversation(conversationId);

			return response.status(200).json(data);
		}
		catch (error) {
			if (error.status)
				return response.status(error.status).json(error);
			return response.status(500).json(error);
		}
	}

	@Get('conversationByEmails')
	@UseGuards(JwtGuard)
	@ApiQuery({name : 'member1'})
	@ApiQuery({name : 'member2'})
	async getConversationByEmail(@Query() queryDto : MembersQueryDto, @Res() response : Response) {
			try {
				const data = await this.chatService.findConversationByEmails(queryDto.member1, queryDto.member2);

				return response.status(200).json(data)
			}
			catch (error) {
				if (error.status)
					return response.status(error.status).json(error);
				return response.status(500).json(error);
			}
	}
}
