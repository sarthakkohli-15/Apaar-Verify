/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import { SihDemoLauncher } from '../demo/SihDemoLauncher';

interface AppShellProps {
  currentPath: string;
  navigate: (path: string) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ currentPath, navigate, children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F9] text-[#172536]">
      {/* 5-Minute SIH Demo Mode Launcher Persistent Bar */}
      <SihDemoLauncher currentPath={currentPath} navigate={navigate} />

      <div className="flex flex-1 min-h-0">
        {/* Left Sidebar */}
        <Sidebar
          currentPath={currentPath}
          navigate={navigate}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        {/* Right Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Header
            currentPath={currentPath}
            navigate={navigate}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1560px] w-full mx-auto">
            {children}
          </main>

          <Footer navigate={navigate} />
        </div>
      </div>
    </div>
  );
};
