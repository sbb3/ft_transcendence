import { BadRequestException, ConflictException, ConsoleLogger, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDataDto } from './dto/create-message-data.dto';
import UpdateConversationDto from './dto/update-conversation.dto';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService extends PrismaClient {

	constructor(private webSocketGateway : ChatGateway) {
		super();
	}

	async createMessageData(messageDto : CreateMessageDataDto) {
		const sender = await this.user.findUnique({where : {id : messageDto.sender}});
		const receiver = await this.user.findUnique({where : {id : messageDto.receiver}});
		const conversation = await this.conversation.findUnique({where : {id : messageDto.conversationId}});

		if (messageDto.receiver == messageDto.sender)
			throw new BadRequestException('Receiver and sender must have different ids.');
		if (!sender || !receiver)
			throw new NotFoundException(!sender ? ('Sender not found.') : ('Receiver not found.'));
		if (!conversation)
			throw new NotFoundException('Conversation not found.');
		const newMessage = await this.messageData.create({data : messageDto});

		if (!newMessage)
			throw new InternalServerErrorException('Could not create a new message.');

		this.webSocketGateway.sendConversationMessage({
				sender : {
					id : sender.id,
					email : sender.email,
					name : sender.name,
					avatar : sender.avatar
				},
				receiver : {
					id : receiver.id,
					email : receiver.email,
					name : receiver.name,
					avatar : receiver.avatar
				},
				content : newMessage.content,
				lastMessageCreatedAt : newMessage.lastMessageCreatedAt,
				conversationId : newMessage.conversationId
			}
		);
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

	async getAllUserConversations(email : string) {
		const user = await this.user.findUnique({where : {email : email}});

		if (!user)
			throw new NotFoundException('User with email \'' + email + '\' not found.');

		const allConversations = await this.conversation.findMany({
			where : {
				OR : [
					{
						firstMember : user.id
					},
					{
						secondMember : user.id
					}
				]
			}
		});
		const userIds = allConversations.map(conversation => conversation.firstMember == user.id
			? conversation.secondMember
			: conversation.firstMember);
		const all = await this.user.findMany({
			where : {
				id : {
					in : userIds
				}
			}
		});

		const formattedData = allConversations.map(conversation => {
			const first = conversation.firstMember == user.id ? user : all.find(member => member.id == conversation.firstMember);
			const second = conversation.secondMember == user.id ? user : all.find(member => member.id == conversation.secondMember);
			const name = [first.name, second.name];
			const members = [first.email, second.email];
			const avatar = [{
				id : first.id,
				avatar : first.avatar
			}, {
				id : second.id,
				avatar : second.avatar
			}];

			return {
				id : conversation.id,
				name,
				members,
				avatar,
				lastMessageContent : conversation.lastMessageContent,
				lastMessageCreatedAt : conversation.lastMessageCreatedAt
			};
		});

		return formattedData;
	}

	async getConversation(conversationId : number) {
		const conversation = await this.conversation.findUnique({
			where : {
				id : conversationId,
			}
		});

		if (!conversation)
			throw new NotFoundException('Conversation not found.');

		const usersDming = await this.user.findMany({
			where : {
				id : {
					in : [conversation.firstMember, conversation.secondMember]
				}
			}
		});

		if (usersDming.length != 2)
			throw new NotFoundException('User in conversation not found.');
		return [{
			id : conversation.id,
			name : [usersDming[0].name, usersDming[1].name],
			avatar : [
				{
					id : usersDming[0].id,
					avatar : usersDming[0].avatar
				},
				{
					id : usersDming[1].id,
					avatar : usersDming[1].avatar
				}],
			members : [usersDming[0].email, usersDming[1].email],
			lastMessageCreatedAt : conversation.lastMessageCreatedAt,
			lastMessageContent : conversation.lastMessageContent
		}];
	}

	async findConversationByEmails(firstEmail : string, secondEmail : string) {
		const firstUser = await this.user.findUnique({where : { email : firstEmail }});
		const secondUser = await this.user.findUnique({where : { email : secondEmail }});

		if (!firstUser || !secondUser)
			throw new NotFoundException(!firstUser
				? 'User with email \'' + firstEmail + '\' not found.'
				: 'User with email \'' + secondEmail + '\' not found.');
		const conversation = await this.conversation.findMany({
			where : {
				OR : [
					{
						firstMember : firstUser.id,
						secondMember : secondUser.id
					},
					{
						firstMember : secondUser.id,
						secondMember : firstUser.id
					}
				]
			}
		});

		if (conversation.length == 0)
			throw new NotFoundException('Conversation not found.');

		return {
			id : conversation[0].id,
			name : [firstUser.name, secondUser.name],
			avatar : [
				{
					id : firstUser.id,
					avatar : firstUser.avatar
				},
				{
					id : secondUser.id,
					avatar : secondUser.avatar
				}
			],
			members : [firstUser.email, secondUser.email],
			lastMessageContent : conversation[0].lastMessageContent,
			lastMessageCreatedAt : conversation[0].lastMessageCreatedAt
		}
	}

	async deleteConversation(conversationId : number) {
		const conversation = await this.conversation.findUnique({
			where : {
				id : conversationId,
			}
		});
		
		const messages = await this.messageData.findMany({
			where : {
				conversationId : conversationId
			}
		});
	
		if (messages)
			await this.messageData.deleteMany({
				where : {
					conversationId : conversationId
				}
			});	
		if (!conversation)
			throw new NotFoundException('Conversation not found.');

		await this.conversation.delete({
			where : {
				id : conversationId,
			}
		});
	}

	async updateConversation(updateDto : UpdateConversationDto) {
		const conversation = await this.conversation.findUnique({
			where : {
				id : updateDto.id
			}
		});

		if (!conversation)
			throw new NotFoundException('Conversation not found.');
		await this.conversation.update({
			where : {
				id : updateDto.id
			},
			data : updateDto.message
		})
	}

	async getMessagesByConversationId(conversationId : number, page : number) {
		const count = await this.messageData.count();
		const messages = await this.messageData.findMany({
			where : {
				conversationId : conversationId
			},
			skip : (page - 1) * 10,
			take : 10,
			orderBy : {
				lastMessageCreatedAt : 'desc' 
			}
		});

		if (messages.length == 0)
			return {totalPages : Math.ceil(count / 10), messages};
		const sender = await this.user.findUnique({
			where : {
				id : messages[0]?.sender,
			}
		});
		const receiver = await this.user.findUnique({
			where : {
				id : messages[0]?.receiver,
			},
		});

		return messages.map(message => {
			return {
				sender : {
					id : sender.id,
					email : sender.email,
					name : sender.name,
					avatar : sender.avatar
				},
				receiver : {
					id : receiver.id,
					email : receiver.email,
					name : receiver.name,
					avatar : receiver.avatar
				},
				content : message.content,
				lastMessageCreatedAt : message.lastMessageCreatedAt,
				conversationId : message.conversationId
			}
		});
	}
}