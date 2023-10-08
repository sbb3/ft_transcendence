import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class EmailQueryDto {
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email : string
}