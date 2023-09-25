/*
  Warnings:

  - You are about to drop the column `otp_enavled` on the `user` table. All the data in the column will be lost.
  - Made the column `is_profile_has_been_set` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "request" ALTER COLUMN "time_exper" SET DEFAULT NOW() + interval '1 year';

-- AlterTable
ALTER TABLE "user" DROP COLUMN "otp_enavled",
ADD COLUMN     "is_otp_enabled" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "is_profile_has_been_set" SET NOT NULL;
