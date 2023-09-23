import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { ChatService } from './chat.service';

@WebSocketGateway({ namespace : '/chat' })
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('createChat')
  create(@MessageBody() createChatDto: any) {
    return this.chatService.create(createChatDto);
  }

  @SubscribeMessage('findAllChat')
  findAll() {
    return this.chatService.findAll();
  }

  @SubscribeMessage('findOneChat')
  findOne(@MessageBody() id: number) {
    return this.chatService.findOne(id);
  }

  @SubscribeMessage('updateChat')
  update(@MessageBody() updateChatDto: any) {
    return this.chatService.update(updateChatDto.id, updateChatDto);
  }

  @SubscribeMessage('removeChat')
  remove(@MessageBody() id: number) {
    return this.chatService.remove(id);
  }
}
