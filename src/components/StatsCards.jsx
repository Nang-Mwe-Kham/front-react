import React from 'react';
import { 
  Users, 
  UserCheck, 
  ShieldCheck, 
  Clock, 
  TrendingUp, 
  ArrowUpRight 
} from 'lucide-react';

export default function StatsCards({ users }) {
  const total = users.length;
  const active = users.filter(u => u.status === 'Active').length;
  const admins = users.filter(u => u.role.toLowerCase().includes('admin')).length;
  const pending = users.filter(u => u.status === 'Pending').length;

  const activePct = total > 0 ? Math.round((active / total) * 100) : 0;

  const cards = [
    {
      id: 'stat-total',
      title: 'Total Users',
      value: total,
      subtext: '+12% from last month',
      trend: '+12%',
      icon: Users,
      gradient: 'from-blue to-indigo',
      accentColor: '#6366f1'
    },
    {
      id: 'stat-active',
      title: 'Active Members',
      value: active,
      subtext: `${activePct}% engagement rate`,
      trend: `${activePct}%`,
      icon: UserCheck,
      gradient: 'from-emerald to-teal',
      accentColor: '#10b981'
    },
    {
      id: 'stat-admins',
      title: 'Privileged Admins',
      value: admins,
      subtext: 'High level access',
      trend: 'IAM OK',
      icon: ShieldCheck,
      gradient: 'from-violet to-purple',
      accentColor: '#8b5cf6'
    },
    {
      id: 'stat-pending',
      title: 'Pending Onboarding',
      value: pending,
      subtext: pending > 0 ? 'Requires activation' : 'All clear',
      trend: pending > 0 ? `${pending} queued` : 'Ready',
      icon: Clock,
      gradient: 'from-amber to-orange',
      accentColor: '#f59e0b'
    }
  ];

  return (
    <section className="stats-grid">
      {cards.map(card => {
        const IconComponent = card.icon;
        return (
          <div key={card.id} className="stat-card glass-panel">
            <div className="stat-card-header">
              <span className="stat-title">{card.title}</span>
              <div 
                className="stat-icon-wrapper" 
                style={{ backgroundColor: `${card.accentColor}18`, color: card.accentColor }}
              >
                <IconComponent size={20} />
              </div>
            </div>

            <div className="stat-card-body">
              <div className="stat-value">{card.value}</div>
              <div className="stat-meta">
                <span className="stat-trend-badge" style={{ color: card.accentColor }}>
                  <TrendingUp size={13} />
                  {card.trend}
                </span>
                <span className="stat-subtext">{card.subtext}</span>
              </div>
            </div>
            
            <div className="stat-glow-bar" style={{ backgroundColor: card.accentColor }}></div>
          </div>
        );
      })}
    </section>
  );
}
