import {
  cn,
  formatNumber,
  touchTargetClasses,
  withTouchTarget,
  isMobile,
  getResponsiveTouchSize,
} from '@/lib/utils';

describe('lib/utils', () => {
  describe('cn', () => {
    it('should merge class names', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'conditional')).toBe('base conditional');
      expect(cn('base', false && 'conditional')).toBe('base');
    });

    it('should merge tailwind classes and resolve conflicts', () => {
      expect(cn('px-2', 'px-4')).toBe('px-4');
    });

    it('should handle arrays', () => {
      expect(cn(['class1', 'class2'])).toBe('class1 class2');
    });

    it('should handle objects', () => {
      expect(cn({ class1: true, class2: false })).toBe('class1');
    });

    it('should handle undefined and null', () => {
      expect(cn('class1', undefined, null, 'class2')).toBe('class1 class2');
    });
  });

  describe('formatNumber', () => {
    it('should format number with Persian digits', () => {
      expect(formatNumber(0)).toBe('۰');
      expect(formatNumber(1)).toBe('۱');
      expect(formatNumber(9)).toBe('۹');
    });

    it('should format number with thousand separators', () => {
      expect(formatNumber(1000)).toBe('۱,۰۰۰');
      expect(formatNumber(1234567)).toBe('۱,۲۳۴,۵۶۷');
    });

    it('should handle negative numbers', () => {
      expect(formatNumber(-1234)).toBe('-۱,۲۳۴');
    });

    it('should handle decimal numbers', () => {
      const result = formatNumber(1234.56);
      expect(result).toContain('۱,۲۳۴');
    });

    it('should handle zero', () => {
      expect(formatNumber(0)).toBe('۰');
    });

    it('should handle large numbers', () => {
      expect(formatNumber(1000000)).toBe('۱,۰۰۰,۰۰۰');
    });

    it('should convert all digits correctly', () => {
      const result = formatNumber(1234567890);
      expect(result).toBe('۱,۲۳۴,۵۶۷,۸۹۰');
    });
  });

  describe('touchTargetClasses', () => {
    it('should have correct minimum touch classes', () => {
      expect(touchTargetClasses.minTouch).toBe('min-h-[44px]');
      expect(touchTargetClasses.minTouchMd).toBe('min-h-[48px]');
    });

    it('should have correct exact touch classes', () => {
      expect(touchTargetClasses.touch).toBe('h-[44px]');
      expect(touchTargetClasses.touchMd).toBe('h-[48px]');
    });

    it('should have expand touch class', () => {
      expect(touchTargetClasses.expandTouch).toContain('after:content-');
      expect(touchTargetClasses.expandTouch).toContain('after:absolute');
    });

    it('should have touch spacing class', () => {
      expect(touchTargetClasses.touchSpacing).toBe('gap-2');
    });
  });

  describe('withTouchTarget', () => {
    it('should add default min height (44px)', () => {
      const result = withTouchTarget('px-4');
      expect(result).toContain('min-h-[44px]');
      expect(result).toContain('px-4');
    });

    it('should add 48px min height when specified', () => {
      const result = withTouchTarget('px-4', { minHeight: '48px' });
      expect(result).toContain('min-h-[48px]');
      expect(result).toContain('px-4');
    });

    it('should add expand class when specified', () => {
      const result = withTouchTarget('px-4', { expand: true });
      expect(result).toContain('after:content-');
      expect(result).toContain('px-4');
    });

    it('should handle both minHeight and expand options', () => {
      const result = withTouchTarget('px-4', { minHeight: '48px', expand: true });
      expect(result).toContain('min-h-[48px]');
      expect(result).toContain('after:content-');
      expect(result).toContain('px-4');
    });

    it('should work with empty base classes', () => {
      const result = withTouchTarget('');
      expect(result).toContain('min-h-[44px]');
    });

    it('should merge classes properly', () => {
      const result = withTouchTarget('flex items-center', { minHeight: '44px' });
      expect(result).toContain('flex');
      expect(result).toContain('items-center');
      expect(result).toContain('min-h-[44px]');
    });
  });

  describe('isMobile', () => {
    it('should return false in server-side rendering', () => {
      expect(isMobile()).toBe(false);
    });

    it('should detect mobile viewport', () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });
      expect(isMobile()).toBe(true);
    });

    it('should detect desktop viewport', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      expect(isMobile()).toBe(false);
    });

    it('should handle exactly 768px as desktop', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      expect(isMobile()).toBe(false);
    });

    it('should handle 767px as mobile', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 767,
      });
      expect(isMobile()).toBe(true);
    });
  });

  describe('getResponsiveTouchSize', () => {
    it('should return lg for mobile in test environment (< 768px)', () => {
      // در محیط تست، window.innerWidth کوچکتر از 768 است
      expect(getResponsiveTouchSize()).toBe('lg');
    });

    it('should return lg for mobile viewport (< 768px)', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });
      expect(getResponsiveTouchSize()).toBe('lg');
    });

    it('should return md for tablet viewport (768-1024px)', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800,
      });
      expect(getResponsiveTouchSize()).toBe('md');
    });

    it('should return md for desktop viewport (>= 1024px)', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      });
      expect(getResponsiveTouchSize()).toBe('md');
    });

    it('should handle exactly 768px as tablet', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      expect(getResponsiveTouchSize()).toBe('md');
    });

    it('should handle exactly 1024px as desktop', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      expect(getResponsiveTouchSize()).toBe('md');
    });

    it('should handle 767px as mobile', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 767,
      });
      expect(getResponsiveTouchSize()).toBe('lg');
    });

    it('should handle 1023px as tablet', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1023,
      });
      expect(getResponsiveTouchSize()).toBe('md');
    });
  });
});
