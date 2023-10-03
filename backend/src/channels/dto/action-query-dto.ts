import { IsIn, IsNotEmpty, IsString } from "class-validator";

export class ActionQueryDto {

	@IsNotEmpty()
	@IsString()
	@IsIn(['mute', 'unmute', 'kick', 'leave'])
	action : string
}