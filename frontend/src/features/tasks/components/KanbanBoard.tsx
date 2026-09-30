import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragOverEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
  type CollisionDetection,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Box } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  KANBAN_COLUMN_ORDER,
  buildReorderPayload,
  dragOverColumns,
  groupTasksByStatus,
} from '../kanban/kanbanModel';
import type { Task } from '../types';
import { KanbanColumn } from './KanbanColumn';
import { KanbanTaskCard } from './KanbanTaskCard';

interface KanbanBoardProps {
  goalId: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onReorder: (payload: ReturnType<typeof buildReorderPayload>) => void;
}

const collisionDetection: CollisionDetection = (args) => {
  const pointer = pointerWithin(args);
  if (pointer.length > 0) return pointer;
  return rectIntersection(args);
};

export function KanbanBoard({ goalId, tasks, onEdit, onDelete, onReorder }: KanbanBoardProps) {
  const [columns, setColumns] = useState(() => groupTasksByStatus(tasks));
  const columnsRef = useRef(columns);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    const grouped = groupTasksByStatus(tasks);
    setColumns(grouped);
    columnsRef.current = grouped;
  }, [tasks]);

  useEffect(() => {
    columnsRef.current = columns;
  }, [columns]);

  const taskById = useMemo(() => new Map(tasks.map((t) => [t.id, t])), [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = taskById.get(String(event.active.id));
    setActiveTask(task ?? null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const next = dragOverColumns(columns, String(active.id), String(over.id));
    if (next) setColumns(next);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) {
      setColumns(groupTasksByStatus(tasks));
      return;
    }
    if (active.id === over.id) return;

    const current = columnsRef.current;
    const next = dragOverColumns(current, String(active.id), String(over.id)) ?? current;
    setColumns(next);
    columnsRef.current = next;
    onReorder(buildReorderPayload(goalId, next));
  };

  const handleDragCancel = () => {
    setActiveTask(null);
    setColumns(groupTasksByStatus(tasks));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
          },
          gap: 2,
          alignItems: 'start',
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

      <DragOverlay dropAnimation={{ duration: 180, easing: 'ease-out' }}>
        {activeTask ? (
          <KanbanTaskCard task={activeTask} onEdit={() => undefined} onDelete={() => undefined} isOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
