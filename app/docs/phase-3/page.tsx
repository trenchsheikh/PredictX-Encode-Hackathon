'use client';

import { useTranslation } from 'react-i18next';
import '@/lib/i18n';
import { Clock, Construction } from 'lucide-react';

export default function Phase3Page() {
  const { t } = useTranslation();

  return (
    <div className="prose prose-invert max-w-none">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-orange-600/20">
          <Construction className="h-12 w-12 text-orange-400" />
        </div>
        <h1 className="mb-4 text-3xl font-bold text-white">
          {t('docs.phase_3.title', 'Phase 3: Coming Soon')}
        </h1>
        <p className="text-lg leading-relaxed text-gray-300">
          {t(
            'docs.phase_3.description',
            'Future phases will be announced as we complete our current scalability and performance roadmap.'
          )}
        </p>
      </div>

      <div className="flex justify-center">
        <div className="rounded-lg bg-gradient-to-r from-orange-600/20 to-red-600/20 p-12 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-600/30">
            <Clock className="h-8 w-8 text-orange-400" />
          </div>
          <h2 className="mb-4 text-2xl font-semibold text-white">
            {t('docs.phase_3.coming_soon.title', 'Coming Soon')}
          </h2>
          <p className="mb-6 text-lg text-gray-300">
            {t(
              'docs.phase_3.coming_soon.description',
              'We are currently focused on building the infrastructure and scalability systems outlined in our current roadmap. Future phases will be announced as we complete our current milestones.'
            )}
          </p>
          <p className="text-sm text-gray-400">
            {t(
              'docs.phase_3.coming_soon.note',
              'Stay tuned for updates on our progress and upcoming features.'
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
