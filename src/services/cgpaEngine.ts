/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Subject {
  id: string;
  name: string;
  credits: number;
  maxInternal: number;
  maxExternal: number;
  internalScore: number;
  externalScore?: number;
  targetGrade?: string;
}

export interface Semester {
  id: string;
  name: string;
  subjects: Subject[];
  sgpa?: number;
}

export interface SubjectRank {
  subject: Subject;
  impact: number;
}

const GRADE_POINTS: Record<string, number> = {
  'O': 10,
  'A+': 9,
  'A': 8,
  'B+': 7,
  'B': 6,
  'C': 5,
  'F': 0
};

export function calculateSGPA(subjects: Subject[]): number {
  let totalCredits = 0;
  let weightedPoints = 0;

  subjects.forEach(sub => {
    const totalMarks = sub.internalScore + (sub.externalScore || 0);
    const maxMarks = sub.maxInternal + sub.maxExternal;
    const percentage = (totalMarks / maxMarks) * 100;

    let gradePoint = 0;
    if (percentage >= 90) gradePoint = 10;
    else if (percentage >= 80) gradePoint = 9;
    else if (percentage >= 70) gradePoint = 8;
    else if (percentage >= 60) gradePoint = 7;
    else if (percentage >= 50) gradePoint = 6;
    else if (percentage >= 40) gradePoint = 5;
    else gradePoint = 0;

    weightedPoints += gradePoint * sub.credits;
    totalCredits += sub.credits;
  });

  return totalCredits === 0 ? 0 : Number((weightedPoints / totalCredits).toFixed(2));
}

export function calculateCGPA(semesters: { sgpa: number, credits: number }[]): number {
  let totalCredits = 0;
  let weightedSGPA = 0;

  semesters.forEach(sem => {
    weightedSGPA += sem.sgpa * sem.credits;
    totalCredits += sem.credits;
  });

  return totalCredits === 0 ? 0 : Number((weightedSGPA / totalCredits).toFixed(2));
}

export function calculateMinMarks(subject: Subject, targetGrade: string): number {
  const targetPoint = GRADE_POINTS[targetGrade] || 0;
  const maxTotal = subject.maxInternal + subject.maxExternal;
  
  // Inverse percentage for target point
  // 10 pts -> 90%, 9 pts -> 80% etc.
  const targetPercentage = targetPoint === 0 ? 0 : (targetPoint + 8) * 10; 
  // Wait, standard scale: 10(90+), 9(80-89), 8(70-79)...
  // Target percentage for grade point P is roughly (P-1)*10 + ... no.
  // 10 -> 90, 9 -> 80, 8 -> 70, 7 -> 60, 6 -> 50, 5 -> 40
  const minRequiredPercentage = targetPoint === 10 ? 90 : (targetPoint + 0) * 10 + (targetPoint === 0 ? 0 : -10);
  // Adjusted: 10->90, 9->80, 8->70, 7->60, 6->50, 5->40
  const actualTargetPercent = Math.max(0, (targetPoint + 4) * 10 - 50); // simplified example logic
  
  // Let's use a simpler mapping for the demo
  const gradeToMinPercent: Record<string, number> = {
    'O': 90, 'A+': 80, 'A': 70, 'B+': 60, 'B': 50, 'C': 40
  };
  
  const minPercent = gradeToMinPercent[targetGrade] || 0;
  const minRequiredTotalMarks = (minPercent / 100) * maxTotal;
  const minExternalRequired = minRequiredTotalMarks - subject.internalScore;

  return Number(Math.max(0, minExternalRequired).toFixed(1));
}

export function rankSubjectsByImpact(subjects: Subject[]): SubjectRank[] {
  return subjects.map(sub => {
    // Impact = Credits * Remaining score opportunity
    const maxTotal = sub.maxInternal + sub.maxExternal;
    const currentTotal = sub.internalScore + (sub.externalScore || 0);
    const impact = sub.credits * (maxTotal - currentTotal);
    return { subject: sub, impact };
  }).sort((a, b) => b.impact - a.impact);
}

export function projectCGPA(subjects: Subject[], hypotheticalMarks: Record<string, number>): number {
  const projectedSubjects = subjects.map(sub => ({
    ...sub,
    externalScore: hypotheticalMarks[sub.id] || sub.externalScore
  }));
  return calculateSGPA(projectedSubjects);
}
