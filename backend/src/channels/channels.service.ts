import { BadRequestException, ConflictException, Injectable,
		InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { channel, PrismaClient } from '@prisma/client';
import { CreateChannelDto } from './dto/create-channel.dto';
import * as bcrypt from 'bcrypt';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { CheckPasswordDto } from './dto/check-password.dto';

@Injectable()
export class ChannelsService extends PrismaClient {

	constructor() {
		super();
	}

	async findUniqueChannel(data : any, selectOptions : any) {
		const channel = selectOptions ?
			await this.channel.findUnique({
				where : data,
				select : selectOptions
			}) : await this.channel.findUnique({
			where : data
		});

		if (!channel)
			throw new NotFoundException("Channel not found");
		return channel;
	}

	async getAllChannelMembers(channelId : number) {
		const allmembers = await this.channel.findUnique({
			where : {
				id : channelId
			},
			select : {
				members : {
					select : {
						user : {
							select : {
								name : true,
								avatar : true, 
								username : true
							}
						},
						role : true,
						isMuted : true
					}
				}
			}
		});

		if (!allmembers)
			throw new NotFoundException("Channel not found.");
		return allmembers;
	}

	async getAvailableChannels() {
		const allChannels = await this.channel.findMany({
			where : {
			privacy : {
				in : ["public", "protected"]
			},
			},
			select : {
				name : true,
				description : true,
				privacy : true, 
				members : {
					select : {
						user : true,
						isMuted : true,
						role : true
					}
				},
			}
		})

		return allChannels;
	}

	async joinChannel(channelId : number, userId : number, members : any, role : string) {
		if (role != 'owner' && members.find((member: { user: { id: number; }; }) => member?.user?.id == userId))
			throw new ConflictException("Already a member of this channel.")

		const newMember = await this.channelMember.create({
			data : {
				user : {
					connect : {
						id : userId
					}
				},
				role : role
			}
		});

		if (!newMember)
			throw new InternalServerErrorException();

		const updatedChannel = await this.updateUniqueChannel({ id : channelId }, {
			members : {
				connect : {
					id : newMember.id
				}
			}
		});

		if (!updatedChannel)
			throw new InternalServerErrorException();
	}

	async validateChannelPassword(channelId : number, passwordDto : CheckPasswordDto) {
		const channel : any = await this.findUniqueChannel({id : channelId}, { password : true,
			privacy : true,
			members : {
				select : {
					user : true
				}
			}
		});
		const user = await this.user.findUnique({where : { id : passwordDto.userId }});

		if (!user)
			throw new NotFoundException("User not found.")
		if (channel.privacy == 'public' || channel.privacy == 'private')
			throw new ConflictException('This channel does not require any password.');
		if (!await bcrypt.compare(passwordDto.password, channel.password))
			throw new UnauthorizedException('Invalid password.');

		await this.joinChannel(channelId, user.id, channel.members, "member");
	}

	async createChannel(channelDto : CreateChannelDto, userId : number) {
		await this.checkIfChannelExists(channelDto.name);
		channelDto.ownerId = userId;

		if (channelDto.privacy === 'protected')
			channelDto.password = await bcrypt.hash(channelDto.password, 10);

		const newChannel = await this.channel.create({
			data : channelDto
		});

		await this.joinChannel(newChannel.id, userId, null, "owner");
		if (!newChannel)
			throw new InternalServerErrorException();
	}

	async updateChannel(channelDto : UpdateChannelDto, userId : number, channelId : number) {
		const oldChannel = await this.channel.findUnique({ where : {
			id : channelId
		}});

		console.log("nice")
		if (!oldChannel)
			throw new NotFoundException('Channel to update not found.');
		if (!this.isOwner(oldChannel, userId))
			throw new UnauthorizedException('Only the owner and admins can update channel\'s properties')
		if (channelDto.name)
			await this.checkIfChannelExists(channelDto.name);

		await this.checkNewPassword(channelDto);

		const updatedChannel = await this.channel.update({
			where : {id : channelId},
			data : channelDto,
		});

		if (!updatedChannel)
			throw new InternalServerErrorException();
	}

	async deleteChannel(channelId : number, userId : number) {
		const channelToDelete = await this.channel.findUnique({ where : {id : channelId} });

		if (!channelToDelete)
			throw new NotFoundException("Channel to delete not found.")
		if (!this.isOwner(channelToDelete, userId))
			throw new UnauthorizedException("Only the owner can delete this channel.")
		if (!await this.channel.delete({where : { id : channelId }}))
			throw new InternalServerErrorException();
	}

	private isOwner(channel : channel, userId : number) {
		return channel.ownerId === userId;
	}

	private isAdmin(channel : channel, userId : number) {
		// Check if the user that wants to change smthg on the channel is an admin
		return true;
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

	private async updateUniqueChannel(where : any, data : any) {
		const channel = this.channel.update({
			where : where,
			data : data
		});

		return channel;
	}
}
