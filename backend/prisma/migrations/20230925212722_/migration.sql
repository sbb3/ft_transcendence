/*
  Warnings:

  - You are about to drop the column `login` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `player_name` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "user_login_key";

-- DropIndex
DROP INDEX "user_player_name_key";

-- AlterTable
ALTER TABLE "request" ALTER COLUMN "time_exper" SET DEFAULT NOW() + interval '1 year';

-- AlterTable
ALTER TABLE "user" DROP COLUMN "login",
DROP COLUMN "player_name",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");
