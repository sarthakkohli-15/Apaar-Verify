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
      className={`bg-white text-[#17324F] flex flex-col justify-between border-r border-[#DCE7F2] transition-all duration-150 select-none ${
        collapsed ? 'w-16' : 'w-60'
      } shrink-0 h-screen sticky top-0 z-30 shadow-2xs`}
      style={{ fontFamily: 'Calibri, "Segoe UI", Arial, sans-serif' }}
    >
      <div>
        {/* Brand Lockup */}
        <div
          onClick={() => navigate('/')}
          className="h-16 flex items-center px-3.5 border-b border-[#DCE7F2] bg-white cursor-pointer hover:bg-[#F4F8FC] transition-colors"
        >
          <ApaarLogo
            variant="dark"
            size="sm"
            iconOnly={collapsed}
            withSubtitle={!collapsed}
          />
        </div>

        {/* Navigation Groups */}
        <div className="py-3 overflow-y-auto max-h-[calc(100vh-135px)] space-y-4 px-2.5">
          {navSections.map((section) => {
            const visibleItems = section.items.filter(item => item.roles.includes(currentUser.role));
            if (visibleItems.length === 0) return null;

            return (
              <div key={section.heading}>
                {!collapsed && (
                  <div className="px-2.5 pb-1 pt-1 text-[11px] font-bold tracking-wider text-[#71849A] uppercase">
                    {section.heading}
                  </div>
                )}
                <div className="space-y-0.5">
                  {visibleItems.map((item, idx) => {
                    const isActive = currentPath === item.path;
                    const Icon = item.icon;
                    return (
                      <button
                        key={`${item.path}-${idx}`}
                        onClick={() => navigate(item.path)}
                        title={collapsed ? item.label : undefined}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-[13.5px] font-medium transition-all duration-150 cursor-pointer ${
                          isActive
                            ? 'bg-[#EAF4FF] text-[#1673D1] font-semibold shadow-2xs'
                            : 'text-[#40566E] hover:bg-[#F4F8FC] hover:text-[#17324F]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#1673D1]' : 'text-[#71849A]'}`} />
                          {!collapsed && <span className="truncate">{item.label}</span>}
                        </div>
                        {!collapsed && item.badge && (
                          <span className="text-[11px] font-bold text-white bg-[#C53D45] px-1.5 py-0.2 rounded font-mono">
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
      <div className="p-2.5 border-t border-[#DCE7F2] bg-[#F8FAFC] relative text-xs">
        <button
          onClick={() => setShowRoleMenu(!showRoleMenu)}
          className="w-full flex items-center justify-between p-2 rounded-md hover:bg-white border border-transparent hover:border-[#DCE7F2] transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#1673D1] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              {currentUser.avatar || 'US'}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="font-bold text-[#17324F] text-[13px] truncate">{currentUser.fullName}</div>
                <div className="text-[11px] text-[#71849A] truncate font-medium">
                  {currentUser.role.replace('_', ' ')}
                </div>
              </div>
            )}
          </div>
          {!collapsed && <ChevronDown className="w-3.5 h-3.5 text-[#71849A] shrink-0" />}
        </button>

        {showRoleMenu && (
          <div className="absolute bottom-14 left-2 right-2 bg-white border border-[#DCE7F2] rounded-md shadow-lg p-2 z-50 text-xs space-y-1">
            <div className="text-[11px] font-bold text-[#71849A] uppercase tracking-wider px-2 py-1">
              Switch Test Role (SIH Judging)
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => {
                  switchUser('AICTE_ADMIN');
                  setShowRoleMenu(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                  currentUser.role === 'AICTE_ADMIN' ? 'bg-[#EAF4FF] text-[#1673D1] font-semibold' : 'text-[#40566E] hover:bg-[#F4F8FC]'
                }`}
              >
                <div className="font-semibold">AICTE Central Officer</div>
                <div className="text-[10.5px] text-[#71849A]">Full platform oversight</div>
              </button>

              <button
                onClick={() => {
                  switchUser('COLLEGE_ADMIN', 'inst-01');
                  setShowRoleMenu(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                  currentUser.role === 'COLLEGE_ADMIN' && currentUser.institutionId === 'inst-01'
                    ? 'bg-[#EAF4FF] text-[#1673D1] font-semibold'
                    : 'text-[#40566E] hover:bg-[#F4F8FC]'
                }`}
              >
                <div className="font-semibold">Delhi Institute Admin</div>
                <div className="text-[10.5px] text-[#71849A]">Tenant-isolated institution</div>
              </button>

              <button
                onClick={() => {
                  switchUser('VERIFIER');
                  setShowRoleMenu(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                  currentUser.role === 'VERIFIER' ? 'bg-[#EAF4FF] text-[#1673D1] font-semibold' : 'text-[#40566E] hover:bg-[#F4F8FC]'
                }`}
              >
                <div className="font-semibold">Third-Party Verifier</div>
                <div className="text-[10.5px] text-[#71849A]">Employer public verification</div>
              </button>

              <button
                onClick={() => {
                  switchUser('STUDENT');
                  setShowRoleMenu(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                  currentUser.role === 'STUDENT' ? 'bg-[#EAF4FF] text-[#1673D1] font-semibold' : 'text-[#40566E] hover:bg-[#F4F8FC]'
                }`}
              >
                <div className="font-semibold">Student (Sarthak Sharma)</div>
                <div className="text-[10.5px] text-[#71849A]">Consent wallet access</div>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
