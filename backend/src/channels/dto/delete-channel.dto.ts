import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class DeleteChannelDto {

	@ApiProperty({example : "channelId"})
	@IsNumber()
	channelId : number

}