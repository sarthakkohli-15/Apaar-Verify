/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ChevronRight,
  RotateCcw,
  ShieldCheck,
  Network,
  Radio,
  Fingerprint,
  Lock,
  QrCode,
  X,
} from 'lucide-react';

export const SCENES = [
  {
    number: 1,
    title: 'Institution Registration & Review',
    route: '/app/institutions',
    icon: ShieldCheck,
  },
  {
    number: 2,
    title: 'Impossibility Engine & Graph',
    route: '/app/analysis',
    icon: Network,
  },
  {
    number: 3,
    title: 'Insider Attack Simulator',
    route: '/app/attack-simulator',
    icon: Radio,
  },
  {
    number: 4,
    title: 'Forensic Leak Tracer',
    route: '/app/leak-tracer',
    icon: Fingerprint,
  },
  {
    number: 5,
    title: 'Multi-Witness Tamper Audit',
    route: '/app/audit',
    icon: Lock,
  },
  {
    number: 6,
    title: 'Privacy QR Verification',
    route: '/verify',
    icon: QrCode,
  },
];

export const SihDemoLauncher: React.FC<{ currentPath: string; navigate: (path: string) => void }> = ({
  currentPath,
  navigate,
}) => {
  const { demoScene, setDemoScene, resetDemoState } = useApp();
  const [isMinimized, setIsMinimized] = useState(false);

  const activeSceneIndex = demoScene !== null ? demoScene - 1 : SCENES.findIndex(s => s.route === currentPath);
  const activeScene = activeSceneIndex >= 0 ? SCENES[activeSceneIndex] : null;

  const handleSelectScene = (sceneNum: number) => {
    setDemoScene(sceneNum);
    const scene = SCENES[sceneNum - 1];
    if (scene) {
      navigate(scene.route);
    }
  };

  const handleNextScene = () => {
    const nextNum = (activeSceneIndex + 1 < SCENES.length ? activeSceneIndex + 1 : 0) + 1;
    handleSelectScene(nextNum);
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-[#10243A] text-white px-3 py-1.5 rounded shadow border border-[#2457A7] text-[13px] font-medium hover:bg-[#0B1728] transition-colors"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#C17B20]" />
        <span>Demo Tour (Scene {activeSceneIndex >= 0 ? activeSceneIndex + 1 : 1}/6)</span>
      </button>
    );
  }

  return (
    <div className="bg-[#17324F] text-slate-100 border-b border-[#122A42] px-4 py-1.5 text-[12.5px] flex flex-wrap items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-white font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>SIH 2026 Evaluation Tour</span>
          <span className="text-slate-300 font-normal">· Problem ID 26263</span>
        </div>

        {/* Scene Selector Strip */}
        <div className="hidden lg:flex items-center gap-1">
          {SCENES.map((scene) => {
            const isCurrent = activeScene?.number === scene.number;
            return (
              <button
                key={scene.number}
                onClick={() => handleSelectScene(scene.number)}
                className={`px-2.5 py-0.5 rounded-md text-[12px] transition-colors whitespace-nowrap cursor-pointer ${
                  isCurrent
                    ? 'bg-[#1673D1] text-white font-semibold shadow-2xs'
                    : 'text-slate-200 hover:bg-[#122A42] hover:text-white'
                }`}
                title={scene.title}
              >
                Scene {scene.number}: {scene.title}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleNextScene}
          className="flex items-center gap-1 bg-[#1673D1] hover:bg-[#105CB0] text-white px-3 py-1 rounded-md text-[12px] font-semibold transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
        >
          <span>Next Scene</span>
          <ChevronRight className="w-3 h-3" />
        </button>

        <button
          onClick={resetDemoState}
          className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-md text-[12px] transition-colors whitespace-nowrap cursor-pointer"
          title="Reset dataset and simulations to baseline"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Demo</span>
        </button>

        <button
          onClick={() => setIsMinimized(true)}
          className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-md cursor-pointer"
          title="Minimize"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
