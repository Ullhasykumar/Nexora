/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bell, Search, Settings } from 'lucide-react';
import { useNexoraStore } from '../../store/nexoraStore';

export const Topbar: React.FC = () => {
  const profile = useNexoraStore((state) => state.profile);
  const firstName = profile?.fullName.split(' ')[0] || 'Student';

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <header className="h-20 bg-bg-base/80 backdrop-blur-md border-b border-border sticky top-0 z-30 px-8 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-text-primary">
          {greeting}, {firstName} 👋
        </h1>
        <p className="text-sm text-text-secondary mt-0.5">Let's build your future today.</p>
      </div>

      <div className="flex items-center space-y-0 space-x-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search resources..."
            className="bg-bg-surface border border-border rounded-full pl-10 pr-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-primary w-64 transition-all"
          />
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded-full transition-all">
            <Bell className="h-5 w-5" />
          </button>
          <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded-full transition-all">
            <Settings className="h-5 w-5" />
          </button>
          <div className="h-10 w-10 rounded-full border-2 border-accent-primary p-0.5">
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile?.fullName || 'Nexora'}`}
              alt="Avatar"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
