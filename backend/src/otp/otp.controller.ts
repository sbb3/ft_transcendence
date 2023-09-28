import { Controller, ParseIntPipe, Res } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { OtpService } from './otp.service';
import { UseGuards, Post, Body } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Response } from 'express';

@ApiTags('otp')
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

	@ApiOperation({ summary : 'Generate a new otp secret and set it in the db.' })
	@ApiParam({ name : "userId" })
	@Post('generate')
	@UseGuards(JwtGuard)
	async generateOtpSecret(@Body('userId', ParseIntPipe) userId : number, @Res() response : Response) {
		try {
			const user = await this.otpService.findUser({id : userId});
			const secret = this.otpService.generateOtpSecret();
			const otpURL = this.otpService.generateOtpUrl(secret, user.username);
			await this.otpService.updateUserData({id : userId}, {otp_secret : secret});

			return response.json({ otpAuthUrl : otpURL });
		}
		catch (error) {
			return response.status(404).json(error);
		}
	}

	@ApiOperation({ summary : 'Check if the pin is valid and update \'is_otp_enabled\' to true.' })
	@ApiParam({ name : "userId" })
	@ApiParam({ name : "userPin" })
	@Post('verify')
	@UseGuards(JwtGuard)
	async verifyOtp(@Body('userId', ParseIntPipe) userId : number,
		@Body('userPin') userPin : string, @Res() response : Response) {
		try {
			const user = await this.otpService.findUser({id : userId});
			const isValid = this.otpService.verifyTwoFaCode(userPin, user.otp_secret);

			if (isValid)
			{
				await this.otpService.updateUserData({id : userId}, {is_otp_enabled : true});
				return response.json({ verified : true });
			}
			return response.status(403).json({ verified : false });
		}
		catch (error) {
			return response.status(404).json(error);
		}
	}

	@Post('validate')
	@ApiOperation({ summary : 'Check if the pin is valid and update \'is_otp_validated\' to true.' })
	@ApiParam({ name : "userId" })
	@ApiParam({ name : "userPin" })
	@UseGuards(JwtGuard)
	async validateOtp(@Body('userId', ParseIntPipe) userId : number,
		@Body('userPin') userPin : string, @Res() response : Response) {
		try {
			const user = await this.otpService.findUser({id : userId});
			const isValid = this.otpService.verifyTwoFaCode(userPin, user.otp_secret);

			if (isValid)
			{
				await this.otpService.updateUserData({id : userId}, {is_otp_validated : true});
				return response.json({ validated : true });
			}
			return response.status(403).json({ validated : false });
		}
		catch (error) {
			return response.status(404).json(error);
		}
	}

	@Post('disable')
	@ApiOperation({ summary : 'Set \'is_otp_enabled\' and \'is_otp_validated\' to false.' })
	@ApiParam({ name : "userId" })
	@UseGuards(JwtGuard)
	async disableOtp(@Body('userId', ParseIntPipe) userId : number, @Res() response : Response) {
		try {
			await this.otpService.updateUserData({id : userId}, {
				is_otp_enabled : false,
				otp_secret : null,
				is_otp_validated : false,
			});

			return response.json({ otp_disabled : true });
		}
		catch (error) {
			return response.status(404).json(error);
		}
	}
}