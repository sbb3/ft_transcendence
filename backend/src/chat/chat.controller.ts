import { Body, Controller, Delete, Get, Param, ParseArrayPipe, ParseIntPipe, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
import { response, Response } from 'express';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ChatService } from './chat.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDataDto } from './dto/create-message-data.dto';
import { EmailQueryDto, MembersQueryDto } from './dto/email-query.dto';
import UpdateConversationDto from './dto/update-conversation.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {

	constructor(private chatService : ChatService) { }

	@Post('messageData')
	@UseGuards(JwtGuard)
	@ApiBody({type : CreateMessageDataDto})
	@ApiOperation({summary : 'Create a new message.'})
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
	@ApiOperation({summary : 'Create a new conversation.'})
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
	@ApiOperation({summary : 'Get conversations with a specified email.'})
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
	@ApiOperation({summary : 'Get a single conversation by id.'})
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
	@ApiOperation({summary : 'Get a single conversation by 2 emails.'})
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

	@Delete('conversation/:conversationId')
	@UseGuards(JwtGuard)
	@ApiProperty({name : 'conversationId'})
	@ApiOperation({summary : 'Delete a conversation by id.'})
	async deleteConversation(@Param('conversationId', ParseIntPipe) id : number, @Res() response : Response) {
		try {
			await this.chatService.deleteConversation(id);

			return response.status(200).json({message : 'Conversation and related messages deleted successfully.'});
		}
		catch (error) {
			if (error.status)
				return response.status(error.status).json(error);
			return response.status(500).json(error);
		}
	}

	@Patch('conversation/:conversationId')
	@UseGuards(JwtGuard)
	@ApiProperty({name : 'conversationId'})
	@ApiOperation({summary : 'Update a conversation by id.'})
	@ApiBody({type : UpdateConversationDto})
	async updateConversation(@Param('conversationId', ParseIntPipe) id : number, @Res() response : Response,
		@Body() updateDto : UpdateConversationDto) {
		try {
			await this.chatService.updateConversation(id, updateDto);

			return response.status(200).json({message : 'Success'});
		}
		catch (error) {
			if (error.status)
				return response.status(error.status).json(error);
			return response.status(500).json(error);
		}
	}
	
}
