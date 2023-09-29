import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateChannelDto } from './dto/create-channel.dto';
import * as bcrypt from 'bcrypt';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Injectable()
export class ChannelsService extends PrismaClient {

	async createChannel(channelDto : CreateChannelDto) {
		const channel = await this.channel.findUnique({
			where : {
				name : channelDto.name,
			}
		})

		if (channel)
			throw new ConflictException();
		if (channelDto.privacy === 'protected')
			channelDto.password = await bcrypt.hash(channelDto.password, 10);

		console.log(channelDto.password);
		const newChannel = await this.channel.create({
			data : channelDto
		})

		console.log(newChannel);
		if (!newChannel)
			throw new InternalServerErrorException();
	}
}
