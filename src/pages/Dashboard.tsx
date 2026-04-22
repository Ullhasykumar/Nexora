/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { ProgressRing } from '../components/shared/ProgressRing';
import { useNexoraStore } from '../store/nexoraStore';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { motion } from 'motion/react';
import { TrendingUp, Target, Zap, ChevronRight, RefreshCw, AlertTriangle } from 'lucide-react';
import { calculateSGPA, calculateCGPA } from '../services/cgpaEngine';
import { generateWeeklyNudge } from '../services/geminiApi';
import { Button } from '../components/shared/Button';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { profile, currentSemesterSubjects, semesters } = useNexoraStore();
  const [nudge, setNudge] = useState<string>('Loading your weekly priority...');
  const [isNudgeLoading, setIsNudgeLoading] = useState(false);

  const currentSGPA = calculateSGPA(currentSemesterSubjects);
  
  // Prepare data for CGPA trajectory chart
  const cgpaData = [
    ...semesters.map((sem, i) => ({ name: `Sem ${i+1}`, value: sem.sgpa })),
    { name: 'Current', value: currentSGPA }
  ].filter(d => d.value > 0);

  const fetchNudge = async () => {
    setIsNudgeLoading(true);
    try {
      const statsContext = `Student in sem ${profile?.currentSemester}. Current SGPA: ${currentSGPA}. Subjects: ${currentSemesterSubjects.map(s => `${s.name} (${s.internalScore}/${s.maxInternal})`).join(', ')}`;
      const result = await generateWeeklyNudge(statsContext);
      setNudge(result || 'Focus on your core subjects this week.');
    } catch (error) {
      setNudge('Keep pushing your boundaries. You are doing great!');
    } finally {
      setIsNudgeLoading(false);
    }
  };

  useEffect(() => {
    fetchNudge();
  }, [profile, currentSemesterSubjects]);

  const getHealthColor = (val: number) => {
    if (val > 7.5) return 'var(--color-accent-secondary)';
    if (val > 5) return 'var(--color-accent-warm)';
    return 'var(--color-accent-danger)';
  };

  return (
    <PageWrapper>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CARD 1 — Live CGPA Ring */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="nx-card p-8 flex flex-col items-center justify-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <TrendingUp size={120} />
          </div>
          <h3 className="text-lg font-bold mb-8 self-start">Live CGPA Ring</h3>
          <ProgressRing 
            value={currentSGPA} 
            max={10} 
            color={getHealthColor(currentSGPA)}
            label={currentSGPA.toFixed(2)}
            sublabel="SGPA (Current)"
          />
          <div className="mt-8 text-center">
            <p className="text-text-secondary">Projected end-semester CGPA: <span className="text-text-primary font-bold">{(currentSGPA * 0.9 + 0.5).toFixed(2)}</span></p>
            <p className="text-xs text-text-secondary mt-1 italic">Based on your current performance trend</p>
          </div>
        </motion.div>

        {/* CARD 2 — Semester Risk Heatmap */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="nx-card p-8"
        >
          <h3 className="text-lg font-bold mb-6">Semester Risk Heatmap</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {currentSemesterSubjects.map((sub, i) => {
              const perc = (sub.internalScore / sub.maxInternal) * 100;
              const color = perc > 70 ? 'bg-accent-secondary' : perc > 50 ? 'bg-accent-warm' : 'bg-accent-danger';
              return (
                <div key={i} className="p-4 rounded-2xl bg-bg-base border border-border flex flex-col items-center group cursor-pointer hover:border-accent-primary transition-all">
                  <div className={`w-3 h-3 rounded-full ${color} mb-3`} />
                  <span className="text-sm font-medium text-text-primary text-center line-clamp-1">{sub.name}</span>
                  <span className="text-xs text-text-secondary mt-1">{perc.toFixed(0)}% internal</span>
                </div>
              );
            })}
            {currentSemesterSubjects.length === 0 && (
               <div className="col-span-full py-10 text-center text-text-secondary">
                  No subjects added yet. Go to CGPA Module.
               </div>
            )}
          </div>
          <div className="mt-8 flex items-center justify-between">
            <div className="flex space-x-4">
              <LegendItem color="bg-accent-secondary" label="Safe" />
              <LegendItem color="bg-accent-warm" label="Caution" />
              <LegendItem color="bg-accent-danger" label="Risk" />
            </div>
            <Link to="/cgpa">
              <Button variant="ghost" size="sm">View Details</Button>
            </Link>
          </div>
        </motion.div>

        {/* CARD 3 — CGPA Time Machine Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="nx-card p-8 h-80"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">CGPA Trajectory</h3>
            <Link to="/cgpa">
              <Button size="sm" variant="outline">Simulate</Button>
            </Link>
          </div>
          <div className="h-full pb-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cgpaData.length > 0 ? cgpaData : [{name: 'Start', value: 0}]}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--color-text-secondary)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="var(--color-text-secondary)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  domain={[0, 10]}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: '12px' }}
                  itemStyle={{ color: 'var(--color-accent-primary)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--color-accent-primary)" 
                  strokeWidth={3}
                  dot={{ fill: 'var(--color-accent-primary)', r: 4 }}
                  activeDot={{ r: 6, stroke: 'var(--color-bg-base)', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* CARD 4 — Project Health Score */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="nx-card p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Project Health</h3>
            <div className="h-2 w-2 rounded-full bg-accent-secondary animate-pulse" />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">Overall Completion</span>
                <span className="text-sm font-bold text-text-primary">64%</span>
              </div>
              <div className="h-3 w-full bg-bg-base rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '64%' }}
                  className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary"
                />
              </div>
            </div>
            <div className="p-4 rounded-xl bg-bg-base border border-border">
              <span className="text-xs text-text-secondary uppercase tracking-wider font-bold">Current Milestone</span>
              <p className="text-sm font-medium text-text-primary mt-1">Hardware procurement and sensor calibration</p>
              <div className="flex items-center mt-3 text-xs text-text-secondary">
                <AlertTriangle className="h-3 w-3 text-accent-warm mr-1" />
                Due in 4 days
              </div>
            </div>
            <Link to="/project">
              <Button variant="ghost" fullWidth className="justify-between group">
                View Project Details
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* CARD 5 — Weekly Nudge Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-full h-fit"
        >
          <div className="nx-card p-8 bg-gradient-to-r from-accent-primary/20 to-accent-secondary/10 border-accent-primary/20 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-accent-primary rounded-lg flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold">Weekly War Room Nudge</h3>
                </div>
                <button 
                  onClick={fetchNudge} 
                  disabled={isNudgeLoading}
                  className="p-2 hover:bg-white/10 rounded-full transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${isNudgeLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <p className="text-xl text-text-primary leading-relaxed max-w-4xl">
                {isNudgeLoading ? 'Consulting your mentor...' : nudge}
              </p>
              <p className="text-[10px] text-text-secondary mt-6 flex items-center">
                <span className="mr-1">✦</span> Generated by Gemini AI — verify independently
              </p>
            </div>
            {/* Visual Flair */}
            <div className="absolute top-[-50%] right-[-10%] w-[400px] h-[400px] bg-accent-primary/10 blur-[100px] rounded-full" />
          </div>
        </motion.div>

      </div>
    </PageWrapper>
  );
};

const LegendItem = ({ color, label }: { color: string, label: string }) => (
  <div className="flex items-center space-x-2">
    <div className={`h-2 w-2 rounded-full ${color}`} />
    <span className="text-xs text-text-secondary">{label}</span>
  </div>
);
