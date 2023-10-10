import { IsDate, IsNotEmpty, IsString } from "class-validator";

export default class UpdateConversationDto {

	@IsString()
	@IsNotEmpty()
	lastMessage : string

	@IsDate()
	lastMessageCreatedAt : Date
}