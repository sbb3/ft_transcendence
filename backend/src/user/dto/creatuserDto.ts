import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreatUserDto {

    @IsNumber()
    id : number;

    @IsString()
    player_name : string;

    @IsString()
    status : string;

    @IsNumber()
    max_score : number;

    @IsString()
    level : string;

    @IsString()
    otp_enavled : boolean;

    @IsString()
    otp_secrect_tocken : string;

    @IsBoolean()
    is_profile_has_been_set : boolean;
}
