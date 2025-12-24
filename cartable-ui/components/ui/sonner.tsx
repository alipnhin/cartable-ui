'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      // موقعیت موبایل: bottom-center تا زیر SMS notification قرار نگیرد
      position={isMobile ? 'bottom-center' : 'bottom-right'}
      // فاصله از پایین برای موبایل (برای جلوگیری از پنهان شدن پشت navigation)
      offset={isMobile ? '80px' : undefined}
      // مدت زمان نمایش بیشتر برای پیام‌های مهم (مثل OTP)
      duration={4000}
      // Rich colors و styling بهتر
      richColors
      // استایل‌های سفارشی با ظاهر حرفه‌ای‌تر
      className="group toaster [&_[data-type=success]>[data-icon]]:text-success [&_[data-type=success]_[data-title]]:text-success [&_[data-type=info]_[data-title]]:text-info [&_[data-type=error]>[data-icon]]:text-destructive [&_[data-type=error]_[data-title]]:text-destructive"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground! group-[.toaster]:border-border group-[.toaster]:shadow-2xl group-[.toaster]:rounded-lg group-[.toaster]:backdrop-blur-sm has-[[role=alert]]:border-0! has-[[role=alert]]:shadow-none! has-[[role=alert]]:bg-transparent!',
          description: 'group-[.toast]:text-muted-foreground group-[.toast]:text-sm',
          actionButton: 'group-[.toast]:rounded-md! group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:font-medium',
          cancelButton:
            'group-[.toast]:rounded-md! group-[.toast]:bg-secondary group-[.toast]:text-secondary-foreground! group-[.toast]:font-medium',
          // استایل‌های اضافی برای ظاهر بهتر
          title: 'group-[.toast]:font-semibold group-[.toast]:text-base',
          success: 'group-[.toaster]:border-success/20 group-[.toaster]:bg-success/5',
          error: 'group-[.toaster]:border-destructive/20 group-[.toaster]:bg-destructive/5',
          info: 'group-[.toaster]:border-info/20 group-[.toaster]:bg-info/5',
        },
      }}
      // z-index بالا برای اطمینان از نمایش روی سایر المان‌ها
      style={{ zIndex: 9999 }}
      {...props}
    />
  );
};

export { Toaster };
