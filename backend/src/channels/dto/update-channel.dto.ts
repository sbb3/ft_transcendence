import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpdateChannelDto {

	@ApiProperty({example : "10"})
	@IsNumber()
	channelId : number

	@ApiPropertyOptional({example : "channelName"})
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	name : string

	@ApiPropertyOptional({example : "private/public/protected"})
	@IsIn(['private', 'protected', 'public'])
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	privacy : string

	@ApiPropertyOptional({example : "password"})
	@IsOptional()
	@IsString()
	password : string

	@ApiPropertyOptional({example : "channelDescription"})
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	description : string
}
