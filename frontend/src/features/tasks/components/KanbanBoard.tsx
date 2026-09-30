import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Box } from '@mui/material';
import { useMemo } from 'react';
import {
  KANBAN_COLUMN_ORDER,
  buildReorderPayload,
  groupTasksByStatus,
  moveTaskInColumns,
  resolveDropTarget,
} from '../kanban/kanbanModel';
import type { Task } from '../types';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  goalId: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onReorder: (payload: ReturnType<typeof buildReorderPayload>) => void;
}

export function KanbanBoard({ goalId, tasks, onEdit, onDelete, onReorder }: KanbanBoardProps) {
  const columns = useMemo(() => groupTasksByStatus(tasks), [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const drop = resolveDropTarget(columns, String(over.id));
    if (!drop) return;

    const next = moveTaskInColumns(columns, String(active.id), drop.status, drop.index);
    onReorder(buildReorderPayload(goalId, next));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          pb: 1,
          alignItems: 'flex-start',
        }}
      >
        {KANBAN_COLUMN_ORDER.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={columns[status]}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </Box>
    </DndContext>
  );
}
