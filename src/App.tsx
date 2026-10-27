/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/institution/RegisterPage';
import { StatusPage } from './pages/institution/StatusPage';
import { PublicVerifyPage } from './pages/PublicVerifyPage';
import { OverviewPage } from './pages/app/OverviewPage';
import { InstitutionsPage } from './pages/app/InstitutionsPage';
import { StudentsPage } from './pages/app/StudentsPage';
import { UploadsPage } from './pages/app/UploadsPage';
import { CorrectionsPage } from './pages/app/CorrectionsPage';
import { ImpossibilityEnginePage } from './pages/app/ImpossibilityEnginePage';
import { LeakTracerPage } from './pages/app/LeakTracerPage';
import { AuditPage } from './pages/app/AuditPage';
import { SecurityMonitorPage } from './pages/app/SecurityMonitorPage';
import { AttackSimulatorPage } from './pages/app/AttackSimulatorPage';
import { CredentialsPage } from './pages/app/CredentialsPage';
import { ConsentWalletPage } from './pages/app/ConsentWalletPage';
import { TimeMachinePage } from './pages/app/TimeMachinePage';
import { AnalyticsPage } from './pages/app/AnalyticsPage';

function Router() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      return hash || window.location.pathname || '/';
    }
    return '/';
  });

  const navigate = (path: string) => {
    setCurrentPath(path);
    if (typeof window !== 'undefined') {
      window.location.hash = path;
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setCurrentPath(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Public Routes (No AppShell)
  if (currentPath === '/' || currentPath === '') {
    return <LandingPage navigate={navigate} />;
  }

  if (currentPath === '/login') {
    return <LoginPage navigate={navigate} />;
  }

  if (currentPath === '/institution/register') {
    return <RegisterPage navigate={navigate} />;
  }

  if (currentPath === '/institution/registration-status') {
    return <StatusPage navigate={navigate} />;
  }

  if (currentPath === '/verify' || currentPath === '/security/verify-signature') {
    return <PublicVerifyPage navigate={navigate} />;
  }

  // Authenticated App Routes (With AppShell)
  let pageComponent = <OverviewPage navigate={navigate} />;

  switch (currentPath) {
    case '/app/overview':
      pageComponent = <OverviewPage navigate={navigate} />;
      break;
    case '/app/institutions':
      pageComponent = <InstitutionsPage navigate={navigate} />;
      break;
    case '/app/students':
      pageComponent = <StudentsPage navigate={navigate} />;
      break;
    case '/app/uploads':
      pageComponent = <UploadsPage navigate={navigate} />;
      break;
    case '/app/corrections':
      pageComponent = <CorrectionsPage navigate={navigate} />;
      break;
    case '/app/analysis':
      pageComponent = <ImpossibilityEnginePage navigate={navigate} />;
      break;
    case '/app/leak-tracer':
      pageComponent = <LeakTracerPage navigate={navigate} />;
      break;
    case '/app/audit':
      pageComponent = <AuditPage navigate={navigate} />;
      break;
    case '/app/security-monitor':
      pageComponent = <SecurityMonitorPage navigate={navigate} />;
      break;
    case '/app/attack-simulator':
      pageComponent = <AttackSimulatorPage navigate={navigate} />;
      break;
    case '/app/credentials':
      pageComponent = <CredentialsPage navigate={navigate} />;
      break;
    case '/app/consent-wallet':
      pageComponent = <ConsentWalletPage navigate={navigate} />;
      break;
    case '/app/time-machine':
      pageComponent = <TimeMachinePage navigate={navigate} />;
      break;
    case '/app/analytics':
      pageComponent = <AnalyticsPage navigate={navigate} />;
      break;
    default:
      pageComponent = <OverviewPage navigate={navigate} />;
      break;
  }

  return (
    <AppShell currentPath={currentPath} navigate={navigate}>
      {pageComponent}
    </AppShell>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}
