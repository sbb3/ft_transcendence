import { IsNotEmpty, IsString } from "class-validator";

export class UsernameQueryDto {
	@IsString()
	@IsNotEmpty()
	username : string;
}