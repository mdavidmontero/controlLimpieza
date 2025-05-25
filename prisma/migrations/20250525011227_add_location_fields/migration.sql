-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "afternoonInLocation" JSONB,
ADD COLUMN     "afternoonOutLocation" JSONB,
ADD COLUMN     "morningInLocation" JSONB,
ADD COLUMN     "morningOutLocation" JSONB;
