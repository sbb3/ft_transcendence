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
			const data : any = queryDto.name 
				? await this.channelsService.findUniqueChannel({name : queryDto.name}, this.channelSelectionOptions)
				: await this.channelsService.getAvailableChannels(this.channelSelectionOptions);

			if (queryDto.name)
				data.members = this.channelsService.formatMembers(data.members);
			else {
				data.forEach(channel => {
					channel.members = this.channelsService.formatMembers(channel.members);
				})
			}
			return response.status(200).json(data);
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
			const channel : any = await this.channelsService.findUniqueChannel({id : id}, this.channelSelectionOptions);

			channel.members = this.channelsService.formatMembers(channel.members);
			return (response.status(200).json(channel));
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

	@Get(':id/members')
	@UseGuards(JwtGuard)
	@ApiOperation({summary : 'Get all members of a specified channel.'})
	@ApiParam({name : 'id', required : true})
	async getAllChannelMembers(@Param('id', ParseIntPipe) channelId : number, @Res() response : Response) {
		try {
			const allMembers = await this.channelsService.getAllChannelMembers(channelId);

			return response.status(200).json(this.channelsService.formatMembers(allMembers.members));
		}
		catch (error) {
			if (error?.status)
				return response.status(error.status).json(error);
			return response.status(500).json(error);
		}
	}

	@Patch(':channelId/members/:userId/mute')
	@UseGuards(JwtGuard)
	@ApiParam({name : 'channelId'})
	@ApiParam({name : 'userId'})
	@ApiOperation({summary : 'Mute a member of a specific channel.'})
	async muteMember(@Param('channelId', ParseIntPipe) channelId : number,
				@Param('userId', ParseIntPipe) userId : number,
				@Res() response : Response) {
		try {
			await this.channelsService.muteOrUnmute(true, channelId, userId);

			return response.status(200).json({message : 'Member has been muted.'});
		}
		catch (error) {
			if (error.status)
				return response.status(error.status).json(error);
			return response.status(500).json(error);
		}
	}

	@Patch(':channelId/members/:userId/unmute')
	@UseGuards(JwtGuard)
	@ApiParam({name : 'channelId'})
	@ApiParam({name : 'userId'})
	@ApiOperation({summary : 'Unmute a member of a specific channel.'})
	async unmuteMember(@Param('channelId', ParseIntPipe) channelId : number,
				@Param('userId', ParseIntPipe) userId : number,
				@Res() response : Response) {
		try {
			await this.channelsService.muteOrUnmute(false, channelId, userId);

			return response.status(200).json({message : 'Member has been unmuted.'})
		}
		catch (error) {
			if (error.status)
				return response.status(error.status).json(error);
			return response.status(500).json(error);
		}
	}

	@Patch(':channelId/members/:userId/leave')
	@UseGuards(JwtGuard)
	@ApiParam({name : 'channelId'})
	@ApiParam({name : 'userId'})
	@ApiOperation({summary : 'Remove a user from a channel.'})
	async leaveChannel(@Param('channelId', ParseIntPipe) channelId : number,
			@Param('userId', ParseIntPipe) userId : number ,@Res() response : Response) {
		try {
			await this.channelsService.removeMember(channelId, userId);

			return response.json({message : 'This member has been removed from the channel.'});
		}
		catch (error) {
			if (error.status)
				return response.status(error.status).json(error);
			return response.status(500).json(error);
		}
	}

	private readonly channelSelectionOptions = {
					name : true,
					privacy : true, 
					description : true,
					owner : true,
					members : {
						select : {
							user :
							{
								select : {
									name : true,
									username : true,
									avatar : true,
								}
							},
							isMuted : true,
							role : true,
						}
					}
				};
}

// When getting resources, select specific informations (check for getting channels)
// Check for the patch route (should we handle every channel info in one route ?)

// To do
// Kick => PATCH /channels/:channelId/members/:memberId/kick
// Join => PATCH /channels/:channelId/join?username=''
// Ban => PATCH /channels/:channelId/members/:memberId/ban
// Mute => PATCH /channels/:channelId/members/:memberId/mute : need validation
// Unmute => PATCH /channels/:channelId/members/:memberId/unmute : need validation
// Leave => PATCH /channels/:channelId/members/:memberId/leave : done

// To check later
// Remove member in service : check if the owner can leave (atm he can't, if he will, then remove the channel ?)
// MuteOrUnmute : can the admin mute the admin