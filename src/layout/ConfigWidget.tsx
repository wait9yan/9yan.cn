'use client';

import { useAtom } from 'jotai';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify-icon/react';
import clsx from 'clsx';
import { isConfigButtonVisibleAtom, isConfigPanelOpenAtom } from '@/hooks/use-config';
import AppearanceSwitcher from '@/layout/AppearanceSwitcher';
import PalettesSwitcher from '@/layout/PalettesSwitcher';
import Button from '@/components/Button';

export default function ConfigWidget({ className = '' }: { className?: string }) {
  const [isButtonVisible] = useAtom(isConfigButtonVisibleAtom);
  const [isPanelOpen, setIsPanelOpen] = useAtom(isConfigPanelOpenAtom);
  const configList: { label: string; icon: React.ReactNode; component: React.ReactNode }[] = [
    {
      label: '外观',
      icon: <Icon icon='lucide:sun-medium' />,
      component: <AppearanceSwitcher />,
    },
    {
      label: '色调',
      icon: <Icon icon='lucide:palette' />,
      component: <PalettesSwitcher />,
    },
    {
      label: '语言',
      icon: <Icon icon='lucide:languages' />,
      component: <span className='font-mono text-blue-600'>{process.env.APP_VERSION}</span>,
    },
  ];

  if (!isButtonVisible) return null;

  return (
    <div
      className={`fixed top-8 right-2 flex flex-col items-end gap-3 sm:right-4 lg:right-8 ${className}`}
    >
      <Button
        onClick={() => setIsPanelOpen((prev) => !prev)}
        className={clsx(
          'h-14 w-14 text-2xl shadow-lg',
          isPanelOpen ? 'bg-bg-1 text-text-2' : 'bg-primary-3 text-bg-1',
        )}
      >
        {isPanelOpen ? <Icon icon='lucide:x' /> : <Icon icon='lucide:settings' />}
      </Button>

      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -30, originY: 1, originX: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className='bg-bg-1 w-80 rounded-2xl p-5 shadow-2xl'
          >
            {/* 弹窗内容 */}
            <div className='border-bg-3 mb-4 flex items-center justify-between border-b pb-2'>
              <h3 className='text-text-1 flex items-center gap-2 font-bold'>
                <Icon icon='lucide:settings-2' /> 主题配置
              </h3>
            </div>

            <div className='space-y-3'>
              {configList.map((item) => (
                <div
                  key={item.label}
                  className='bg-bg-2 flex items-center justify-between rounded-lg p-2 text-sm'
                >
                  <span className='text-text-1 flex items-center gap-1'>
                    {item.icon} {item.label}
                  </span>
                  {item.component}
                </div>
              ))}

              <div className='pt-2'>
                <button
                  onClick={() => console.log('Cleaning local storage...')}
                  className='w-full rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition-colors duration-300 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-200'
                >
                  清除本地缓存
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
