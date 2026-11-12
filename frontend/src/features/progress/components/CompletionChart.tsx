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
      color: ['#60a5fa', '#4ade80'],
      tooltip: { trigger: 'axis' },
      legend: { bottom: 0, data: ['Projects completed', 'Tasks completed'] },
      grid: { left: 40, right: 16, top: 24, bottom: 48 },
      xAxis: { type: 'category', data: labels, boundaryGap: false },
      yAxis: { type: 'value', minInterval: 1 },
      series: [
        {
          name: 'Projects completed',
          type: 'line',
          smooth: true,
          data: days.map((d) => d.projects),
        },
        {
          name: 'Tasks completed',
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
