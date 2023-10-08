import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDataDto } from './dto/create-message-data.dto';

@Injectable()
export class ChatService extends PrismaClient {

	async createMessageData(messageDto : CreateMessageDataDto) {
		const sender = await this.user.findUnique({where : {id : messageDto.senderId}});
		const receiver = await this.user.findUnique({where : {id : messageDto.receiverId}});
		const conversation = await this.conversation.findUnique({where : {id : messageDto.conversationId}});

		if (messageDto.receiverId == messageDto.senderId)
			throw new BadRequestException('Receiver and sender must have different ids.');
		if (!sender || !receiver)
			throw new NotFoundException(!sender ? ('Sender not found.') : ('Receiver not found.'));
		if (!conversation)
			throw new NotFoundException('Conversation not found.');
		const newMessage = await this.messageData.create({data : messageDto});

		if (!newMessage)
			throw new InternalServerErrorException('Could not create a new message.');
	}

	async createConversation(createConversationDto : CreateConversationDto) {
		if (createConversationDto.firstMember == createConversationDto.secondMember)
			throw new BadRequestException('Ids must be different');

		const firstUser = await this.user.findUnique({where : { id : createConversationDto.firstMember }});
		const secondUser = await this.user.findUnique({where : { id : createConversationDto.secondMember }});
		const conversation = await this.conversation.findMany({
			where : {
				firstMember : {
					in : [createConversationDto.firstMember, createConversationDto.secondMember]
				},
				secondMember : {
					in : [createConversationDto.firstMember, createConversationDto.secondMember]
				}
			}
		})

		if (conversation.length > 0)
			throw new ConflictException('Conversation already exists.');
		if (!firstUser || !secondUser)
			throw new NotFoundException(!firstUser
				? ('User with id \'' + createConversationDto.firstMember + '\' not found.')
				: ('User with id \'' + createConversationDto.secondMember + '\' not found.'));
		const newConversation = await this.conversation.create({
			data : createConversationDto});

		if (!newConversation)
			throw new InternalServerErrorException('Could not create a new conversation.');
	}

}