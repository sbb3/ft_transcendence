import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class CheckPasswordDto {

	@IsString()
	@ApiProperty({name : 'password', example : 'password'})
	@IsNotEmpty()
	password : string

	@IsNumber()
	@ApiProperty({name : 'userId', example : 1})
	userId : number
}