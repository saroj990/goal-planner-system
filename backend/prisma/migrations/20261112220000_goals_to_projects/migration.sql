-- Rename goals table to projects and drop goal type column
ALTER TABLE "goals" RENAME TO "projects";
ALTER TABLE "projects" DROP COLUMN IF EXISTS "type";

-- Rename goal status enum to project status
ALTER TYPE "GoalStatus" RENAME TO "ProjectStatus";

DROP TYPE IF EXISTS "GoalType";

-- Tasks: goal_id -> project_id
ALTER TABLE "tasks" RENAME COLUMN "goal_id" TO "project_id";

-- Rename foreign key constraints if they exist (optional; names may vary by env)
ALTER TABLE "tasks" DROP CONSTRAINT IF EXISTS "tasks_goal_id_fkey";
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "projects" DROP CONSTRAINT IF EXISTS "goals_user_id_fkey";
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
