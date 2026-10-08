'use client';

import React, { useState } from 'react';
import { useRecordActivityRequest } from '@/components/Navigation';
import RecordActivityModal from '@/components/RecordActivityModal';
import { 
  PlusCircle, Calendar, MapPin, CheckCircle, Leaf, 
  Sprout, TreePine, GraduationCap, Coins, BookOpen, 
  ShieldCheck, Share2, Sparkles, ArrowRight, Award,
  Users, CheckCircle2
} from 'lucide-react';
import { INITIAL_SPECIES, INITIAL_SEEDBEDS } from '@/services/kaiLedger';

const CFA_ACTIVITY_PILLARS = [
  {
    id: 'nursery',
    title: 'Seedling Production and Nursery Management',
    icon: Sprout,
    badge: 'Nursery Operations',
    color: 'from-emerald-500/20 to-teal-500/10',
    borderColor: 'border-emerald-500/30',
    accentColor: 'text-emerald-400',
    items: [
      'Participate in growing native tree seedlings in community nurseries',
      'Learn advanced techniques in seedling propagation',
      'Receive comprehensive training on best practices for seedling care'
    ]
  },
  {
    id: 'conservation',
    title: 'Forest Conservation and Restoration',
    icon: TreePine,
    badge: 'Ecological Restoration',
    color: 'from-green-500/20 to-emerald-500/10',
    borderColor: 'border-green-500/30',
    accentColor: 'text-green-400',
    items: [
      'Engage actively in tree planting activities',
      'Participate in forest rehabilitation projects',
      'Assist in monitoring forest health through regular assessments'
    ]
  },
  {
    id: 'capacity',
    title: 'Capacity Building and Training',
    icon: GraduationCap,
    badge: 'Skills & Development',
    color: 'from-amber-500/20 to-yellow-500/10',
    borderColor: 'border-amber-500/30',
    accentColor: 'text-[#e4c878]',
    items: [
      'Attend specialized workshops on forest management',
      'Learn about sustainable agricultural practices',
      'Develop skills in nursery management and tree propagation'
    ]
  },
  {
    id: 'benefit-sharing',
    title: 'Community Benefit Sharing',
    icon: Coins,
    badge: 'Livelihoods & Enterprise',
    color: 'from-amber-500/20 to-orange-500/10',
    borderColor: 'border-amber-500/30',
    accentColor: 'text-amber-300',
    items: [
      'Access opportunities for forest products through sharing mechanisms',
      'Participate in revenue-sharing programs',
      'Develop sustainable forest enterprises'
    ]
  },
  {
    id: 'education',
    title: 'Environmental Education',
    icon: BookOpen,
    badge: 'Awareness & Climate',
    color: 'from-cyan-500/20 to-blue-500/10',
    borderColor: 'border-cyan-500/30',
    accentColor: 'text-cyan-300',
    items: [
      'Participate in community awareness programs',
      'Learn about local ecosystem conservation',
      'Engage in environmental education initiatives',
      'Study climate change mitigation strategies'
    ]
  },
  {
    id: 'resource-management',
    title: 'Resource Access and Management',
    icon: ShieldCheck,
    badge: 'Governance & Rights',
    color: 'from-teal-500/20 to-emerald-500/10',
    borderColor: 'border-teal-500/30',
    accentColor: 'text-teal-300',
    items: [
      'Obtain permits for sustainable resource extraction',
      'Participate in forest management planning',
      'Contribute to decision-making processes'
    ]
  },
  {
    id: 'networking',
    title: 'Networking and Collaboration',
    icon: Share2,
    badge: 'Partnerships',
    color: 'from-purple-500/20 to-pink-500/10',
    borderColor: 'border-purple-500/30',
    accentColor: 'text-purple-300',
    items: [
      'Connect with other community forest user groups',
      'Share knowledge and best practices',
      'Collaborate on conservation projects'
    ]
  }
];

export default function ActivitiesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // The site menu's Record Activity opens this page's form.
  useRecordActivityRequest(() => setIsModalOpen(true));

  return (
    <div className="min-h-screen bg-[#0b1c14] text-[#f6f2e7] flex flex-col">

      {/* Hero Header Section */}
      <section className="bg-gradient-to-b from-[#122b1f] via-[#0e241a] to-[#0b1c14] border-b border-[#e4c878]/20 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e4c878_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-[#e4c878]/40 text-xs font-bold text-[#e4c878] uppercase tracking-widest shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-[#e4c878]" />
                <span>Field Stewardship &amp; CFA User Group</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
                Our Activities &amp; Roles
              </h1>
              <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal">
                As a <span className="text-[#e4c878] font-semibold">Community Forest Association (CFA) approved seedling user group members</span>, we play a crucial role in forest conservation, community development, and sustainable resource management.
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-[#e4c878] hover:bg-amber-300 text-neutral-950 transition-all shadow-xl hover:shadow-amber-500/20 flex items-center gap-2 shrink-0 transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Record Activity</span>
            </button>
          </div>
        </div>
      </section>

      {/* CFA Member Pillars & Responsibilities Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8 w-full flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b border-[#e4c878]/20">
          <div>
            <span className="text-[#e4c878] text-xs font-bold uppercase tracking-widest">Core Mandates</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">CFA Seedling User Group Roles &amp; Activities</h2>
          </div>
          <p className="text-xs text-gray-400 max-w-md">
            Key operational focus areas driving verified on-ground ecological restoration and youth livelihoods.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CFA_ACTIVITY_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={pillar.id}
                className={`p-6 rounded-2xl bg-gradient-to-b ${pillar.color} bg-[#122b1f]/90 border ${pillar.borderColor} hover:border-[#e4c878]/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between group`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center ${pillar.accentColor} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/40 text-gray-300 border border-white/10">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#e4c878] transition-colors leading-snug">
                    {pillar.title}
                  </h3>

                  <ul className="space-y-2.5 pt-2">
                    {pillar.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-200/90 leading-relaxed">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${pillar.accentColor}`} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <RecordActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        speciesList={INITIAL_SPECIES}
        seedbedList={INITIAL_SEEDBEDS}
        onAddActivity={() => {}}
      />
    </div>
  );
}

