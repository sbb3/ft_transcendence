import { Controller, Post, Body, Res, Patch, UseGuards, Req, BadRequestException, Delete } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { DeleteChannelDto } from './dto/delete-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@ApiTags('channels')
@Controller('channels')
export class ChannelsController {
	constructor(private readonly channelsService: ChannelsService) {}

	@Post('create')
	@UseGuards(JwtGuard)
	@ApiBody({type : CreateChannelDto})
	@ApiOperation({summary : "Create a new channel with a unique name."})
	async createNewChannel(@Body() channelDto : CreateChannelDto, @Res() response : Response, @Req() req : Request) {
		try {
			if (!req['user']?.id)
				throw new BadRequestException("Request must contain the owner id.");
			if (channelDto.privacy !== 'protected' && channelDto.password)
				delete channelDto.password;
			await this.channelsService.createChannel(channelDto, req['user'].id);

			return response.status(201).json({message : "Channel created succesfully."});
		}
		catch (error) {
			if (error?.status)
				return response.status(error.status).json(error);
			return response.status(500).json(error);
		}
	}

	@Patch('update')
	@UseGuards(JwtGuard)
	@ApiOperation({summary : "Update one of the channel's fields in the db."})
	@ApiBody({type : UpdateChannelDto})
	async updateChannelFields(@Body() updateChannelDto : UpdateChannelDto, @Res() res : Response, @Req() req : any) {
		try {
			await this.channelsService.updateChannel(updateChannelDto, req?.user?.id);

			return res.status(200).json({message : "Channel has been updated."});
		}
		catch (error) {
			if (error?.status)
				return res.status(error.status).json(error);
			return res.status(500).json(error);
		}
	}

	@Delete('delete')
	@UseGuards(JwtGuard)
	@ApiOperation({summary : "Delete the whole channel from the db."})
	@ApiBody({type : DeleteChannelDto})
	async deleteChannel(@Body() deleteChannelDto : DeleteChannelDto, @Req() request : Request, @Res() response : Response) {
		try {
			if (!request['user']?.id)
				throw new BadRequestException("Request must contain the owner id");
			await this.channelsService.deleteChannel(deleteChannelDto, request['user']?.id);
			return response.status(200).json({message : "Channel has been deleted."})
		}
		catch (error) {
			if (error?.status)
				return response.status(error.status).json(error);
			return response.status(500).json(error);
		}
	}
}