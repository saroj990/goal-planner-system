import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { GoalDetailPage } from '../pages/GoalDetailPage';
import { GoalsPage } from '../pages/GoalsPage';
import { DashboardPage } from '../pages/DashboardPage';
import { HomePage } from '../pages/HomePage';
import { AppLayout } from './AppLayout';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="welcome" element={<HomePage />} />
          <Route path="goals" element={<GoalsPage />} />
          <Route path="goals/:id" element={<GoalDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
