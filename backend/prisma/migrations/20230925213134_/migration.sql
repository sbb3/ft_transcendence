-- AlterTable
ALTER TABLE "request" ALTER COLUMN "time_exper" SET DEFAULT NOW() + interval '1 year';

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "max_score" DROP NOT NULL,
ALTER COLUMN "level" DROP NOT NULL,
ALTER COLUMN "otp_enavled" DROP NOT NULL,
ALTER COLUMN "otp_secrect_tocken" DROP NOT NULL,
ALTER COLUMN "is_profile_has_been_set" DROP NOT NULL,
ALTER COLUMN "campus" DROP NOT NULL,
ALTER COLUMN "achievement_id" DROP NOT NULL;
