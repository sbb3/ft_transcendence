import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMessageDataDto {

	@IsNumber()
	@ApiProperty({example : 1})
	conversationId : number;

	@IsNumber()
	@ApiProperty({example : 1})
	senderId : number;

	@IsNumber()
	@ApiProperty({example : 1})
	receiverId : number;

	@IsString()
	@ApiProperty({example : "Message content."})
	@IsNotEmpty()
	content : string;
}