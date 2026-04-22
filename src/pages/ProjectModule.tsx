/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/shared/Button';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, 
  Zap, 
  FileText, 
  Calendar, 
  ChevronRight, 
  ChevronDown,
  CheckCircle2,
  Clock,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { useNexoraStore } from '../store/nexoraStore';
import { 
  analyzeProjectScope, 
  generateMilestonePlan, 
  generateLiteratureReviewOutline 
} from '../services/geminiApi';

export const ProjectModule: React.FC = () => {
  const { project, setProject } = useNexoraStore();
  const [ideaInput, setIdeaInput] = useState(project?.title || '');
  const [scopeResults, setScopeResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [milestones, setMilestones] = useState<any[]>([]);
  const [isMilestoneLoading, setIsMilestoneLoading] = useState(false);

  const [literatureOutline, setLiteratureOutline] = useState<any>(null);
  const [isLitLoading, setIsLitLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!ideaInput) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeProjectScope(ideaInput);
      setScopeResults(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateMilestones = async () => {
    setIsMilestoneLoading(true);
    try {
      const result = await generateMilestonePlan(
        ideaInput, 
        project?.domain || 'Engineering', 
        project?.teamSize || 1,
        '2024-01-01',
        '2024-05-30'
      );
      setMilestones(result);
    } catch (error) {
       console.error(error);
    } finally {
       setIsMilestoneLoading(false);
    }
  };

  const handleGenerateLitOutline = async () => {
    setIsLitLoading(true);
    try {
      const result = await generateLiteratureReviewOutline(ideaInput, project?.domain || 'Engineering');
      setLiteratureOutline(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLitLoading(false);
    }
  };

  const radarData = scopeResults ? [
    { subject: 'Feasibility', A: scopeResults.feasibility, fullMark: 10 },
    { subject: 'Novelty', A: scopeResults.novelty, fullMark: 10 },
    { subject: 'Relevance', A: scopeResults.industryRelevance, fullMark: 10 },
    { subject: 'Academia', A: scopeResults.publishability, fullMark: 10 },
  ] : [];

  return (
    <PageWrapper>
      <div className="space-y-10 pb-20">
        
        <header>
          <h2 className="text-3xl font-bold">Project Command Centre</h2>
          <p className="text-text-secondary mt-1">From initial scope to final submission. Let AI guide your strategy.</p>
        </header>

        {/* 6A — Scope Radar (HERO FEATURE) */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          <section className="xl:col-span-3 nx-card p-8">
            <div className="flex items-center space-x-2 mb-6">
              <Target className="h-6 w-6 text-accent-primary" />
              <h3 className="text-xl font-bold">Scope Radar Analysis</h3>
            </div>
            
            <div className="space-y-4">
              <textarea 
                value={ideaInput}
                onChange={(e) => setIdeaInput(e.target.value)}
                placeholder="Type your project idea here... (e.g. 'IoT based smart agriculture system using LoRa')"
                className="w-full h-32 bg-bg-base border border-border rounded-2xl p-6 text-text-primary outline-none focus:border-accent-primary transition-all resize-none"
              />
              <Button 
                onClick={handleAnalyze} 
                isLoading={isAnalyzing}
                disabled={!ideaInput}
                className="w-full h-14"
              >
                <Zap className="h-5 w-5 mr-2" />
                Analyze Project with AI
              </Button>
            </div>

            <AnimatePresence>
              {scopeResults && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="var(--color-border)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
                        <Radar
                          name="Scope"
                          dataKey="A"
                          stroke="var(--color-accent-primary)"
                          fill="var(--color-accent-primary)"
                          fillOpacity={0.6}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-bg-elevated border border-accent-primary/20">
                       <span className="text-xs text-accent-primary font-bold uppercase tracking-widest">AI Verdict</span>
                       <p className="text-sm text-text-primary mt-2 font-medium leading-relaxed">{scopeResults.overallVerdict}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       <ScoreChip label="Feasibility" value={scopeResults.feasibility} reason={scopeResults.feasibilityReason} />
                       <ScoreChip label="Novelty" value={scopeResults.novelty} reason={scopeResults.noveltyReason} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <aside className="xl:col-span-2 space-y-8">
             <div className="nx-card p-8">
                <h4 className="font-bold mb-4 flex items-center">
                   <Zap className="h-4 w-4 mr-2 text-accent-warm" />
                   AI Scoped Alternatives
                </h4>
                <div className="space-y-3">
                   {scopeResults?.alternativeIdeas?.map((alt: string, i: number) => (
                      <button 
                        key={i} 
                        onClick={() => setIdeaInput(alt)}
                        className="w-full text-left p-4 rounded-xl bg-bg-base border border-border hover:border-accent-primary hover:text-accent-primary transition-all text-sm group"
                      >
                         {alt}
                         <ChevronRight className="h-4 w-4 float-right opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                   )) || <p className="text-text-secondary text-sm italic">Analyze an idea to see scoped alternatives.</p>}
                </div>
                <p className="text-[10px] text-text-secondary mt-8 flex items-center">
                  <span className="mr-1">✦</span> Generated by Gemini — verify independently
                </p>
             </div>
          </aside>
        </div>

        {/* 6B — Milestone Planner & 6C — Lit Review */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <section className="nx-card p-8">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2">
                   <Calendar className="h-6 w-6 text-accent-secondary" />
                   <h3 className="text-xl font-bold">Milestone Roadmap</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={handleGenerateMilestones} isLoading={isMilestoneLoading}>
                   Generate Roadmap
                </Button>
             </div>

             <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-0 before:w-0.5 before:bg-border">
                {milestones.length > 0 ? milestones.map((m, i) => (
                   <div key={i} className="relative pl-12">
                      <div className="absolute left-0 top-1 h-9 w-9 bg-bg-surface border-4 border-bg-base rounded-full flex items-center justify-center z-10">
                         {i === 0 ? <CheckCircle2 className="h-4 w-4 text-accent-secondary" /> : <Clock className="h-4 w-4 text-text-secondary" />}
                      </div>
                      <div className="flex items-start justify-between">
                         <div>
                            <h5 className="font-bold text-text-primary">Week {m.week}: {m.title}</h5>
                            <p className="text-sm text-text-secondary mt-1">{m.description}</p>
                            <span className="inline-block mt-3 px-2 py-0.5 rounded bg-bg-elevated text-[10px] text-text-secondary font-bold uppercase">{m.category}</span>
                         </div>
                         <div className="mt-1">
                            <input type="checkbox" className="w-5 h-5 accent-accent-secondary bg-transparent border-border rounded" />
                         </div>
                      </div>
                   </div>
                )) : (
                   <div className="py-12 text-center text-text-secondary italic">
                      Click Generate to visualize your 16-week engineering roadmap.
                   </div>
                )}
             </div>
          </section>

          <section className="nx-card p-8 h-fit">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2">
                   <FileText className="h-6 w-6 text-accent-warm" />
                   <h3 className="text-xl font-bold">Literature Review Outline</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={handleGenerateLitOutline} isLoading={isLitLoading}>
                   Build Outline
                </Button>
             </div>

             <div className="space-y-4">
                {literatureOutline?.sections ? literatureOutline.sections.map((section: any, i: number) => (
                   <details key={i} className="group nx-card border-none bg-bg-base overflow-hidden">
                      <summary className="flex items-center justify-between p-4 cursor-pointer list-none hover:bg-bg-elevated transition-colors">
                         <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-lg bg-accent-warm/10 flex items-center justify-center text-accent-warm font-bold text-sm">
                               {i + 1}
                            </div>
                            <span className="font-medium">{section.title}</span>
                         </div>
                         <ChevronDown className="h-4 w-4 text-text-secondary group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="px-14 pb-4 pt-2 space-y-4">
                         <div className="flex flex-wrap gap-2">
                            {section.keyTopics.map((topic: string, j: number) => (
                               <span key={j} className="px-3 py-1 rounded-full bg-bg-elevated text-xs text-text-primary border border-border">
                                  {topic}
                               </span>
                            ))}
                         </div>
                         <div className="flex items-center text-xs text-text-secondary">
                            <BookOpen className="h-3 w-3 mr-1" />
                            Suggested: {section.suggestedSources || 5} research papers
                         </div>
                      </div>
                   </details>
                )) : (
                   <div className="py-12 text-center text-text-secondary italic">
                      Automate your research structure with Gemini AI.
                   </div>
                )}
             </div>
          </section>

        </div>

      </div>
    </PageWrapper>
  );
};

const ScoreChip = ({ label, value, reason }: { label: string, value: number, reason: string }) => (
  <div className="p-4 rounded-xl bg-bg-base border border-border">
    <div className="flex items-center justify-between mb-1">
       <span className="text-xs text-text-secondary">{label}</span>
       <span className={`text-xs font-bold ${value > 7 ? 'text-accent-secondary' : 'text-accent-warm'}`}>{value}/10</span>
    </div>
    <div className="h-1 w-full bg-bg-elevated rounded-full mb-3">
       <div className={`h-full ${value > 7 ? 'bg-accent-secondary' : 'bg-accent-warm'}`} style={{ width: `${value * 10}%` }} />
    </div>
    <p className="text-[10px] text-text-secondary italic leading-tight line-clamp-2">{reason}</p>
  </div>
);
