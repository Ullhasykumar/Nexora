/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../components/shared/Button';
import { ChevronRight, ChevronLeft, GraduationCap, BookOpen, Target, Sparkles } from 'lucide-react';
import { useNexoraStore } from '../store/nexoraStore';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

export const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const { setProfile, setCurrentSemesterSubjects, setProject } = useNexoraStore();
  const navigate = useNavigate();

  const [tempProfile, setTempProfile] = useState({
    fullName: '',
    collegeName: '',
    branch: 'CSE',
    currentSemester: 6,
    totalCreditsPerSemester: 24,
    gradingScale: '10-point' as const,
    universityName: ''
  });

  const [tempSubjects, setTempSubjects] = useState([
    { id: '1', name: 'Software Engineering', credits: 4, maxInternal: 30, maxExternal: 70, internalScore: 0 },
    { id: '2', name: 'Microprocessors', credits: 4, maxInternal: 30, maxExternal: 70, internalScore: 0 },
    { id: '3', name: 'Computer Networks', credits: 4, maxInternal: 30, maxExternal: 70, internalScore: 0 },
  ]);

  const [tempProject, setTempProject] = useState({
    title: '',
    teamSize: 3,
    domain: 'AI/ML',
    hardware: '',
    startMonth: 'January',
    deadlineMonth: 'May',
    milestones: []
  });

  const handleFinish = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      // Save to Firestore
      await setDoc(doc(db, 'users', user.uid, 'profile', 'data'), {
        ...tempProfile,
        updatedAt: new Date().toISOString(),
      });

      // Save subjects (briefly for now, in a real app we'd use a collection)
      // For MVP, we'll keep it simple
      
      setProfile(tempProfile);
      setCurrentSemesterSubjects(tempSubjects);
      setProject(tempProject);
      navigate('/dashboard');
    } catch (error) {
      console.error("Error saving onboarding data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-primary/5 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-secondary/5 blur-[100px] rounded-full" />

      <div className="w-full max-w-2xl relative z-10">
        {/* Progress Bar */}
        <div className="flex items-center justify-center space-x-12 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="relative flex flex-col items-center">
               <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${step >= s ? 'bg-accent-primary text-white scale-110 shadow-lg shadow-accent-primary/20' : 'bg-bg-elevated text-text-secondary border border-border'}`}>
                  {step > s ? '✓' : s}
               </div>
               <span className={`text-[10px] uppercase tracking-widest mt-3 font-bold transition-colors ${step >= s ? 'text-accent-primary' : 'text-text-secondary'}`}>
                  {s === 1 ? 'Profile' : s === 2 ? 'Subjects' : 'Project'}
               </span>
            </div>
          ))}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-48 h-0.5 bg-border -z-10" />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="nx-card p-10 space-y-8"
            >
              <div className="text-center">
                 <GraduationCap className="h-12 w-12 text-accent-primary mx-auto mb-4" />
                 <h2 className="text-3xl font-bold">Academic Profile</h2>
                 <p className="text-text-secondary mt-1">First, let's map your academic territory.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <InputGroup label="Full Name" value={tempProfile.fullName} onChange={v => setTempProfile({...tempProfile, fullName: v})} placeholder="Enter your name" />
                 <InputGroup label="College Name" value={tempProfile.collegeName} onChange={v => setTempProfile({...tempProfile, collegeName: v})} placeholder="ABC Engineering College" />
                 <div className="space-y-2">
                    <label className="text-xs text-text-secondary uppercase tracking-widest font-bold">Branch</label>
                    <select 
                      value={tempProfile.branch}
                      onChange={e => setTempProfile({...tempProfile, branch: e.target.value})}
                      className="w-full h-12 bg-bg-base border border-border rounded-xl px-4 text-text-primary focus:ring-2 focus:ring-accent-primary outline-none appearance-none"
                    >
                       <option>CSE</option>
                       <option>ECE</option>
                       <option>EEE</option>
                       <option>Civil</option>
                       <option>Mech</option>
                       <option>Other</option>
                    </select>
                 </div>
                 <InputGroup label="Current Semester" type="number" value={tempProfile.currentSemester} onChange={v => setTempProfile({...tempProfile, currentSemester: parseInt(v)})} />
              </div>

              <Button className="w-full h-14" onClick={() => setStep(2)} disabled={!tempProfile.fullName || !tempProfile.collegeName}>
                 Continue
                 <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="nx-card p-10 space-y-8"
            >
              <div className="text-center">
                 <BookOpen className="h-12 w-12 text-accent-secondary mx-auto mb-4" />
                 <h2 className="text-3xl font-bold">Semester Subjects</h2>
                 <p className="text-text-secondary mt-1">Add your subjects for the current semester.</p>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                 {tempSubjects.map((sub, i) => (
                    <div key={sub.id} className="p-4 rounded-xl bg-bg-base border border-border group">
                       <div className="flex items-center justify-between mb-4">
                          <input 
                            value={sub.name}
                            onChange={(e) => {
                               const next = [...tempSubjects];
                               next[i].name = e.target.value;
                               setTempSubjects(next);
                            }}
                            className="bg-transparent font-bold text-text-primary outline-none flex-1 mr-4 border-b border-transparent focus:border-accent-secondary"
                            placeholder="Subject Name"
                          />
                          <Button variant="ghost" size="icon" onClick={() => setTempSubjects(tempSubjects.filter(s => s.id !== sub.id))} className="text-accent-danger/50 hover:text-accent-danger">
                             ×
                          </Button>
                       </div>
                       <div className="flex space-x-6">
                          <div className="space-y-1">
                             <label className="text-[10px] text-text-secondary uppercase">Credits</label>
                             <input type="number" value={sub.credits} onChange={e => {
                                const next = [...tempSubjects];
                                next[i].credits = parseInt(e.target.value);
                                setTempSubjects(next);
                             }} className="w-16 bg-bg-elevated rounded px-2 py-1 text-xs outline-none" />
                          </div>
                          <div className="space-y-1">
                             <label className="text-[10px] text-text-secondary uppercase">Max Internal</label>
                             <input type="number" value={sub.maxInternal} onChange={e => {
                                const next = [...tempSubjects];
                                next[i].maxInternal = parseInt(e.target.value);
                                setTempSubjects(next);
                             }} className="w-16 bg-bg-elevated rounded px-2 py-1 text-xs outline-none" />
                          </div>
                       </div>
                    </div>
                 ))}
                 <Button variant="outline" className="w-full border-dashed border-2" onClick={() => setTempSubjects([...tempSubjects, { id: Math.random().toString(), name: '', credits: 4, maxInternal: 30, maxExternal: 70, internalScore: 0 }])}>
                    + Add Subject
                 </Button>
              </div>

              <div className="flex space-x-4">
                 <Button variant="ghost" onClick={() => setStep(1)} className="w-24">
                    Back
                 </Button>
                 <Button className="flex-1 h-14" onClick={() => setStep(3)}>
                    Set Up Project
                    <ChevronRight className="ml-2 h-5 w-5" />
                 </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="nx-card p-10 space-y-8"
            >
              <div className="text-center">
                 <Target className="h-12 w-12 text-accent-warm mx-auto mb-4" />
                 <h2 className="text-3xl font-bold">Project Setup</h2>
                 <p className="text-text-secondary mt-1">Optional. You can always set this up later.</p>
              </div>

              <div className="space-y-6">
                 <InputGroup label="Project Title" value={tempProject.title} onChange={v => setTempProject({...tempProject, title: v})} placeholder="e.g. Smart Water Management" />
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs text-text-secondary uppercase tracking-widest font-bold">Domain</label>
                       <select 
                         value={tempProject.domain}
                         onChange={e => setTempProject({...tempProject, domain: e.target.value})}
                         className="w-full h-12 bg-bg-base border border-border rounded-xl px-4 text-text-primary outline-none"
                       >
                          <option>AI/ML</option>
                          <option>IoT</option>
                          <option>Web Dev</option>
                          <option>Other</option>
                       </select>
                    </div>
                    <InputGroup label="Team Size" type="number" value={tempProject.teamSize} onChange={v => setTempProject({...tempProject, teamSize: parseInt(v)})} />
                 </div>
              </div>

              <div className="flex space-x-4">
                 <Button variant="ghost" onClick={() => setStep(2)} className="w-24">
                    Back
                 </Button>
                 <Button className="flex-1 h-14 bg-gradient-to-r from-accent-primary to-accent-secondary border-none" onClick={handleFinish}>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Finish Setup
                 </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const InputGroup = ({ label, value, onChange, placeholder, type = 'text' }: { label: string, value: any, onChange: (v: string) => void, placeholder?: string, type?: string }) => (
  <div className="space-y-2">
    <label className="text-xs text-text-secondary uppercase tracking-widest font-bold">{label}</label>
    <input 
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full h-12 bg-bg-base border border-border rounded-xl px-4 text-text-primary focus:ring-2 focus:ring-accent-primary outline-none transition-all"
      placeholder={placeholder}
    />
  </div>
);
