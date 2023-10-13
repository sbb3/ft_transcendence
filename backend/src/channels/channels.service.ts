import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateChannelDto } from './dto/create-channel.dto';
import * as bcrypt from 'bcrypt';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { CheckPasswordDto } from './dto/check-password.dto';
import { EditRoleDto } from './dto/edit-role.dto';
import { v4 as uuidv4 } from 'uuid';
import { CreateChannelMessageDto } from './dto/create-channel-message.dto';
import { ChatGateway } from 'src/chat/chat.gateway';

@Injectable()
export class ChannelsService extends PrismaClient {
  constructor(private webSocketGateway: ChatGateway) {
    super();
  }

  async createChannel(channelDto: CreateChannelDto, creatorId: number) {
    await this.checkIfChannelExists(channelDto.name);

    channelDto.ownerId = creatorId;
    if (channelDto.privacy === 'protected')
      channelDto.password = await bcrypt.hash(channelDto.password, 10);

    const newChannel = await this.channel.create({
      data: channelDto,
    });

    await this.joinChannel(newChannel.id, creatorId, null, false, [], 'owner');
  }

  async validateChannelPassword(
    channelId: number,
    passwordDto: CheckPasswordDto,
  ) {
    const channel: any = await this.findUniqueChannel(
      { id: channelId },
      { password: true, privacy: true, members: true, banned: true },
    );
    const user = await this.user.findUnique({
      where: { id: passwordDto.userId },
    });

    if (!user)
      throw new NotFoundException('User to join the channel not found.');
    if (channel.privacy == 'public' || channel.privacy == 'private')
      throw new ConflictException(
        'This channel does not require any password.',
      );
    if (!(await bcrypt.compare(passwordDto.password, channel.password)))
      throw new UnauthorizedException('Invalid password.');

    await this.joinChannel(
      channelId,
      user.id,
      channel.members,
      true,
      channel.banned,
      'member',
    );
  }

  async updateChannel(
    channelDto: UpdateChannelDto,
    userId: number,
    channelId: number,
  ) {
    const oldChannel = await this.channel.findUnique({
      where: {
        id: channelId,
      },
    });

    if (Object.keys(channelDto).length === 0)
      throw new BadRequestException('No data found in body.');
    if (!oldChannel)
      throw new NotFoundException('Channel to update not found.');
    if (userId != oldChannel.ownerId)
      throw new UnauthorizedException(
        "Only the owner can update the channel's general infos.",
      );
    if (channelDto.name) await this.checkIfChannelExists(channelDto.name);

    await this.checkNewPassword(channelDto);

    const updatedChannel = await this.channel.update({
      where: { id: channelId },
      data: channelDto,
    });

    if (!updatedChannel) throw new InternalServerErrorException();
  }

  async findUniqueChannel(data: any, selectOptions: any) {
    const channel = selectOptions
      ? await this.channel.findUnique({
          where: data,
          select: selectOptions,
        })
      : await this.channel.findUnique({
          where: data,
        });

    if (!channel) throw new NotFoundException('Channel not found');
    return channel;
  }

  async getAllChannelMembers(channelId: number) {
    const allMembersIds = await this.channelMember.findMany({
      where: {
        channelId: channelId,
      },
      select: {
        role: true,
        isMuted: true,
        userId: true,
      },
    });

    if (allMembersIds.length == 0)
      throw new NotFoundException('Channel not found.');
    const membersAsUsers = await this.user.findMany({
      where: {
        id: {
          in: allMembersIds.map((member) => member.userId),
        },
      },
      select: {
        id: true,
        avatar: true,
        name: true,
        createdAt: true,
        email: true,
        username: true,
      },
    });

    return membersAsUsers.map((member) => {
      const { role, isMuted } = {
        ...allMembersIds.find((memberId) => memberId.userId == member.id),
      };

      return { ...member, role, isMuted };
    });
  }

  async getChannelWithMembers(
    channelName: string,
    selectOptions: any,
    channelId: number,
  ) {
    const channel: any = channelName
      ? await this.findUniqueChannel({ name: channelName }, selectOptions)
      : await this.findUniqueChannel({ id: channelId }, selectOptions);

    const members = await this.user.findMany({
      where: {
        id: {
          in: channel.members.map(
            (member: { userId: number }) => member.userId,
          ),
        },
      },
      select: {
        id: true,
        avatar: true,
        name: true,
        createdAt: true,
        email: true,
        username: true,
      },
    });

    channel.members = members.map((user) => {
      const member = channel.members.find(
        (member: { userId: number }) => member.userId == user.id,
      );
      const { isMuted, role } = member;

      return { ...user, isMuted, role };
    });
    return [channel];
  }

  async getAvailableChannels(selectOptions: any) {
    const allChannels = await this.channel.findMany({
      where: {
        privacy: {
          in: ['public', 'protected'],
        },
      },
      select: selectOptions,
    });

    const formattedChannels = await Promise.all(
      allChannels.map(async (channel: any) => {
        const usersAsMembers = await this.user.findMany({
          where: {
            id: {
              in: channel.members.map((member) => member.userId),
            },
          },
          select: {
            id: true,
            avatar: true,
            name: true,
            createdAt: true,
            email: true,
            username: true,
          },
        });

        const formattedUsers = usersAsMembers.map((user) => {
          const member = channel.members.find(
            (member) => member.userId == user.id,
          );
          const { isMuted, role } = member;

          return { ...user, isMuted, role };
        });

        channel.members = formattedUsers;
        return channel;
      }),
    );

    return formattedChannels;
  }

  async joinChannel(
    channelId: number,
    userId: number,
    members: any,
    shouldCheck: boolean,
    banned: number[],
    role: string,
  ) {
    if (banned.find((bannedUserId) => bannedUserId == userId))
      throw new Error('Banned from this channel.');
    if (
      shouldCheck &&
      members?.find(
        (member) => member.userId == userId && channelId == channelId,
      )
    )
      throw new Error('Already a member of this channel.');

    const newMember = await this.channelMember.create({
      data: {
        userId: userId,
        role: role,
      },
    });

    if (!newMember) throw new InternalServerErrorException();
    const updatedChannel = await this.channel.update({
      where: {
        id: channelId,
      },
      data: {
        members: {
          connect: {
            id: newMember.id,
          },
        },
      },
    });
    return "New member with role '" + role + "' has been created.";
    // if (!updatedChannel) throw new InternalServerErrorException();
  }

  async deleteChannel(channelId: number, userId: number) {
    const channelToDelete = await this.channel.findUnique({
      where: { id: channelId },
    });

    if (!channelToDelete)
      throw new NotFoundException('Channel to delete not found.');
    if (userId != channelToDelete.ownerId)
      throw new UnauthorizedException('Only the owner can delete his channel.');
    if (!(await this.channel.delete({ where: { id: channelId } })))
      throw new InternalServerErrorException();
    await this.channelMessage.deleteMany({
      where: {
        channelId: channelId,
      },
    });
  }

  async ban(channelId: number, memberToBanId: number, editorId: number) {
    const channel: any = await this.findUniqueChannel(
      { id: channelId },
      { members: true, banned: true },
    );
    const toBan = channel.members.find(
      (member) => member.userId === memberToBanId,
    );
    const editor = channel.members.find((member) => member.userId === editorId);

    if (channel.banned.find((banned) => banned == memberToBanId))
      throw new ConflictException('This user is already banned.');
    if (!toBan || !editor)
      throw new NotFoundException(
        !toBan
          ? 'Member to ban not found.'
          : 'Member that wants to ban not found.',
      );
    if (toBan.userId === editor.userId)
      throw new UnauthorizedException(
        "Member that wants to ban can't ban himself.",
      );
    if (!this.canControl(editor.role, toBan.role))
      throw new UnauthorizedException('No privileges to ban this member.');
    const banned = [...channel.banned, memberToBanId];

    await this.channelMember.deleteMany({
      where: {
        channelId: channelId,
        userId: memberToBanId,
      },
    });
    await this.channel.update({
      where: {
        id: channelId,
      },
      data: {
        banned: banned,
      },
    });
  }

  async unban(channelId: number, memberToUnbanId: number, editorId: number) {
    const channel: any = await this.findUniqueChannel(
      { id: channelId },
      { members: true, banned: true },
    );
    const editor = channel.members.find((member) => member.userId === editorId);
    const bannedMember = channel.banned.find(
      (bannedId) => bannedId === memberToUnbanId,
    );

    if (!bannedMember || !editor)
      throw new NotFoundException(
        !editor
          ? 'Member that wants to unban not found.'
          : 'User to unban not found in the banned list.',
      );
    if (editor.role == 'member')
      throw new UnauthorizedException(
        'Only the owner and admins can unban users.',
      );
    let updatedArrayOfBannedUsers = channel.banned.filter(
      (banned) => banned != memberToUnbanId,
    );

    await this.channel.update({
      where: {
        id: channelId,
      },
      data: {
        banned: updatedArrayOfBannedUsers,
      },
    });
  }

  async muteOrUnmute(
    isMuted: boolean,
    channelId: number,
    memberToMuteId: number,
    muterId: number,
  ) {
    const channel: any = await this.findUniqueChannel(
      { id: channelId },
      { members: true },
    );
    const toMute = channel?.members?.find(
      (member) => member.userId == memberToMuteId,
    );
    const muter = channel?.members?.find((member) => member.userId == muterId);

    if (!toMute || !muter)
      throw new NotFoundException(
        !toMute ? 'Member to mute not found.' : 'Muter not found.',
      );
    if (toMute.id == muter.id)
      throw new ConflictException("Muter can't mute/unmute himself.");
    if (!this.canControl(muter.role, toMute.role))
      throw new UnauthorizedException('No privileges to mute this member.');
    await this.channelMember.updateMany({
      where: {
        channelId: channelId,
        userId: memberToMuteId,
      },
      data: {
        isMuted: isMuted,
      },
    });
  }

  async getAllJoinedChannels(memberId: number, selectOptions: any) {
    const member = await this.channelMember.findMany({
      where: {
        userId: memberId,
      },
    });

    let allChannels = await this.channel.findMany({
      where: {
        id: {
          in: member.map((member) => member.channelId),
        },
      },
      select: selectOptions,
    });

    const allUsers = await this.user.findMany({
      where: {
        id: {
          in: Array.from(
            new Set(
              [].concat(
                ...allChannels.map((channel) => {
                  return channel.members.map((member) => member.userId);
                }),
              ),
            ),
          ),
        },
      },
    });

    allChannels = allChannels.map((channel) => {
      const members = channel.members.map((member) => {
        const newMember = member;
        const userAsMember = allUsers.find((user) => user.id == member.userId);

        newMember.id = member.userId;
        // delete newMember.userId;
        return {
          ...newMember,
          avatar: userAsMember.avatar,
          name: userAsMember.name,
        };
      });
      channel.members = members;
      return channel;
    });
    return allChannels;
  }

  async editMemberRole(
    channelId: number,
    editorId: number,
    editDto: EditRoleDto,
  ) {
    const channel: any = await this.findUniqueChannel(
      { id: channelId },
      { members: true, banned: true },
    );
    const editor = channel?.members?.find(
      (member) => member.userId == editorId,
    );
    const userToEdit = await this.user.findUnique({
      where: { username: editDto.username },
    });

    if (!userToEdit || !editor)
      throw new NotFoundException(
        !userToEdit ? 'User not found.' : 'Editor not found.',
      );
    const memberToEdit = channel?.members?.find(
      (member) => member.userId == userToEdit.id,
    );

    if (memberToEdit && memberToEdit.id == editor.id)
      throw new ConflictException("Editor can't edit himself.");
    if (memberToEdit && this.canControl(editor.role, memberToEdit.role)) {
      await this.channelMember.updateMany({
        where: {
          channelId: channelId,
          userId: memberToEdit.userId,
        },
        data: {
          role: editDto.role,
        },
      });
      return 'Role of member has been edited.';
    }

    return this.joinChannel(
      channelId,
      userToEdit.id,
      [],
      false,
      channel.banned,
      editDto.role,
    ).catch((err) => {
      throw new InternalServerErrorException(err);
    });

    // return "New member with role '" + editDto.role + "' has been created.";
  }

  async removeMember(
    channelId: number,
    userToLeaveId: number,
    action: string,
    kickerId: number,
  ) {
    const channel: any = await this.findUniqueChannel(
      { id: channelId },
      { members: true },
    );
    const memberToLeave = channel?.members?.find(
      (member) => member.userId == userToLeaveId,
    );
    const kicker =
      action == 'kick'
        ? channel?.members?.find((member) => member.userId == kickerId)
        : null;

    if (!memberToLeave)
      throw new NotFoundException(
        action == 'kick'
          ? 'Member to kick not found.'
          : 'Member to leave not found.',
      );
    if (memberToLeave.role == 'owner')
      throw new UnauthorizedException(
        "The owner can't leave or be kicked from this channel.",
      );
    if (action == 'kick') {
      if (!kicker) throw new NotFoundException('Kicker not found.');
      else if (!this.canControl(kicker.role, memberToLeave.role))
        throw new UnauthorizedException('No provileges to kick this member.');
      else if (kicker.userId == memberToLeave.userId)
        throw new ConflictException("The kicker can't kick himself.");
    }
    await this.channelMember.deleteMany({
      where: {
        channelId: channelId,
        userId: userToLeaveId,
      },
    });
  }

  async validateAndJoinChannel(channelId: number, username: string) {
    const channel = await this.channel.findUnique({
      where: {
        id: channelId,
      },
      select: {
        privacy: true,
        members: true,
        banned: true,
      },
    });
    const user = await this.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!channel) throw new NotFoundException('Channel not found.');
    if (channel.privacy == 'protected')
      throw new BadRequestException('This channel requires a password.');
    if (!user) throw new NotFoundException('User not found.');

    await this.joinChannel(
      channelId,
      user.id,
      channel.members,
      true,
      channel.banned,
      'member',
    );
  }

  async createChannelMessage(
    createMessageDto: CreateChannelMessageDto,
    senderIdFromJwt: number,
  ) {
    const channel: any = await this.findUniqueChannel(
      { id: createMessageDto.channelId },
      { members: true, banned: true, name: true },
    );
    const sender = channel.members.find(
      (member) => member.userId == createMessageDto.senderId,
    );
    const isBanned = channel.banned.find(
      (banned) => banned == createMessageDto.senderId,
    );

    if (senderIdFromJwt != createMessageDto.senderId)
      throw new UnauthorizedException(
        'Sender id is different from the id provided.',
      );
    if (!sender) throw new NotFoundException('Member not found in channel.');
    if (isBanned) throw new ConflictException('Banned from this channel.');
    const member = await this.channelMember.findMany({
      where: {
        userId: senderIdFromJwt,
        channelId: channel.id,
      },
    });

    if (member.length == 0)
      throw new NotFoundException('Member not found in channel.');
    if (member[0].isMuted) return 'Muted from this channel.';

    createMessageDto.receivers = channel.members
      .filter((member) => member.userId != sender.userId)
      .map((member) => member.userId);
    const createdMessage = await this.channelMessage.create({
      data: createMessageDto,
    });
    const { id, name, username, email, avatar, campus, status } =
      await this.user.findUnique({
        where: {
          id: sender.userId,
        },
      });
    const lastMessageCreatedAt = createdMessage.createdAt;

    createdMessage['lastMessageCreatedAt'] = lastMessageCreatedAt;
    createdMessage['channelName'] = channel.name;
    delete createdMessage.createdAt;
    const messageToEmit = {
      sender: { id, name, username, avatar, campus, status, email },
      ...createdMessage,
    };

    this.webSocketGateway.sendChannelMessage(messageToEmit);
    if (!createdMessage)
      throw new InternalServerErrorException('Could not create message.');

    return 'Message created successfully.';
  }

  async getAllChannelMessages(channelName: string) {
    const channel: any = await this.findUniqueChannel(
      { name: channelName },
      null,
    );

    if (!channel) throw new NotFoundException('Channel not found.');

    const allChannelMessages = await this.channelMessage.findMany({
      where: {
        channelId: channel.id,
      },
    });

    const allUsers = await this.user.findMany({
      where: {
        id: {
          in: Array.from(
            new Set(
              allChannelMessages.map(
                (channelMessage) => channelMessage.senderId,
              ),
            ),
          ),
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        campus: true,
        status: true,
      },
    });

    const formattedMessages = allChannelMessages.map((message) => {
      const user = allUsers.find((user) => user.id == message.senderId);
      const createdAt = message.createdAt;

      delete message.createdAt;
      return {
        sender: user,
        ...message,
        lastMessageCreatedAt: createdAt,
        channelName: channel.name,
      };
    });

    return formattedMessages;
  }

  private async checkNewPassword(channelDto: UpdateChannelDto) {
    let privacy = channelDto.privacy;

    if (!privacy) return;
    if (privacy != 'protected') channelDto.password = null;
    else if (
      privacy == 'protected' &&
      (!channelDto.hasOwnProperty('password') || channelDto.password.length < 4)
    )
      throw new BadRequestException(
        !channelDto.hasOwnProperty('password')
          ? 'Protected channels must have a password.'
          : 'Channel password must have at least 4 characters.',
      );
    else if (privacy == 'protected')
      channelDto.password = await bcrypt.hash(channelDto.password, 10);
  }

  private async checkIfChannelExists(name: string) {
    const channel = await this.channel.findUnique({
      where: {
        name: name,
      },
    });

    if (channel)
      throw new ConflictException(
        "Channel name '" + name + "' is already taken",
      );
  }

  private canControl(roleOfEditor: string, roleOfUserToEdit: string) {
    return (
      roleOfEditor == 'owner' ||
      (roleOfEditor == 'admin' && roleOfUserToEdit == 'member')
    );
  }
}
