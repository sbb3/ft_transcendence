import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsNumber, IsString } from "class-validator";

export class CreateConversationDto {

	@ApiProperty({example : 1})
	@IsNumber()
	firstMember : number;

	@ApiProperty({example : 2})
	@IsNumber()
	secondMember : number;

	@ApiProperty({example : "date here"})
	@Transform(({ value }) => new Date(value))
	@IsDate()
	lastMessageCreatedAt : Date

	@ApiProperty({example : "your message here"})
	@IsString()
	lastMessageContent : string
}