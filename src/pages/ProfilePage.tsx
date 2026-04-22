/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { useNexoraStore } from '../store/nexoraStore';
import { Button } from '../components/shared/Button';
import { User, Shield, HardDrive, Trash2, Smartphone } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { profile, clearAll } = useNexoraStore();

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto space-y-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="h-24 w-24 rounded-full border-4 border-accent-primary p-1">
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile?.fullName || 'Nexora'}`}
                alt="Profile"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold">{profile?.fullName}</h2>
              <p className="text-text-secondary">{profile?.collegeName} • Sem {profile?.currentSemester}</p>
            </div>
          </div>
          <Button variant="outline">Edit Profile</Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <section className="nx-card p-8">
              <h3 className="font-bold mb-6 flex items-center">
                 <Shield className="h-5 w-5 mr-2 text-accent-secondary" />
                 Academic Identity
              </h3>
              <div className="space-y-4">
                 <InfoRow label="University" value={profile?.universityName || 'State Technical University'} />
                 <InfoRow label="Branch" value={profile?.branch || 'Not Specified'} />
                 <InfoRow label="Grading Scale" value={profile?.gradingScale || '10-point'} />
                 <InfoRow label="Annual Credits" value={String(profile?.totalCreditsPerSemester || 0)} />
              </div>
           </section>

           <section className="nx-card p-8">
              <h3 className="font-bold mb-6 flex items-center">
                 <Smartphone className="h-5 w-5 mr-2 text-accent-warm" />
                 App Settings
              </h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">AI Nudges</span>
                    <div className="w-10 h-5 bg-accent-secondary rounded-full relative">
                       <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                    </div>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Email Summaries</span>
                    <div className="w-10 h-5 bg-bg-elevated rounded-full relative">
                       <div className="absolute left-1 top-1 w-3 h-3 bg-text-secondary rounded-full" />
                    </div>
                 </div>
              </div>
           </section>

           <section className="col-span-full nx-card p-8 border-accent-danger/20 bg-accent-danger/5">
              <h3 className="font-bold mb-6 flex items-center text-accent-danger">
                 <HardDrive className="h-5 w-5 mr-2" />
                 Data Transparency
              </h3>
              <p className="text-sm text-text-secondary mb-6">
                 Your data is stored securely in Firebase. You can view exactly what is stored or purge it at any time.
                 Nexora does not sell your academic data.
              </p>
              <div className="flex flex-wrap gap-4">
                 <Button variant="ghost" className="text-xs">View Firestore Document</Button>
                 <Button variant="danger" size="sm" onClick={() => {
                    if(confirm("Are you sure? This will delete everything.")) {
                       clearAll();
                       window.location.href = '/';
                    }
                 }}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete All My Data
                 </Button>
              </div>
           </section>
        </div>
      </div>
    </PageWrapper>
  );
};

const InfoRow = ({ label, value }: { label: string, value: string }) => (
  <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
     <span className="text-sm text-text-secondary">{label}</span>
     <span className="text-sm font-medium">{value}</span>
  </div>
);
