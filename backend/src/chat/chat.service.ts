import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { conversation, PrismaClient, user } from '@prisma/client';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDataDto } from './dto/create-message-data.dto';
import UpdateConversationDto from './dto/update-conversation.dto';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService extends PrismaClient {
  constructor(private webSocketGateway: ChatGateway) {
    super();
  }

  async createMessageData(messageDto: CreateMessageDataDto) {
    // console.log('messageDto: ', JSON.stringify(messageDto));
    const sender = await this.user.findUnique({
      where: { id: messageDto.sender },
    });
    const receiver = await this.user.findUnique({
      where: { id: messageDto.receiver },
    });
    const conversation = await this.conversation.findUnique({
      where: { id: messageDto.conversationId },
    });

    if (messageDto.receiver == messageDto.sender)
      throw new BadRequestException(
        'Receiver and sender must have different ids.',
      );
    if (!sender || !receiver)
      throw new NotFoundException(
        !sender ? 'Sender not found.' : 'Receiver not found.',
      );
    if (!conversation) throw new NotFoundException('Conversation not found.');
    const newMessage = await this.messageData.create({ data: messageDto });
    // console.log('newMessage id: ', newMessage.id);
    if (!newMessage)
      throw new InternalServerErrorException('Could not create a new message.');
    this.webSocketGateway.sendConversationMessage({
      id: messageDto.id,
      sender: sender.id,
      receiver: receiver.id,
      content: newMessage.content,
      lastMessageCreatedAt: newMessage.lastMessageCreatedAt,
      conversationId: newMessage.conversationId,
    });
  }

  async createConversation(createConversationDto: CreateConversationDto) {
    if (createConversationDto.firstMember == createConversationDto.secondMember)
      throw new BadRequestException('Ids must be different');

    const firstUser = await this.user.findUnique({
      where: { id: createConversationDto.firstMember },
    });
    const secondUser = await this.user.findUnique({
      where: { id: createConversationDto.secondMember },
    });
    if (!firstUser || !secondUser)
      throw new NotFoundException(
        !firstUser
          ? "User with id '" +
            createConversationDto.firstMember +
            "' not found."
          : "User with id '" +
            createConversationDto.secondMember +
            "' not found.",
      );
    const conversation = await this.conversation.findMany({
      where: {
        firstMember: {
          in: [
            createConversationDto.firstMember,
            createConversationDto.secondMember,
          ],
        },
        secondMember: {
          in: [
            createConversationDto.firstMember,
            createConversationDto.secondMember,
          ],
        },
      },
    });

    if (conversation.length > 0)
      return this.formatConversation(conversation[0], firstUser, secondUser);
    const newConversation = await this.conversation.create({
      data: createConversationDto,
    });
    if (!newConversation)
      throw new InternalServerErrorException(
        'Could not create a new conversation.',
      );
    this.webSocketGateway.sendConversationData(
      this.formatConversation(newConversation, firstUser, secondUser),
    );
    return this.formatConversation(newConversation, firstUser, secondUser);
  }

  async getAllUserConversations(email: string) {
    const user = await this.user.findUnique({ where: { email: email } });

    if (!user)
      throw new NotFoundException("User with email '" + email + "' not found.");
    const allConversations = await this.conversation.findMany({
      where: {
        OR: [
          {
            firstMember: user.id,
          },
          {
            secondMember: user.id,
          },
        ],
      },
    });
    const userIds = allConversations.map((conversation) =>
      conversation.firstMember == user.id
        ? conversation.secondMember
        : conversation.firstMember,
    );
    const all = await this.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });

    const formattedData = allConversations.map((conversation) => {
      const first =
        conversation.firstMember == user.id
          ? user
          : all.find((member) => member.id == conversation.firstMember);
      const second =
        conversation.secondMember == user.id
          ? user
          : all.find((member) => member.id == conversation.secondMember);
      return this.formatConversation(conversation, first, second);
    });

    return formattedData;
  }

  async getConversation(conversationId: string) {
    const conversation = await this.conversation.findUnique({
      where: {
        id: conversationId,
      },
    });

    if (!conversation) throw new NotFoundException('Conversation not found.');
    const usersDming = await this.user.findMany({
      where: {
        id: {
          in: [conversation.firstMember, conversation.secondMember],
        },
      },
    });

    if (usersDming.length != 2)
      throw new NotFoundException('User in conversation not found.');
    return [
      this.formatConversation(conversation, usersDming[0], usersDming[1]),
    ];
  }

  async findConversationByEmails(firstEmail: string, secondEmail: string) {
    const firstUser = await this.user.findUnique({
      where: { email: firstEmail },
    });
    const secondUser = await this.user.findUnique({
      where: { email: secondEmail },
    });

    if (!firstUser || !secondUser)
      throw new NotFoundException(
        !firstUser
          ? "User with email '" + firstEmail + "' not found."
          : "User with email '" + secondEmail + "' not found.",
      );
    const conversation = await this.conversation.findMany({
      where: {
        OR: [
          {
            firstMember: firstUser.id,
            secondMember: secondUser.id,
          },
          {
            firstMember: secondUser.id,
            secondMember: firstUser.id,
          },
        ],
      },
    });

    if (conversation.length == 0) return [];
    return [this.formatConversation(conversation[0], firstUser, secondUser)];
  }

  async deleteConversation(conversationId: string) {
    const conversation = await this.conversation.findUnique({
      where: {
        id: conversationId,
      },
    });
    if (!conversation) return 'Conversation already deleted.';

    const messages = await this.messageData.findMany({
      where: {
        conversationId: conversationId,
      },
    });

    if (messages)
      await this.messageData.deleteMany({
        where: {
          conversationId: conversationId,
        },
      });

    await this.conversation.delete({
      where: {
        id: conversationId,
      },
    });

    this.webSocketGateway.sendDeleteConversationData({
      id: conversationId,
    });

    return 'Conversation and related messages deleted successfully.';
  }

  async updateConversation(updateDto: UpdateConversationDto) {
    const conversation = await this.conversation.findUnique({
      where: {
        id: updateDto.id,
      },
    });

    if (!conversation) throw new NotFoundException('Conversation not found.');
    await this.conversation.update({
      where: {
        id: updateDto.id,
      },
      data: updateDto.message,
    });
  }

  async getMessagesByConversationId(conversationId: string, page: number) {
    const count = await this.messageData.count({
      where: {
        conversationId,
      },
    });
    const messages = await this.messageData.findMany({
      where: {
        conversationId: conversationId,
      },
      skip: (page - 1) * 10,
      take: 10,
      orderBy: {
        lastMessageCreatedAt: 'desc',
      },
    });

    if (messages.length == 0)
      return { totalPages: Math.ceil(count / 10), messages };
    const sender = await this.user.findUnique({
      where: {
        id: messages[0]?.sender,
      },
    });
    const receiver = await this.user.findUnique({
      where: {
        id: messages[0]?.receiver,
      },
    });

    const msgs = messages.map((message) => {
      return {
        id: message.id,
        sender: sender.id,
        receiver: receiver.id,
        content: message.content,
        lastMessageCreatedAt: message.lastMessageCreatedAt,
        conversationId: message.conversationId,
      };
    });
    return {
      messages: msgs,
      totalPages: Math.ceil(count / 10),
    };
  }

  private formatConversation(
    conversation: conversation,
    firstMember: user,
    secondMember: user,
  ) {
    return {
      id: conversation.id,
      name: [firstMember.name, secondMember.name],
      avatar: [
        {
          id: firstMember.id,
          avatar: firstMember.avatar,
        },
        {
          id: secondMember.id,
          avatar: secondMember.avatar,
        },
      ],
      members: [firstMember.email, secondMember.email],
      lastMessageCreatedAt: conversation.lastMessageCreatedAt,
      lastMessageContent: conversation.lastMessageContent,
    };
  }
}
