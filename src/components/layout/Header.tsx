/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SecurityBadge } from '../common/SecurityBadge';
import {
  Bell,
  Search,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  Menu,
  ExternalLink,
} from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, navigate, collapsed, setCollapsed }) => {
  const { currentUser, activeSession, alerts } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getBreadcrumb = () => {
    const parts = currentPath.split('/').filter(Boolean);
    if (parts.length === 0) return 'Dashboard';
    const last = parts[parts.length - 1];
    const nameMap: Record<string, string> = {
      overview: 'Dashboard',
      institutions: 'Institutions',
      students: 'Student Records',
      uploads: 'Uploads & Corrections',
      corrections: 'Correction Queue',
      analysis: 'Impossibility Engine',
      'leak-tracer': 'Leak Tracer',
      audit: 'Audit Integrity',
      'security-monitor': 'Security Architecture & Monitor',
      'attack-simulator': 'Attack Simulator',
      credentials: 'Credentials & QR',
      'consent-wallet': 'Consent Wallet',
      'time-machine': 'Time Machine',
      analytics: 'Analytics',
      verify: 'Public QR Verification',
    };
    return nameMap[last] || last;
  };

  const unreadAlerts = alerts.filter(a => a.status === 'OPEN');

  const roleDisplay = currentUser.role === 'AICTE_ADMIN'
    ? 'AICTE Central Admin'
    : currentUser.role === 'COLLEGE_ADMIN'
    ? `College Admin · ${currentUser.institutionName || 'DIT Delhi'}`
    : currentUser.role === 'VERIFIER'
    ? 'Third-Party Verifier'
    : 'Student';

  return (
    <header className="h-14 bg-white border-b border-[#D5DEE8] px-5 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Left: Collapse toggle, breadcrumb, page context */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded text-[#59697C] hover:text-[#172536] hover:bg-slate-100 transition-colors"
          title="Toggle Navigation"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 text-[13px] text-[#59697C] truncate">
          <span className="text-[#59697C]">Portal</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-semibold text-[#172536] truncate">{getBreadcrumb()}</span>
        </div>
      </div>

      {/* Center: Search input */}
      <div className="hidden md:flex items-center flex-1 max-w-sm mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#59697C] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students, institutions, or alerts..."
            className="w-full pl-9 pr-3 py-1.5 text-[13px] rounded border border-[#D5DEE8] bg-[#F4F6F9] focus:bg-white focus:outline-none focus:border-[#2457A7] text-[#172536]"
          />
        </div>
      </div>

      {/* Right: Tenant/Role tag, Public verify, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Current Role & Scope Tag */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-[#F4F6F9] border border-[#D5DEE8] text-[12px]">
          <span className="w-2 h-2 rounded-full bg-[#16805D]" />
          <span className="text-[#59697C]">Role:</span>
          <span className="font-semibold text-[#172536] truncate max-w-[200px]" title={roleDisplay}>
            {roleDisplay}
          </span>
        </div>

        {/* Session Status */}
        <div
          onClick={() => navigate('/app/security-monitor')}
          className="cursor-pointer hidden sm:flex items-center"
          title="Current Session Threat & Status Telemetry"
        >
          <SecurityBadge
            level={
              activeSession.status === 'FROZEN'
                ? 'critical'
                : activeSession.status === 'THROTTLED'
                ? 'warning'
                : 'secure'
            }
            size="xs"
            pulse={activeSession.status === 'FROZEN'}
          >
            SESSION {activeSession.status}
          </SecurityBadge>
        </div>

        {/* Public Verifier Link */}
        <button
          onClick={() => navigate('/verify')}
          className="hidden sm:flex items-center gap-1 text-[13px] text-[#59697C] hover:text-[#2457A7] px-2 py-1 rounded transition-colors"
        >
          <span>Verify QR</span>
          <ExternalLink className="w-3 h-3" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded text-[#59697C] hover:text-[#172536] hover:bg-slate-100 relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C43D43]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-md border border-[#D5DEE8] p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#D5DEE8]">
                <span className="font-semibold text-[#172536]">System Alerts</span>
                <span className="text-[11px] text-[#C43D43] font-semibold">
                  {unreadAlerts.length} Unresolved
                </span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {unreadAlerts.map(alert => (
                  <div
                    key={alert.id}
                    onClick={() => {
                      navigate('/app/analysis');
                      setShowNotifications(false);
                    }}
                    className="p-2 rounded hover:bg-[#F4F6F9] cursor-pointer border border-[#D5DEE8] transition-colors"
                  >
                    <div className="flex items-center justify-between font-semibold text-[#172536]">
                      <span className="truncate">{alert.title}</span>
                      <span className="text-[11px] text-[#C43D43] font-mono">Score {alert.severity}</span>
                    </div>
                    <p className="text-[11px] text-[#59697C] mt-0.5 line-clamp-2">{alert.summary}</p>
                  </div>
                ))}

                {unreadAlerts.length === 0 && (
                  <div className="text-center py-4 text-[#59697C]">No open alerts</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
