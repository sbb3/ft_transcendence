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
import { UsernameQueryDto } from './dto/username-query-dto';
import { EditRoleDto } from './dto/edit-role.dto';
import { CreateMessageDto } from './dto/create-message.dto';

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

	@Patch(':id/update')
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

	@Delete(':id/delete')
	@UseGuards(JwtGuard)
	@ApiOperation({summary : 'Delete a specific channel from the db.'})
	@ApiParam({name : 'id'})
	async deleteChannel(@Param('id', ParseIntPipe) channelId : number, @Req() request : Request, @Res() response : Response) {
		try {
			if (!request['user']?.id)
				throw new BadRequestException("Request must contain the owner id");
			await this.channelsService.deleteChannel(channelId, request['user']?.id);
			// Also delete messages that are related to that channel
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

	@Patch(':channelId/members/:userId/mute')
	@UseGuards(JwtGuard)
	@ApiParam({name : 'channelId'})
	@ApiParam({name : 'userId'})
	@ApiOperation({summary : 'Mute a member.'})
	async muteMember(@Param('channelId', ParseIntPipe) channelId : number,
		@Param('userId', ParseIntPipe) userId : number,
		@Res() response : Response, @Req() request : Request) {
		try {
			if (!request['user'].id)
				throw new BadRequestException('Request must contain the owner id.');
			await this.channelsService.muteOrUnmute(true, channelId, userId, request['user'].id);
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
	@ApiOperation({summary : 'Unmute a member.'})
	async unmuteMember(@Param('channelId', ParseIntPipe) channelId : number,
		@Param('userId', ParseIntPipe) userId : number,
		@Res() response : Response, @Req() request : Request) {
		try {
			if (!request['user'].id)
				throw new BadRequestException('Request must contain the owner id.');
			await this.channelsService.muteOrUnmute(false, channelId, userId, request['user'].id);
			return response.status(200).json({message : 'Member has been unmuted.'});
		}
		catch (error) {
			if (error.status)
				return response.status(error.status).json(error);
			return response.status(500).json(error);
		}
	}

	@Patch(':channelId/members/:userId/kick')
	@UseGuards(JwtGuard)
	@ApiParam({name : 'channelId'})
	@ApiParam({name : 'userId'})
	@ApiOperation({summary : 'Kick a member.'})
	async kickMember(@Param('channelId', ParseIntPipe) channelId : number,
		@Param('userId', ParseIntPipe) userId : number,
		@Res() response : Response, @Req() request : Request) {
		try {
			if (!request['user'].id)
				throw new BadRequestException('Request must contain the owner id.');
			await this.channelsService.removeMember(channelId, userId, 'kick', request['user'].id);
			return response.status(200).json({message : 'Member has been kicked.'});
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
	@ApiOperation({summary : 'Leave a channel.'})
	async leave(@Param('channelId', ParseIntPipe) channelId : number,
		@Param('userId', ParseIntPipe) userId : number,
		@Res() response : Response, @Req() request : Request) {
		try {
			if (!request['user'].id)
				throw new BadRequestException('Request must contain the owner id.');
			await this.channelsService.removeMember(channelId, userId, 'leave', request['user'].id);
			return response.status(200).json({message : 'Member has left the channel.'});
		}
		catch (error) {
			if (error.status)
				return response.status(error.status).json(error);
			return response.status(500).json(error);
		}
	}

	@Patch(':channelId/members/edit')
	@UseGuards(JwtGuard)
	@ApiOperation({summary : 'Edit the role of a member.'})
	@ApiParam({name : 'channelId'})
	@ApiBody({type : EditRoleDto})
	async editRoleOfMembers(@Res() response : Response, @Param('channelId', ParseIntPipe) channelId : number,
		@Req() request : Request, @Body() roleDto : EditRoleDto) {
			try {
				if (!request['user']?.id)
					throw new BadRequestException('Request must contain the owner id.');

				return response.status(200).json({message : await this.channelsService.editMemberRole(channelId, request['user'].id, roleDto)})
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
	@ApiOperation({summary : 'Ban a player from a channel.'})
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

	@Patch(':channelId/members/:memberId/unban')
	@UseGuards(JwtGuard)
	@ApiParam({name : 'channelId'})
	@ApiParam({name : 'memberId'})
	@ApiOperation({summary : 'Ban a player from a channel.'})
	async unbanMember(@Req() request : Request, @Param('channelId', ParseIntPipe) channelId : number,
		@Param('memberId', ParseIntPipe) userId : number, @Res() response : Response) {
			try {
				if (!request['user']?.id)
					throw new BadRequestException('Request must contain the owner id.');

				await this.channelsService.unban(channelId, userId, request['user'].id);
				return response.status(200).json({message : 'User has been unbanned from this channel'})
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

	@Post('message')
	@UseGuards(JwtGuard)
	async createMessage(@Body() createMessageDto : CreateMessageDto, @Res() response : Response, @Req() req : Request) {
		try {
			if (!req['user']?.id)
				throw new BadRequestException('Request must contain the owner id.');
			await this.channelsService.createChannelMessage(createMessageDto, req['user'].id);
			return response.status(201).json({message : 'Message created successfully.'})
		}
		catch (error) {
			if (error.status)
				return response.status(error.status).json(error);
			return response.status(500).json(error);

		}
	}

	@Get(':channelId/messages')
	@ApiParam({name : 'channelId'})
	@UseGuards(JwtGuard)
	async getAllChannelMessages(@Param('channelId', ParseIntPipe) channelId : number, @Res() response : Response) {
		try {
			const allMessages = await this.channelsService.getAllChannelMessages(channelId);

			return response.status(200).json(allMessages);
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

// Confirm message validation with front.