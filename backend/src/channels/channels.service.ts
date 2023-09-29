import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateChannelDto } from './dto/create-channel.dto';
import * as bcrypt from 'bcrypt';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Injectable()
export class ChannelsService extends PrismaClient {

	async createChannel(channelDto : CreateChannelDto) {

		this.checkIfChannelExists(channelDto.name);

		if (channelDto.privacy === 'protected')
			channelDto.password = await bcrypt.hash(channelDto.password, 10);

		const newChannel = await this.channel.create({
			data : channelDto
		})

		if (!newChannel)
			throw new InternalServerErrorException();
	}

	async updateChannel(channelDto : UpdateChannelDto) {
		const channelId = channelDto.channelId;
		const oldChannel = await this.channel.findUnique({ where : {
			id : channelId
		}});

		if (!oldChannel)
			throw new NotFoundException("Channel to update not found");
		if (channelDto.name)
			await this.checkIfChannelExists(channelDto.name);

		await this.checkNewPassword(channelDto);
		delete channelDto.channelId;

		const updatedChannel = await this.channel.update({
			where : {id : channelId},
			data : channelDto,
		});

		if (!updatedChannel)
			throw new InternalServerErrorException();
	}

	private async checkNewPassword(channelDto : UpdateChannelDto) {
		let privacy = channelDto.privacy;

		if (!privacy)
			return ;
		if (privacy != 'protected')
			channelDto.password = null;
		else if (privacy == 'protected' && (!channelDto.hasOwnProperty('password') || channelDto.password.length < 4))
			throw new BadRequestException(!channelDto.hasOwnProperty('password') ? "Protected channels must have a password" : "Channel password must have at least 4 characters" );
		else if (privacy == 'protected')
			channelDto.password = await bcrypt.hash(channelDto.password, 10);
	}

	private async checkIfChannelExists(name : string) {
		const channel = await this.channel.findUnique({
			where : {
				name : name,
			}
		});

		if (channel)
			throw new ConflictException("Channel name \'" + name + "\' is already taken");
	}
}
