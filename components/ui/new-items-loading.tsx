'use client';

import { useI18n } from '@/components/providers/i18n-provider';

function NewItemsLoading() {
  const { t } = useI18n();
  const item = {
    href: '/#all-markets',
    title: t('darkpool_betting'),
  };

  return (
    <a
      href={item.href}
      className="mx-auto inline-flex w-fit items-center justify-center gap-1 rounded-full border-4 border-yellow-400/20 bg-yellow-500/20 py-0.5 pl-1 pr-3 text-xs shadow-[0_0_0_1px_rgba(234,179,8,0.15)]"
    >
      <div className="rounded-full bg-yellow-300 px-2 py-1 text-xs font-medium text-black">
        {t('badge_live')}
      </div>
      <p className="inline-block text-xs text-yellow-100 sm:text-base">
        ✨ {t('badge_introducing')}{' '}
        <span className="px-1 font-semibold text-yellow-200">{item.title}</span>
      </p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        data-slot="icon"
        className="h-3 w-3 text-yellow-200"
      >
        <path
          fillRule="evenodd"
          d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
          clipRule="evenodd"
        />
      </svg>
    </a>
  );
}

export default NewItemsLoading;
