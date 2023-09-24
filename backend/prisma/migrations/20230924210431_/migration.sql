/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "player_name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "max_score" INTEGER NOT NULL,
    "level" TEXT NOT NULL,
    "otp_enavled" BOOLEAN NOT NULL DEFAULT false,
    "otp_secrect_tocken" TEXT NOT NULL,
    "is_profile_has_been_set" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "campus" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "achievement_id" INTEGER NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievement" (
    "id" SERIAL NOT NULL,
    "level_for_get_it" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "achevement_image" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friend_user" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "is_mute" BOOLEAN NOT NULL DEFAULT false,
    "unfriend" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "friend_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blocked_user" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "unblock" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "blocked_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "is_req_fr_acc" BOOLEAN NOT NULL DEFAULT false,
    "user_snd" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_seen" BOOLEAN NOT NULL DEFAULT false,
    "is_delete" BOOLEAN NOT NULL DEFAULT false,
    "achievement_get" INTEGER NOT NULL,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "is_req_fr_acc" BOOLEAN NOT NULL DEFAULT false,
    "user_snd" INTEGER NOT NULL,
    "id_game" INTEGER NOT NULL,
    "time_exper" TIMESTAMP(3) NOT NULL DEFAULT NOW() + interval '1 year',
    "is_exper" BOOLEAN NOT NULL DEFAULT false,
    "is_seen" BOOLEAN NOT NULL DEFAULT false,
    "is_delete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game" (
    "id" SERIAL NOT NULL,
    "player_one_id" INTEGER NOT NULL,
    "player_two_id" INTEGER NOT NULL,
    "id_winer" INTEGER NOT NULL,
    "theme" TEXT NOT NULL,
    "player_one_score" INTEGER NOT NULL,
    "player_two_score" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_private" BOOLEAN NOT NULL,
    "password" TEXT NOT NULL,
    "channel_owner" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "channel_id" INTEGER NOT NULL,
    "reseve_id" INTEGER NOT NULL,
    "cont" TEXT NOT NULL,

    CONSTRAINT "message_pkey" PRIMARY KEY ("user_id","channel_id","reseve_id")
);

-- CreateTable
CREATE TABLE "membership" (
    "user_id" INTEGER NOT NULL,
    "channel_id" INTEGER NOT NULL,
    "is_admine" BOOLEAN NOT NULL DEFAULT false,
    "is_muted" BOOLEAN NOT NULL DEFAULT false,
    "is_banned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "membership_pkey" PRIMARY KEY ("user_id","channel_id")
);

-- CreateTable
CREATE TABLE "_achievementTouser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_player_name_key" ON "user"("player_name");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_login_key" ON "user"("login");

-- CreateIndex
CREATE UNIQUE INDEX "channel_name_key" ON "channel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_achievementTouser_AB_unique" ON "_achievementTouser"("A", "B");

-- CreateIndex
CREATE INDEX "_achievementTouser_B_index" ON "_achievementTouser"("B");

-- AddForeignKey
ALTER TABLE "friend_user" ADD CONSTRAINT "friend_user_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocked_user" ADD CONSTRAINT "blocked_user_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_snd_fkey" FOREIGN KEY ("user_snd") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_achievement_get_fkey" FOREIGN KEY ("achievement_get") REFERENCES "achievement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request" ADD CONSTRAINT "request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request" ADD CONSTRAINT "request_user_snd_fkey" FOREIGN KEY ("user_snd") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request" ADD CONSTRAINT "request_id_game_fkey" FOREIGN KEY ("id_game") REFERENCES "game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game" ADD CONSTRAINT "game_player_one_id_fkey" FOREIGN KEY ("player_one_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game" ADD CONSTRAINT "game_player_two_id_fkey" FOREIGN KEY ("player_two_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_reseve_id_fkey" FOREIGN KEY ("reseve_id") REFERENCES "friend_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membership" ADD CONSTRAINT "membership_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membership" ADD CONSTRAINT "membership_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_achievementTouser" ADD CONSTRAINT "_achievementTouser_A_fkey" FOREIGN KEY ("A") REFERENCES "achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_achievementTouser" ADD CONSTRAINT "_achievementTouser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
