import React, { useEffect, useState } from 'react';
import { usePatient } from '../hooks/useAPI';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalPrescriptions: 0,
    pendingEvaluations: 0,
    completedEvaluations: 0,
  });

  useEffect(() => {
    // Fetch dashboard stats from backend
    const fetchStats = async () => {
      try {
        // In a real app, you would fetch aggregated stats from the backend
        // For now, this is a placeholder
        setStats({
          totalPatients: 24,
          totalPrescriptions: 156,
          pendingEvaluations: 12,
          completedEvaluations: 144,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-page">
      <h1>BiomED Predict - Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Patients</h3>
          <p className="stat-value">{stats.totalPatients}</p>
        </div>
        <div className="stat-card">
          <h3>Total Prescriptions</h3>
          <p className="stat-value">{stats.totalPrescriptions}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Evaluations</h3>
          <p className="stat-value">{stats.pendingEvaluations}</p>
        </div>
        <div className="stat-card">
          <h3>Completed Evaluations</h3>
          <p className="stat-value">{stats.completedEvaluations}</p>
        </div>
      </div>

      <div className="dashboard-sections">
        <section className="recent-activity">
          <h2>Recent Activity</h2>
          <p>Latest patient registrations and prescriptions will appear here.</p>
        </section>

        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <button className="action-btn">Register New Patient</button>
          <button className="action-btn">Create Prescription</button>
          <button className="action-btn">View Reports</button>
        </section>
      </div>
    </div>
  );
};
