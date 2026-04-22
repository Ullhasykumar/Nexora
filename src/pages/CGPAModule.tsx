/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { useNexoraStore } from '../store/nexoraStore';
import { Button } from '../components/shared/Button';
import { motion } from 'motion/react';
import { 
  Plus, 
  Settings2, 
  Trash2, 
  Edit3, 
  Save, 
  Info, 
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { 
  calculateSGPA, 
  calculateMinMarks, 
  rankSubjectsByImpact,
  Subject
} from '../services/cgpaEngine';
import { Modal } from '../components/shared/Modal';

export const CGPAModule: React.FC = () => {
  const { currentSemesterSubjects, updateSubjectMarks, setCurrentSemesterSubjects } = useNexoraStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  
  // Time Machine State
  const [simulatedMarks, setSimulatedMarks] = useState<Record<string, number>>({});
  const [projectedSGPA, setProjectedSGPA] = useState(0);

  useEffect(() => {
    // Initialize simulated marks with current external scores or 0
    const initial: Record<string, number> = {};
    currentSemesterSubjects.forEach(s => {
      initial[s.id] = s.externalScore || 0;
    });
    setSimulatedMarks(initial);
  }, [currentSemesterSubjects]);

  useEffect(() => {
    const subjectsWithSimulation = currentSemesterSubjects.map(s => ({
      ...s,
      externalScore: simulatedMarks[s.id] || 0
    }));
    setProjectedSGPA(calculateSGPA(subjectsWithSimulation));
  }, [simulatedMarks, currentSemesterSubjects]);

  const handleSimulateChange = (id: string, value: number) => {
    setSimulatedMarks(prev => ({ ...prev, [id]: value }));
  };

  const rankedImpact = rankSubjectsByImpact(currentSemesterSubjects);

  return (
    <PageWrapper>
      <div className="space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-text-primary">CGPA Module</h2>
            <p className="text-text-secondary mt-1">Manage your current semester performance and simulate future outcomes.</p>
          </div>
          <div className="flex items-center space-x-3">
             <Button variant="outline" onClick={() => {}}>
                <Settings2 className="h-4 w-4 mr-2" />
                Configure Scales
             </Button>
             <Button onClick={() => setIsEditModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Subject
             </Button>
          </div>
        </div>

        {/* 5C — CGPA Time Machine (HERO FEATURE) */}
        <section className="nx-card p-1 overflow-hidden">
           <div className="bg-gradient-to-br from-accent-primary/20 via-transparent to-accent-secondary/20 p-8 rounded-[14px]">
              <div className="flex flex-col lg:flex-row gap-12">
                 {/* Left Panel: Sliders */}
                 <div className="flex-1 space-y-8">
                    <div className="flex items-center space-x-2 mb-2">
                       <Cpu className="h-5 w-5 text-accent-primary" />
                       <h3 className="text-xl font-bold italic">CGPA Time Machine</h3>
                    </div>
                    <div className="space-y-6">
                       {currentSemesterSubjects.map((sub) => (
                          <div key={sub.id} className="space-y-2">
                             <div className="flex justify-between text-sm">
                                <span className="font-medium">{sub.name}</span>
                                <span className="text-text-secondary font-mono">{simulatedMarks[sub.id] || 0} / {sub.maxExternal}</span>
                             </div>
                             <input 
                                type="range"
                                min="0"
                                max={sub.maxExternal}
                                value={simulatedMarks[sub.id] || 0}
                                onChange={(e) => handleSimulateChange(sub.id, parseInt(e.target.value))}
                                className="w-full h-1.5 bg-bg-elevated rounded-lg appearance-none cursor-pointer accent-accent-primary"
                             />
                          </div>
                       ))}
                       {currentSemesterSubjects.length === 0 && <p className="text-text-secondary italic">Add subjects to start simulating.</p>}
                    </div>
                 </div>

                 {/* Right Panel: Results */}
                 <div className="lg:w-96 space-y-6">
                    <div className="nx-card p-6 bg-bg-base/60 backdrop-blur-md border-accent-primary/30">
                       <span className="text-xs text-text-secondary uppercase tracking-widest font-bold">Projected SGPA</span>
                       <div className="text-6xl font-black text-accent-primary mt-2 flex items-baseline">
                          {projectedSGPA.toFixed(2)}
                          <span className="text-2xl text-text-secondary ml-2 font-medium">/ 10.0</span>
                       </div>
                       <p className="text-sm text-text-secondary mt-4">
                          Based on your simulated external exam scores and current internals.
                       </p>
                    </div>

                    <div className="nx-card p-6 border-accent-secondary/30">
                       <h4 className="text-sm font-bold flex items-center mb-4">
                          <TrendingUp className="h-4 w-4 mr-2 text-accent-secondary" />
                          Maximum Impact Strategy
                       </h4>
                       <div className="space-y-3">
                          {rankedImpact.slice(0, 2).map((item, i) => (
                             <div key={i} className="flex items-center justify-between text-sm">
                                <span className="text-text-secondary">{item.subject.name}</span>
                                <span className="text-accent-secondary font-bold">+{ (item.impact / 100).toFixed(2) } Potential</span>
                             </div>
                          ))}
                       </div>
                       <p className="text-[10px] text-text-secondary mt-4 italic">
                          *Ranked by credit weight and current performance gap.
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* 5A — Subject Cards Grid */}
        <section>
          <h3 className="text-xl font-bold mb-6">Current Semester Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentSemesterSubjects.map((sub) => (
              <SubjectCard 
                key={sub.id} 
                subject={sub} 
                onEdit={() => {
                  setSelectedSubjectId(sub.id);
                  setIsEditModalOpen(true);
                }} 
              />
            ))}
          </div>
        </section>

      </div>

      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title={selectedSubjectId ? "Edit Subject" : "Add New Subject"}
      >
        <MockSubjectForm 
          subject={currentSemesterSubjects.find(s => s.id === selectedSubjectId)}
          onSave={(data) => {
             if (selectedSubjectId) {
                setCurrentSemesterSubjects(currentSemesterSubjects.map(s => s.id === selectedSubjectId ? { ...s, ...data } : s));
             } else {
                setCurrentSemesterSubjects([...currentSemesterSubjects, { ...data, id: Math.random().toString(36).substr(2, 9) }]);
             }
             setIsEditModalOpen(false);
          }}
        />
      </Modal>
    </PageWrapper>
  );
};

const SubjectCard = ({ subject, onEdit }: any) => {
  const internalPerc = (subject.internalScore / subject.maxInternal) * 100;
  
  // Calculate min marks for a target (B+)
  const minForBPlus = calculateMinMarks(subject, 'B+');

  return (
    <motion.div 
      layout
      className="nx-card p-6 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="font-bold text-text-primary text-lg">{subject.name}</h4>
            <span className="inline-block px-2 py-0.5 rounded-lg bg-bg-elevated text-xs text-text-secondary font-mono mt-1">
              {subject.credits} Credits
            </span>
          </div>
          <div className="px-2 py-1 rounded bg-accent-secondary/10 text-accent-secondary text-[10px] font-bold uppercase tracking-wider">
             Safe
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-text-secondary">Internal Score</span>
              <span className="text-text-primary font-mono">{subject.internalScore} / {subject.maxInternal}</span>
            </div>
            <div className="h-1.5 w-full bg-bg-elevated rounded-full overflow-hidden">
               <div className="h-full bg-accent-primary" style={{ width: `${internalPerc}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-border mt-auto">
        <p className="text-xs text-text-secondary">
          Min goal: <span className="text-accent-warm font-bold">{minForBPlus} / {subject.maxExternal}</span> in Final to hit B+ grade
        </p>
        <div className="flex items-center justify-between mt-4">
           <Button variant="ghost" size="sm" onClick={onEdit} className="text-xs">
              <Edit3 className="h-3 w-3 mr-1" /> Edit
           </Button>
           <Button variant="ghost" size="sm" className="text-xs text-accent-danger/70 hover:text-accent-danger">
              <Trash2 className="h-3 w-3" />
           </Button>
        </div>
      </div>
    </motion.div>
  );
};

const MockSubjectForm = ({ subject, onSave }: { subject?: any, onSave: (data: any) => void }) => {
  const [formData, setFormData] = useState(subject || {
    name: '',
    credits: 4,
    maxInternal: 30,
    maxExternal: 70,
    internalScore: 0,
    externalScore: 0
  });

  return (
    <div className="space-y-6">
       <div className="space-y-2">
          <label className="text-sm text-text-secondary">Subject Name</label>
          <input 
            type="text" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-text-primary focus:border-accent-primary outline-none"
            placeholder="e.g. Database Management Systems"
          />
       </div>
       <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
             <label className="text-sm text-text-secondary">Credits</label>
             <input 
               type="number" 
               value={formData.credits} 
               onChange={e => setFormData({...formData, credits: parseInt(e.target.value)})}
               className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-text-primary outline-none"
             />
          </div>
          <div className="space-y-2">
             <label className="text-sm text-text-secondary">Internal Score</label>
             <input 
               type="number" 
               value={formData.internalScore} 
               onChange={e => setFormData({...formData, internalScore: parseInt(e.target.value)})}
               className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-text-primary outline-none"
             />
          </div>
       </div>
       <Button className="w-full h-12 text-lg" onClick={() => onSave(formData)}>
          <Save className="h-5 w-5 mr-2" />
          Save Subject
       </Button>
    </div>
  );
};
