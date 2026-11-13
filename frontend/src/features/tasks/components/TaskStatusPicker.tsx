import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { Box, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { radius } from '../../../app/theme';
import { TASK_STATUS_LABEL, taskStatusColors } from '../taskStatusStyle';
import { TaskStatus } from '../types';
import { TaskStatusChip } from './TaskStatusChip';

const STATUS_ORDER: TaskStatus[] = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.BLOCKED,
  TaskStatus.DONE,
];

interface TaskStatusPickerProps {
  value: TaskStatus;
  onChange: (status: TaskStatus) => void;
  disabled?: boolean;
  ariaLabel?: string;
}

export function TaskStatusPicker({
  value,
  onChange,
  disabled,
  ariaLabel = 'Change task status',
}: TaskStatusPickerProps) {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const open = Boolean(anchor);

  return (
    <>
      <Box
        component="button"
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.25,
          border: 'none',
          bgcolor: 'transparent',
          p: 0,
          m: 0,
          cursor: disabled ? 'default' : 'pointer',
          transition: 'opacity 0.15s ease',
          '&:hover': disabled
            ? {}
            : {
                opacity: 0.92,
                '& .status-chevron': { color: 'text.primary' },
              },
          '&:focus-visible': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: 2,
            borderRadius: `${radius.control}px`,
          },
        }}
      >
        <TaskStatusChip status={value} />
        <KeyboardArrowDownRoundedIcon
          className="status-chevron"
          sx={{
            fontSize: 18,
            color: 'text.secondary',
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.15s ease',
          }}
        />
      </Box>

      <Menu
        anchorEl={anchor}
        open={open}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: 0.75,
              minWidth: 200,
              py: 0.5,
              border: '1px solid',
              borderColor: 'divider',
            },
          },
        }}
      >
        {STATUS_ORDER.map((status) => {
          const { color } = taskStatusColors(status);
          const selected = status === value;
          return (
            <MenuItem
              key={status}
              selected={selected}
              onClick={() => {
                onChange(status);
                setAnchor(null);
              }}
              sx={{
                py: 1,
                borderRadius: `${Math.max(radius.control - 2, 4)}px`,
                mx: 0.75,
                '&.Mui-selected': {
                  bgcolor: 'action.selected',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 28 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: color,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={TASK_STATUS_LABEL[status]}
                primaryTypographyProps={{ fontWeight: selected ? 700 : 600, fontSize: 14 }}
              />
              {selected ? (
                <TaskStatusChip status={status} />
              ) : null}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
