import { Controller, Post, Body, Res, Patch, UseGuards, Req,
	BadRequestException, Delete, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { QueryDto } from './dto/query.dto';
import { CheckPasswordDto } from './dto/check-password.dto';

@ApiTags('channels')
@Controller('channels')
export class ChannelsController {
	constructor(private readonly channelsService: ChannelsService) {}

	@Post()
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

	@Patch(':id')
	@UseGuards(JwtGuard)
	@ApiOperation({summary : "Update one of the channel's general infos in the db."})
	@ApiBody({type : UpdateChannelDto})
	async updateChannelFields(@Body() updateChannelDto : UpdateChannelDto,
		@Param('id', ParseIntPipe) channelId : number, @Res() res : Response, @Req() req : any) {
		try {
			await this.channelsService.updateChannel(updateChannelDto, req?.user?.id, channelId);

			return res.status(200).json({message : "Channel has been updated."});
		}
		catch (error) {
			if (error?.status)
				return res.status(error.status).json(error);
			return res.status(500).json(error);
		}
	}

	@Delete(':id')
	@UseGuards(JwtGuard)
	@ApiOperation({summary : 'Delete a specific channel from the db.'})
	@ApiParam({name : 'id'})
	async deleteChannel(@Param('id', ParseIntPipe) channelId : number, @Req() request : Request, @Res() response : Response) {
		try {
			if (!request['user']?.id)
				throw new BadRequestException("Request must contain the owner id");
			await this.channelsService.deleteChannel(channelId, request['user']?.id);
			return response.status(200).json({message : "Channel has been deleted."})
		}
		catch (error) {
			if (error?.status)
				return response.status(error.status).json(error);
			return response.status(500).json(error);
		}
	}

	@Get()
	@UseGuards(JwtGuard)
	@ApiQuery({name : "name", required : false})
	@ApiOperation({summary : "Get a single channel by name or all channels that are either public or protected."})
	async getAll(@Query() queryDto : QueryDto,  @Res() response : Response) {
		try {
			return response.json(queryDto.name 
				? await this.channelsService.findUniqueChannel({name : queryDto.name}, undefined)
				: await this.channelsService.getAvailableChannels());
		}
		catch (error) {
			if (error.status)
				return response.status(error.status).json(error);
			return response.status(500).json(error);
		}
	}

	@Get(':id')
	@UseGuards(JwtGuard)
	@ApiParam({name : 'id', required : true})
	@ApiOperation({summary : "Get a channel by id."})
	async getSingleChannel(@Param('id', ParseIntPipe) id : number, @Res() response : Response) {
		try {
			return (response.status(200).json(await this.channelsService.findUniqueChannel({id : id}, {
				id : true,
				name : true,
				createdAt : true,
				owner : true,
				privacy : true,
				description : true,
				members : true
			})));
		}
		catch (error) {
			if (error?.status)
				return response.status(error.status).json(error);
			return response.status(500).json(error);
		}
	}

	@Post(':id/checkPassword')
	@UseGuards(JwtGuard)
	@ApiParam({name : 'id', required : false})
	@ApiOperation({summary : 'Validate input password and join a protected channel.'})
	async validateAndJoin(@Param('id', ParseIntPipe) channelId : number, @Res() response : Response, @Body() checkPasswordDto : CheckPasswordDto) {
		try {
			await this.channelsService.validateChannelPassword(channelId, checkPasswordDto);

			return response.status(200).json({message : 'User has joined this channel succesfully.'});
		}
		catch (error) {
			if (error?.status)
				return response.status(error.status).json(error);
			return response.status(500).json(error);
		}
	}

}

// When getting resources, select specific informations (check for getting channels)
// Check for the patch route (should we handle every channel info in one route ?)
// Should not forget the password validation route (join directly or not)