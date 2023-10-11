import { ApiProperty } from "@nestjs/swagger";
import { ArrayMaxSize, ArrayMinSize, ArrayNotEmpty, ArrayUnique, IsArray, IsNumber, ValidateIf } from "class-validator";

export class CreateConversationDto {

	@IsNumber()
	firstMember : number;

	@IsNumber()
	secondMember : number;
}