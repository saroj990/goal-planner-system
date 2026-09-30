import { Tab, Tabs } from '@mui/material';
import { GoalType } from '../types';

const TAB_OPTIONS: { label: string; value: GoalType }[] = [
  { label: 'Daily', value: GoalType.DAILY },
  { label: 'Weekly', value: GoalType.WEEKLY },
  { label: 'Monthly', value: GoalType.MONTHLY },
];

interface GoalTypeTabsProps {
  value: GoalType;
  onChange: (type: GoalType) => void;
}

export function GoalTypeTabs({ value, onChange }: GoalTypeTabsProps) {
  return (
    <Tabs
      value={value}
      onChange={(_event, next) => onChange(next as GoalType)}
      aria-label="Goal type"
    >
      {TAB_OPTIONS.map((tab) => (
        <Tab key={tab.value} label={tab.label} value={tab.value} />
      ))}
    </Tabs>
  );
}
