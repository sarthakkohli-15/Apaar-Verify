/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ApaarLogo } from '../common/ApaarLogo';
import {
  LayoutDashboard,
  Building2,
  Users,
  UploadCloud,
  Network,
  AlertTriangle,
  Fingerprint,
  History,
  Shield,
  Activity,
  Radio,
  FileCheck2,
  QrCode,
  Wallet,
  BarChart3,
  ChevronDown,
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
  navigate: (path: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, navigate, collapsed }) => {
  const { currentUser, switchUser, alerts } = useApp();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const openAlertsCount = alerts.filter(a => a.status === 'OPEN').length;

  const navSections = [
    {
      heading: 'OVERVIEW',
      items: [
        { label: 'Dashboard', path: '/app/overview', icon: LayoutDashboard, roles: ['AICTE_ADMIN', 'COLLEGE_ADMIN'] },
      ],
    },
    {
      heading: 'INSTITUTION OPERATIONS',
      items: [
        { label: 'Institutions', path: '/app/institutions', icon: Building2, roles: ['AICTE_ADMIN', 'COLLEGE_ADMIN'] },
        { label: 'Student Records', path: '/app/students', icon: Users, roles: ['AICTE_ADMIN', 'COLLEGE_ADMIN'] },
        { label: 'Uploads & Corrections', path: '/app/uploads', icon: UploadCloud, roles: ['AICTE_ADMIN', 'COLLEGE_ADMIN'] },
      ],
    },
    {
      heading: 'INVESTIGATIONS',
      items: [
        {
          label: 'Impossibility Engine',
          path: '/app/analysis',
          icon: Network,
          roles: ['AICTE_ADMIN'],
          badge: openAlertsCount > 0 ? `${openAlertsCount}` : undefined,
        },
        { label: 'Alerts', path: '/app/analysis', icon: AlertTriangle, roles: ['AICTE_ADMIN', 'COLLEGE_ADMIN'] },
        { label: 'Leak Tracer', path: '/app/leak-tracer', icon: Fingerprint, roles: ['AICTE_ADMIN', 'COLLEGE_ADMIN'] },
        { label: 'Time Machine', path: '/app/time-machine', icon: History, roles: ['AICTE_ADMIN', 'COLLEGE_ADMIN'] },
      ],
    },
    {
      heading: 'SECURITY',
      items: [
        { label: 'Security Architecture', path: '/app/security-monitor', icon: Shield, roles: ['AICTE_ADMIN', 'COLLEGE_ADMIN'] },
        { label: 'Security Monitor', path: '/app/security-monitor', icon: Activity, roles: ['AICTE_ADMIN', 'COLLEGE_ADMIN'] },
        { label: 'Attack Simulator', path: '/app/attack-simulator', icon: Radio, roles: ['AICTE_ADMIN'] },
        { label: 'Audit Integrity', path: '/app/audit', icon: FileCheck2, roles: ['AICTE_ADMIN', 'COLLEGE_ADMIN'] },
      ],
    },
    {
      heading: 'VERIFICATION',
      items: [
        { label: 'Credentials & QR', path: '/app/credentials', icon: QrCode, roles: ['AICTE_ADMIN', 'COLLEGE_ADMIN', 'VERIFIER'] },
        { label: 'Consent Wallet', path: '/app/consent-wallet', icon: Wallet, roles: ['AICTE_ADMIN', 'STUDENT'] },
      ],
    },
    {
      heading: 'REPORTING',
      items: [
        { label: 'Analytics', path: '/app/analytics', icon: BarChart3, roles: ['AICTE_ADMIN', 'COLLEGE_ADMIN'] },
      ],
    },
  ];

  return (
    <aside
      className={`bg-[#10243A] text-slate-300 flex flex-col justify-between border-r border-[#1B3552] transition-all duration-150 select-none ${
        collapsed ? 'w-16' : 'w-60'
      } shrink-0 h-screen sticky top-0 z-30`}
    >
      <div>
        {/* Brand Lockup */}
        <div
          onClick={() => navigate('/')}
          className="h-14 flex items-center px-3 border-b border-[#1B3552] bg-[#0B1728] cursor-pointer hover:bg-[#10243A] transition-colors"
        >
          <ApaarLogo
            variant="light"
            size="sm"
            iconOnly={collapsed}
            withSubtitle={!collapsed}
          />
        </div>

        {/* Navigation Groups */}
        <div className="py-2 overflow-y-auto max-h-[calc(100vh-125px)] space-y-3 px-2">
          {navSections.map((section) => {
            const visibleItems = section.items.filter(item => item.roles.includes(currentUser.role));
            if (visibleItems.length === 0) return null;

            return (
              <div key={section.heading}>
                {!collapsed && (
                  <div className="px-2.5 pb-1 pt-1 text-[11px] font-semibold tracking-wider text-slate-400">
                    {section.heading}
                  </div>
                )}
                <div className="space-y-0.5">
                  {visibleItems.map((item, idx) => {
                    // For active check, exact match or match on primary path
                    const isActive = currentPath === item.path;
                    const Icon = item.icon;
                    return (
                      <button
                        key={`${item.path}-${idx}`}
                        onClick={() => navigate(item.path)}
                        title={collapsed ? item.label : undefined}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-[13.5px] font-normal transition-colors relative ${
                          isActive
                            ? 'bg-[#1D3B5C] text-white font-medium'
                            : 'text-slate-300 hover:bg-[#16304D] hover:text-white'
                        }`}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1 bottom-1 w-1 bg-[#2457A7] rounded-r" />
                        )}
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#3B82F6]' : 'text-slate-400'}`} />
                          {!collapsed && <span className="truncate">{item.label}</span>}
                        </div>
                        {!collapsed && item.badge && (
                          <span className="text-[11px] font-semibold text-white bg-[#C43D43] px-1.5 py-0.2 rounded">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Role Switcher & User Profile */}
      <div className="p-2.5 border-t border-[#1B3552] bg-[#0B1728] relative text-xs">
        <button
          onClick={() => setShowRoleMenu(!showRoleMenu)}
          className="w-full flex items-center justify-between p-2 rounded hover:bg-[#16304D] transition-colors text-left"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded bg-[#2457A7] text-white flex items-center justify-center font-semibold text-xs shrink-0">
              {currentUser.avatar || 'US'}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="font-semibold text-white text-[13px] truncate">{currentUser.fullName}</div>
                <div className="text-[11px] text-slate-400 truncate">
                  {currentUser.role.replace('_', ' ')}
                </div>
              </div>
            )}
          </div>
          {!collapsed && <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
        </button>

        {showRoleMenu && (
          <div className="absolute bottom-14 left-2 right-2 bg-[#10243A] border border-[#2457A7] rounded shadow-lg p-2 z-50 text-xs">
            <div className="text-[11px] font-semibold text-slate-400 px-2 py-1">
              Switch Test Role
            </div>
            <div className="space-y-0.5 mt-1">
              <button
                onClick={() => {
                  switchUser('AICTE_ADMIN');
                  setShowRoleMenu(false);
                }}
                className={`w-full text-left px-2 py-1.5 rounded hover:bg-[#1B3552] ${
                  currentUser.role === 'AICTE_ADMIN' ? 'bg-[#2457A7] text-white font-medium' : 'text-slate-200'
                }`}
              >
                <div>AICTE Central Officer</div>
                <div className="text-[11px] text-slate-400">Full platform oversight</div>
              </button>

              <button
                onClick={() => {
                  switchUser('COLLEGE_ADMIN', 'inst-01');
                  setShowRoleMenu(false);
                }}
                className={`w-full text-left px-2 py-1.5 rounded hover:bg-[#1B3552] ${
                  currentUser.role === 'COLLEGE_ADMIN' && currentUser.institutionId === 'inst-01'
                    ? 'bg-[#2457A7] text-white font-medium'
                    : 'text-slate-200'
                }`}
              >
                <div>Delhi Institute Admin</div>
                <div className="text-[11px] text-slate-400">Tenant-isolated institution</div>
              </button>

              <button
                onClick={() => {
                  switchUser('VERIFIER');
                  setShowRoleMenu(false);
                }}
                className={`w-full text-left px-2 py-1.5 rounded hover:bg-[#1B3552] ${
                  currentUser.role === 'VERIFIER' ? 'bg-[#2457A7] text-white font-medium' : 'text-slate-200'
                }`}
              >
                <div>Third-Party Verifier</div>
                <div className="text-[11px] text-slate-400">Employer public verification</div>
              </button>

              <button
                onClick={() => {
                  switchUser('STUDENT');
                  setShowRoleMenu(false);
                }}
                className={`w-full text-left px-2 py-1.5 rounded hover:bg-[#1B3552] ${
                  currentUser.role === 'STUDENT' ? 'bg-[#2457A7] text-white font-medium' : 'text-slate-200'
                }`}
              >
                <div>Student (Sarthak Sharma)</div>
                <div className="text-[11px] text-slate-400">Consent wallet access</div>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
