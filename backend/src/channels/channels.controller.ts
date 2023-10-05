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
import { ActionQueryDto } from './dto/action-query-dto';
import { UsernameQueryDto } from './dto/username-query-dto';
import { EditRoleDto } from './dto/edit-role.dto';

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
			if (!req['user']?.id)
				throw new BadRequestException("Request must contain the owner id.");
			await this.channelsService.updateChannel(updateChannelDto, req['user'].id, channelId);

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
	async getUniqueOrAllChannels(@Query() queryDto : QueryDto,  @Res() response : Response) {
		try {
			const data = queryDto.name
				? await this.channelsService.getChannelWithMembers(queryDto.name, this.channelSelectionOptions, -1)
				: await this.channelsService.getAvailableChannels(this.channelSelectionOptions);

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
			const channel : any = await this.channelsService.getChannelWithMembers(null, this.channelSelectionOptions, id);

			return response.status(200).json(channel);
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
	@ApiBody({type : CheckPasswordDto})
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

			return response.status(200).json(allMembers);
		}
		catch (error) {
			if (error?.status)
				return response.status(error.status).json(error);
			return response.status(500).json(error);
		}
	}

	@Patch(':channelId/members/:userId/')
	@UseGuards(JwtGuard)
	@ApiParam({name : 'channelId'})
	@ApiParam({name : 'userId'})
	@ApiQuery({name : 'action'})
	@ApiOperation({summary : 'Leave/Kick/Mute/Unmute a member.'})
	async patchMemberOfAChannel(@Query() actionQueryDto : ActionQueryDto,
		@Param('channelId', ParseIntPipe) channelId : number,
		@Param('userId', ParseIntPipe) userId : number,
		@Res() response : Response, @Req() request : Request) {
		try {
			if (!request['user'].id)
				throw new BadRequestException('Request must contain the owner id.');
			if (actionQueryDto.action == 'leave' || actionQueryDto.action == 'kick')
				await this.channelsService.removeMember(channelId, userId, actionQueryDto.action, request['user'].id);
			else if (actionQueryDto.action == 'mute' || actionQueryDto.action == 'unmute')
				await this.channelsService.muteOrUnmute(actionQueryDto.action == 'mute' ? true : false, channelId, userId, request['user'].id);

			return response.status(200).json({message : 'The action \'' + actionQueryDto.action + '\' has been completed.'});
		}
		catch (error) {
			if (error.status)
				return response.status(error.status).json(error);
			return response.status(500).json(error);
		}
	}

	@Patch(':channelId/join')
	@UseGuards(JwtGuard)
	@ApiOperation({summary : 'Join a specific private or public channel.'})
	@ApiParam({name : 'channelId'})
	@ApiQuery({name : 'username', required : true})
	async joinAChannel(@Param('channelId', ParseIntPipe) channelId : number,
		@Query() usernameQuery : UsernameQueryDto, @Res() response : Response) {
		try {
			await this.channelsService.validateAndJoinChannel(channelId, usernameQuery.username);

			return response.status(200).json({message : 'User has joined the channel.'});
		}
		catch (error) {
			if (error.status)
				return response.status(error.status).json(error);
			return response.status(500).json(error);
		}
	}

	@Patch(':channelId/members/:userId/edit')
	@UseGuards(JwtGuard)
	@ApiOperation({summary : 'Edit the role of a member.'})
	@ApiParam({name : 'channelId'})
	@ApiParam({name : 'userId'})
	@ApiBody({type : EditRoleDto})
	async editRoleOfMembers(@Res() response : Response, @Param('channelId', ParseIntPipe) channelId : number,
		@Param('userId', ParseIntPipe) userToEditId : number, @Req() request : Request, @Body() roleDto : EditRoleDto) {
			try {
				if (!request['user']?.id)
					throw new BadRequestException('Request must contain the owner id.');
				await this.channelsService.editMemberRole(channelId, userToEditId, request['user'].id, roleDto.role);

				return response.status(200).json({message : 'Role of user has been edited.'})
			}
			catch (error) {
				if (error.status)
					return response.status(error.status).json(error);
				return response.status(500).json(error);
			}
	}

	@Patch(':channelId/members/:memberId/ban')
	@UseGuards(JwtGuard)
	@ApiParam({name : 'channelId'})
	@ApiParam({name : 'memberId'})
	async banMember(@Req() request : Request, @Param('channelId', ParseIntPipe) channelId : number,
		@Param('memberId', ParseIntPipe) userId : number, @Res() response : Response) {
			try {
				if (!request['user']?.id)
					throw new BadRequestException('Request must contain the owner id.');

				await this.channelsService.ban(channelId, userId, request['user'].id);
				return response.status(200).json({message : 'User has been banned from this channel'})
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
					members : true
				};
}

// When getting resources, select specific informations (check for getting channels)
// Check for the patch route (should we handle every channel info in one route ?)

// To do
// Ban => PATCH /channels/:channelId/members/:memberId/ban
// Mute => PATCH /channels/:channelId/members/:memberId/mute : need update
// Unmute => PATCH /channels/:channelId/members/:memberId/unmute : need update

// To check later
// Remove member in service : check if the owner can leave (atm he can't, if he will, then remove the channel ?)
// Group mute/unmute/kick/leave
// User information filtering in get routes (members or channels) => functions : getAllChannelMembers
// Create a formmating function that gets channels and users as members.
// Change username to userId in : PATCH /channels/:channelId/members/:username/edit
// Add edit route with the route that handles every member action. (query)
// Check validation of actio route (muter can't mute himself)