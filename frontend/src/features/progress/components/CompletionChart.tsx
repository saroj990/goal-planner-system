import { Box, useTheme } from '@mui/material';
import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';
import type { ProgressDayPoint } from '../types';

export function CompletionChart({ days }: { days: ProgressDayPoint[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chart = echarts.init(el);
    const labels = days.map((d) => d.date.slice(5));
    const isDark = theme.palette.mode === 'dark';
    const muted = theme.palette.text.secondary;
    const axisLine = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)';

    chart.setOption({
      color: [theme.palette.primary.main, '#34d399'],
      textStyle: {
        fontFamily: theme.typography.fontFamily,
        color: muted,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: theme.palette.background.paper,
        borderColor: theme.palette.divider,
        textStyle: { color: theme.palette.text.primary },
      },
      legend: {
        bottom: 0,
        data: ['Projects completed', 'Tasks completed'],
        textStyle: { color: muted },
        itemWidth: 12,
        itemHeight: 12,
      },
      grid: { left: 40, right: 16, top: 24, bottom: 52 },
      xAxis: {
        type: 'category',
        data: labels,
        boundaryGap: false,
        axisLine: { lineStyle: { color: axisLine } },
        axisLabel: { color: muted },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        splitLine: { lineStyle: { color: axisLine } },
        axisLabel: { color: muted },
      },
      series: [
        {
          name: 'Projects completed',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { width: 2.5 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: isDark ? 'rgba(56,189,248,0.28)' : 'rgba(2,132,199,0.18)' },
              { offset: 1, color: 'transparent' },
            ]),
          },
          data: days.map((d) => d.projects),
        },
        {
          name: 'Tasks completed',
          type: 'bar',
          data: days.map((d) => d.tasks),
          barMaxWidth: 14,
          itemStyle: { borderRadius: [6, 6, 0, 0] },
        },
      ],
    });

    const onResize = () => chart.resize();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      chart.dispose();
    };
  }, [days, theme]);

  return <Box ref={containerRef} sx={{ width: '100%', height: 380 }} />;
}
