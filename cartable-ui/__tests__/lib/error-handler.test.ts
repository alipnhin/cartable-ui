import { getErrorMessage } from '@/lib/error-handler';
import { AxiosError } from 'axios';

describe('lib/error-handler', () => {
  describe('getErrorMessage', () => {
    it('should extract message from direct string in data', () => {
      const error = {
        response: {
          data: 'خطای مستقیم',
        },
      };
      expect(getErrorMessage(error)).toBe('خطای مستقیم');
    });

    it('should extract message from message field', () => {
      const error = {
        response: {
          data: {
            message: 'پیغام خطا',
          },
        },
      };
      expect(getErrorMessage(error)).toBe('پیغام خطا');
    });

    it('should extract message from error field', () => {
      const error = {
        response: {
          data: {
            error: 'خطای سیستم',
          },
        },
      };
      expect(getErrorMessage(error)).toBe('خطای سیستم');
    });

    it('should extract message from title field (ASP.NET Core format)', () => {
      const error = {
        response: {
          data: {
            title: 'عنوان خطا',
          },
        },
      };
      expect(getErrorMessage(error)).toBe('عنوان خطا');
    });

    it('should extract validation errors from errors array', () => {
      const error = {
        response: {
          data: {
            errors: {
              field1: ['خطا 1', 'خطا 2'],
              field2: ['خطا 3'],
            },
          },
        },
      };
      const message = getErrorMessage(error);
      expect(message).toContain('خطا 1');
      expect(message).toContain('خطا 2');
      expect(message).toContain('خطا 3');
    });

    it('should handle single error string in errors object', () => {
      const error = {
        response: {
          data: {
            errors: {
              field1: 'خطای تکی',
            },
          },
        },
      };
      expect(getErrorMessage(error)).toBe('خطای تکی');
    });

    it('should return message for 400 status code', () => {
      const error = {
        response: {
          status: 400,
          data: {},
        },
      };
      expect(getErrorMessage(error)).toBe('درخواست نامعتبر است');
    });

    it('should return message for 401 status code', () => {
      const error = {
        response: {
          status: 401,
          data: {},
        },
      };
      expect(getErrorMessage(error)).toBe('احراز هویت ناموفق - لطفاً مجدداً وارد شوید');
    });

    it('should return message for 403 status code', () => {
      const error = {
        response: {
          status: 403,
          data: {},
        },
      };
      expect(getErrorMessage(error)).toBe('شما مجوز انجام این عملیات را ندارید');
    });

    it('should return message for 404 status code', () => {
      const error = {
        response: {
          status: 404,
          data: {},
        },
      };
      expect(getErrorMessage(error)).toBe('اطلاعات مورد نظر یافت نشد');
    });

    it('should return message for 500 status code', () => {
      const error = {
        response: {
          status: 500,
          data: {},
        },
      };
      expect(getErrorMessage(error)).toBe('خطای سرور - لطفاً با پشتیبانی تماس بگیرید');
    });

    it('should return generic message for other status codes', () => {
      const error = {
        response: {
          status: 502,
          data: {},
        },
      };
      expect(getErrorMessage(error)).toBe('خطای 502');
    });

    it('should handle network errors', () => {
      const error = {
        request: {},
      };
      expect(getErrorMessage(error)).toBe('خطای ارتباط با سرور - اتصال اینترنت خود را بررسی کنید');
    });

    it('should extract message from error.message', () => {
      const error = {
        message: 'پیغام خطای عمومی',
      };
      expect(getErrorMessage(error)).toBe('پیغام خطای عمومی');
    });

    it('should return default message for unknown errors', () => {
      const error = {};
      expect(getErrorMessage(error)).toBe('خطای نامشخص رخ داده است');
    });

    it('should prioritize data.message over status code', () => {
      const error = {
        response: {
          status: 400,
          data: {
            message: 'پیغام سفارشی',
          },
        },
      };
      expect(getErrorMessage(error)).toBe('پیغام سفارشی');
    });

    it('should handle empty errors object', () => {
      const error = {
        response: {
          data: {
            errors: {},
          },
        },
      };
      expect(getErrorMessage(error)).toBe('خطای نامشخص رخ داده است');
    });

    it('should filter out falsy error messages', () => {
      const error = {
        response: {
          data: {
            errors: {
              field1: null,
              field2: '',
              field3: ['خطای معتبر'],
            },
          },
        },
      };
      const message = getErrorMessage(error);
      expect(message).toBe('خطای معتبر');
    });

    it('should handle axios error structure', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 404,
          data: {
            message: 'یافت نشد',
          },
        },
      } as unknown as AxiosError;

      expect(getErrorMessage(axiosError)).toBe('یافت نشد');
    });

    it('should handle complex validation errors', () => {
      const error = {
        response: {
          data: {
            errors: {
              'Email': ['فرمت ایمیل نامعتبر است'],
              'Password': ['رمز عبور باید حداقل 8 کاراکتر باشد', 'رمز عبور باید شامل یک حرف بزرگ باشد'],
              'Username': ['نام کاربری تکراری است'],
            },
          },
        },
      };
      const message = getErrorMessage(error);
      expect(message).toContain('فرمت ایمیل نامعتبر است');
      expect(message).toContain('رمز عبور باید حداقل 8 کاراکتر باشد');
      expect(message).toContain('نام کاربری تکراری است');
    });
  });
});
