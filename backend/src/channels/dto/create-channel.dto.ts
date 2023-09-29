import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsString, MinLength, ValidateIf } from "class-validator";

export class CreateChannelDto {

	@ApiProperty({
		example : "channelName"
	})
	@IsString()
	@IsNotEmpty()
	name : string;


	@ApiProperty({
		example : "ownerName"
	})
	@IsString()
	@IsNotEmpty()
	owner : string;


	@ApiProperty({
		example : "public/protected/private"
	})
	@IsString()
	@IsNotEmpty()
	@IsIn(['public', 'private', 'protected'])
	privacy : string;


	@ApiProperty({
		example : "password"
	})
	@ValidateIf(o => o.privacy === 'protected')
	@IsString()
	@IsNotEmpty()
	@MinLength(4,  {message : 'password must at least have 4 characters'})
	password : string;


	@ApiProperty({
		example : "description"
	})
	@IsString()
	@IsNotEmpty()
	description : string;


}
