import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class CheckPasswordDto {

	@IsString()
	@IsNotEmpty()
	password : string

	@IsNumber()
	userId : number
}