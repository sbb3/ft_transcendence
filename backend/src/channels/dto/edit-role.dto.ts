import { IsIn, IsNotEmpty, IsString } from "class-validator";

export class EditRoleDto {

	@IsString()
	@IsNotEmpty()
	@IsIn(['admin', 'member'])
	role : string;

}