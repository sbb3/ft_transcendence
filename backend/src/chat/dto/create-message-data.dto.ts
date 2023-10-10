import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMessageDataDto {

	@IsNumber()
	@ApiProperty({example : 1})
	conversationId : number;

	@IsNumber()
	@ApiProperty({example : 1})
	sender : number;

	@IsNumber()
	@ApiProperty({example : 1})
	receiver : number;

	@IsString()
	@ApiProperty({example : "Message content."})
	@IsNotEmpty()
	content : string;
}