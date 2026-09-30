import { Box } from '@mui/material';
import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';
import type { ProgressDayPoint } from '../types';

export function CompletionChart({ days }: { days: ProgressDayPoint[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chart = echarts.init(el);
    const labels = days.map((d) => d.date.slice(5));

    chart.setOption({
      color: ['#4f46e5', '#0ea5e9', '#a855f7', '#22c55e'],
      tooltip: { trigger: 'axis' },
      legend: { bottom: 0, data: ['Daily goals', 'Weekly goals', 'Monthly goals', 'Tasks'] },
      grid: { left: 40, right: 16, top: 24, bottom: 48 },
      xAxis: { type: 'category', data: labels, boundaryGap: false },
      yAxis: { type: 'value', minInterval: 1 },
      series: [
        {
          name: 'Daily goals',
          type: 'line',
          smooth: true,
          data: days.map((d) => d.goals.daily),
        },
        {
          name: 'Weekly goals',
          type: 'line',
          smooth: true,
          data: days.map((d) => d.goals.weekly),
        },
        {
          name: 'Monthly goals',
          type: 'line',
          smooth: true,
          data: days.map((d) => d.goals.monthly),
        },
        {
          name: 'Tasks',
          type: 'bar',
          data: days.map((d) => d.tasks),
          barMaxWidth: 12,
          itemStyle: { borderRadius: [4, 4, 0, 0] },
        },
      ],
    });

    const onResize = () => chart.resize();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      chart.dispose();
    };
  }, [days]);

  return <Box ref={containerRef} sx={{ width: '100%', height: 360 }} />;
}
