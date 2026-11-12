-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN "assignee_id" TEXT;
ALTER TABLE "tasks" ADD COLUMN "priority_enum" "TaskPriority" NOT NULL DEFAULT 'MEDIUM';

-- Migrate legacy integer priority when present (1=LOW .. 4=URGENT)
UPDATE "tasks" SET "priority_enum" = CASE
  WHEN "priority" IS NULL THEN 'MEDIUM'::"TaskPriority"
  WHEN "priority" <= 1 THEN 'LOW'::"TaskPriority"
  WHEN "priority" = 2 THEN 'MEDIUM'::"TaskPriority"
  WHEN "priority" = 3 THEN 'HIGH'::"TaskPriority"
  ELSE 'URGENT'::"TaskPriority"
END;

ALTER TABLE "tasks" DROP COLUMN "priority";
ALTER TABLE "tasks" RENAME COLUMN "priority_enum" TO "priority";

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "tasks_assignee_id_idx" ON "tasks"("assignee_id");
