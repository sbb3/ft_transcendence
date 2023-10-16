import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMessageDataDto {

	@IsNotEmpty()
	@IsString()
	@ApiProperty({example : "550e8400-e29b-41d4-a716-446655440000"})
	conversationId : string;

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