/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SecurityBadge } from '../common/SecurityBadge';
import { Button } from '../common/Button';
import {
  Bell,
  Search,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  Menu,
  ExternalLink,
  Building2,
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
    <header
      className="h-16 bg-white border-b border-[#DCE7F2] px-5 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-2xs"
      style={{ fontFamily: 'Calibri, "Segoe UI", Arial, sans-serif' }}
    >
      {/* Left: Collapse toggle, breadcrumb, page context */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-[#71849A] hover:text-[#17324F] hover:bg-[#F4F8FC] transition-colors cursor-pointer"
          title="Toggle Navigation"
        >
          <Menu className="w-4.5 h-4.5" />
        </button>

        <div className="flex items-center gap-2 text-[13.5px] text-[#71849A] truncate">
          <span className="hover:text-[#17324F] font-semibold text-[#1673D1] cursor-pointer" onClick={() => navigate('/app/overview')}>
            True-Trace
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-[#71849A] shrink-0" />
          <span className="font-bold text-[#17324F] truncate">{getBreadcrumb()}</span>
        </div>
      </div>

      {/* Center: Search input */}
      <div className="hidden md:flex items-center flex-1 max-w-sm mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#71849A] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students, institutions, or alerts..."
            className="w-full pl-9 pr-3 py-1.5 text-[13px] rounded-md border border-[#DCE7F2] bg-[#F4F8FC] focus:bg-white focus:outline-none focus:border-[#1673D1] text-[#17324F] transition-all"
          />
        </div>
      </div>

      {/* Right: Tenant/Role tag, Public verify, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Register Institution Quick Shortcut */}
        <div className="hidden xl:block">
          <Button
            variant="outline"
            size="xs"
            icon={<Building2 className="w-3.5 h-3.5" />}
            iconPosition="left"
            onClick={() => navigate('/institution/register')}
            className="bg-[#EAF4FF] hover:bg-[#D4E8FC] border-[#C5DCFA]"
          >
            Register Institution
          </Button>
        </div>

        {/* Current Role & Scope Tag */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-lg bg-[#F8FAFC] border border-[#DCE7F2] text-[12px]">
          <span className="w-2 h-2 rounded-full bg-[#16845B]" />
          <span className="text-[#71849A]">Role:</span>
          <span className="font-bold text-[#17324F] truncate max-w-[200px]" title={roleDisplay}>
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
          className="hidden sm:flex items-center gap-1 text-[13px] font-medium text-[#40566E] hover:text-[#1673D1] px-2 py-1 rounded-lg transition-colors cursor-pointer"
        >
          <span>Verify QR</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#1673D1]" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-[#71849A] hover:text-[#17324F] hover:bg-[#F4F8FC] relative transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadAlerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C53D45]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-[#DCE7F2] p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#DCE7F2]">
                <span className="font-bold text-[#17324F]">System Alerts</span>
                <span className="text-[11px] text-[#C53D45] font-bold">
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
                    className="p-2.5 rounded-lg hover:bg-[#F4F8FC] cursor-pointer border border-[#DCE7F2] transition-colors"
                  >
                    <div className="flex items-center justify-between font-bold text-[#17324F]">
                      <span className="truncate">{alert.title}</span>
                      <span className="text-[11px] text-[#C53D45] font-mono">Score {alert.severity}</span>
                    </div>
                    <p className="text-[11px] text-[#40566E] mt-0.5 line-clamp-2">{alert.summary}</p>
                  </div>
                ))}

                {unreadAlerts.length === 0 && (
                  <div className="text-center py-4 text-[#71849A]">No open alerts</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
