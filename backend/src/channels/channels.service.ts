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

	async getAvailableChannels(selectOptions : any) {
		const allChannels = await this.channel.findMany({
			where : {
			privacy : {
				in : ["public", "protected"]
			},
			},
			select : selectOptions
		})

		return allChannels;
	}

	async joinChannel(channelId : number, userId : number, members : any, role : string) {
		if (role != 'owner' && members && members.find((member: { user: { id: number; }; }) => member?.user?.id == userId))
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

		if (Object.keys(channelDto).length === 0)
			throw new BadRequestException('No data found in body.');
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

	async muteOrUnmute(isMuted : boolean, channelId : number, userId : number, muterId : number) {
		const toMute = await this.channelMember.findMany({
			where : {
				channelId : channelId,
				user : {
					id : userId,
				}
			}
		});

		if (toMute.length == 0)
			throw new NotFoundException('User to mute not found.');
		if (!await this.canControl(muterId, toMute[0].role, channelId))
			throw new UnauthorizedException('No priviliges to mute/unmute this member.')

		const updatedMember = await this.channelMember.updateMany({
			where : {
				channelId : channelId,
				user : {
					id : userId
				}
			},
			data : {
				isMuted : isMuted
			}
		});

		if (updatedMember.count == 0)
			throw new InternalServerErrorException();
	}

	async editMemberRole(channelId : number, username : string, editorId : number, role : string) {
		const toEdit = await this.channelMember.findMany({
				where : {
					channelId : channelId,
					user : {
						username : username
					}
				}
			});

		const editor = await this.channelMember.findMany({
			where :{
				channelId : channelId,
				user : {
					id : editorId,
				}
			}
		})	

		if (toEdit[0].role == 'owner')
			throw new ConflictException('Owner can\'t edit his role.');
		if (toEdit.length == 0)
			throw new NotFoundException('User to edit not found.');
		if (!editor)
			throw new NotFoundException('Editor not found.');

		const updatedMember = await this.channelMember.updateMany({
			where : {
				channelId : channelId,
				user : {
					username : username
				}
			},
			data : {
				role : role
			}
		});

		if (updatedMember.count == 0)
			throw new InternalServerErrorException();
	}

	async removeMember(channelId : number, userId : number, action : string, kickerId : number) {
		const memberToLeave = await this.channelMember.findMany({
			where : {
				channelId : channelId,
				user : {
					id : userId
				}
			}
		});

		if (memberToLeave.length == 0)
			throw new NotFoundException('Member to leave/kick or channel not found.');
		if (memberToLeave[0].role == 'owner')
			throw new ConflictException('The owner can\'t leave or be kicked from this channel.');

		if (action == 'kick' && !this.canControl(kickerId, memberToLeave[0].role, channelId))
			throw new UnauthorizedException('No privileges to kick this user.');

		const left = await this.channelMember.deleteMany({
			where : {
				channelId : channelId,
				user : {
					id : userId
				}
			}
		});

		if (left.count == 0)
			throw new InternalServerErrorException();
	}

	async validateAndJoinChannel(channelId : number, username : string) {
		const channel = await this.channel.findUnique({
			where : {
				id : channelId
			},
			select : {
				privacy : true,
				members : {
					select : {
						user : true
					}
				}
			}
		});
		const user = await this.user.findUnique({
			where : {
				username : username
			}
		});

		if (!channel)
			throw new NotFoundException('Channel not found.');
		if (channel.privacy == 'protected')
			throw new BadRequestException('This channel requires a password.');
		if (!user)
			throw new NotFoundException('User not found.');
		if (channel.members.find(member => member.user.username == username))
			throw new ConflictException('User is already a member of this channel.');

		await this.joinChannel(channelId, user.id, null, 'member');
	}

	formatMembers(members : any) {
		return members.map((member) => {
			const {avatar, name, username} = member.user;
			const {role, isMuted} = member;

			return ({avatar, name, username, role, isMuted});
		})
	}

	private async canControl(senderId : number, toControlRole : string, channelId : number) {
		const sender = await this.channelMember.findMany({
			where : {
				channelId : channelId,
				user : {
					id : senderId,
				}
			}
		});

		if (!sender)
			throw new NotFoundException('User to kick a member not found.');
		return ((sender[0].role == 'owner' && toControlRole != 'owner') || (sender[0].role == 'admin' && toControlRole == 'member'));
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
