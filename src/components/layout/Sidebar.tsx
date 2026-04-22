/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Home, 
  TrendingUp, 
  Layers, 
  Target, 
  User, 
  ChevronRight,
  LogOut
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { signOut } from '../../services/firebase';

const menuItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/cgpa', icon: TrendingUp, label: 'CGPA Module' },
  { path: '/project', icon: Layers, label: 'Project Module' },
  { path: '/scope-radar', icon: Target, label: 'Scope Radar' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: isExpanded ? 240 : 80 }}
      className="fixed left-0 top-0 bottom-0 z-40 bg-bg-surface border-r border-border flex flex-col pt-6 pb-4"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="px-4 mb-10 flex items-center">
        <div className="h-10 w-10 bg-accent-primary rounded-xl flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-xl">N</span>
        </div>
        <motion.span
          initial={false}
          animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : -10 }}
          className={clsx("ml-3 font-bold text-xl text-text-primary", !isExpanded && "hidden")}
        >
          Nexora
        </motion.span>
      </div>

      <nav className="flex-1 px-3 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                "flex items-center p-3 rounded-xl transition-all duration-200 group no-underline",
                isActive 
                  ? "bg-accent-primary/10 text-accent-primary" 
                  : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
              )}
            >
              <Icon className={clsx("h-6 w-6 shrink-0", isActive && "text-accent-primary")} />
              <motion.span
                initial={false}
                animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : -10 }}
                className={clsx("ml-4 font-medium whitespace-nowrap", !isExpanded && "hidden")}
              >
                {item.label}
              </motion.span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pt-4 border-t border-border mt-4">
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center p-3 rounded-xl text-text-secondary hover:bg-accent-danger/10 hover:text-accent-danger transition-all group"
        >
          <LogOut className="h-6 w-6 shrink-0" />
          <motion.span
            initial={false}
            animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : -10 }}
            className={clsx("ml-4 font-medium", !isExpanded && "hidden")}
          >
            Sign Out
          </motion.span>
        </button>
      </div>
    </motion.div>
  );
};
