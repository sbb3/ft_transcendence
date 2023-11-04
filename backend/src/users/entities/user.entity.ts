import { Prisma, PrismaClient } from '@prisma/client';

// export class User {}

const prisma = new PrismaClient();

async function createUser(data: Prisma.userCreateInput) {
  const user = await prisma.user.create({
    data,
  });
  return user;
}

export class User implements Prisma.userCreateInput {
  id?: number;
  createdAt?: Date;
  level?: string;
  email: string;
  username: string;
  name: string;
  avatar: string;
  campus: string;
  status: string;
  WonGames: number;
  LostGames: number;
  is_profile_completed?: boolean;
  is_otp_enabled?: boolean;
  is_otp_validated?: boolean;
  otp_secret?: string;
  friends: number[];
  blocked: number[];

  constructor(data: User) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.level = data.level;
    this.email = data.email;
    this.username = data.username;
    this.name = data.name;
    this.avatar = data.avatar;
    this.campus = data.campus;
    this.status = data.status;
    this.WonGames = data.WonGames;
    this.LostGames = data.LostGames;
    this.is_profile_completed = data.is_profile_completed;
    this.is_otp_enabled = data.is_otp_enabled;
    this.is_otp_validated = data.is_otp_validated;
    this.otp_secret = data.otp_secret;
    this.friends = data.friends;
    this.blocked = data.blocked;
  }
}
