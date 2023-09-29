import { Controller, Post, Body, Res, Patch } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@ApiTags('channels')
@Controller('channels')
export class ChannelsController {
	constructor(private readonly channelsService: ChannelsService) {}

	@ApiBody({type : CreateChannelDto})
	@ApiOperation({summary : "Create a new channel with a unique name."})
	@Post('create')
	async createNewChannel(@Body() channelDto : CreateChannelDto, @Res() response : Response) {
		try {
			if (channelDto.privacy !== 'protected' && channelDto.password)
				delete channelDto.password;
			await this.channelsService.createChannel(channelDto);

			return response.status(201).json({message : "Channel created succesfully."});
		}
		catch (error) {
			if (error?.status == 409)
				return response.status(409).json({
					error : "Channel name exists",
					message : "The channel name \'" + channelDto.name + "\' is already taken.",
				})

			return response.status(500).json(error);
		}
	}

	@ApiBody({type : UpdateChannelDto})
	@Patch('update')
	@ApiOperation({summary : "Update one of the channel's fields in the db."})
	@ApiBody({type : UpdateChannelDto})
	async updateChannelFields(@Body() updateChannelDto : UpdateChannelDto, @Res() res : Response) {
		try {
			await this.channelsService.updateChannel(updateChannelDto);

			return res.status(200).json({message : "Channel has been updated."})
		}
		catch (error) {
			if (error?.status)
				return res.status(error.status).json(error);
			return res.status(500).json(error);
		}
	}

}
