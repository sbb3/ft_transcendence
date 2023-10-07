import { ApiParam, ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMessageDto {

	@IsNumber()
	@ApiProperty({example : 'channelId'})
	channelId : number;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({example : 'Message to send.'})
	content : string;

	@IsNumber()
	@ApiProperty({example : '21'})
	senderId : number;
}