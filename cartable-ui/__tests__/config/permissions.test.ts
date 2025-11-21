import {
  UserRole,
  hasRequiredRole,
  canAccessRoute,
  hasMinimumRole,
  getAccessibleMenuItems,
  routePermissions,
  navigationPermissions,
} from '@/config/permissions';

describe('config/permissions', () => {
  describe('hasRequiredRole', () => {
    it('should return true when user has required role', () => {
      const userRoles = [UserRole.CARTABLE_APPROVER];
      const requiredRoles = [UserRole.CARTABLE_APPROVER];
      expect(hasRequiredRole(userRoles, requiredRoles)).toBe(true);
    });

    it('should return true when user has one of multiple required roles', () => {
      const userRoles = [UserRole.CARTABLE_MANAGER];
      const requiredRoles = [UserRole.CARTABLE_APPROVER, UserRole.CARTABLE_MANAGER];
      expect(hasRequiredRole(userRoles, requiredRoles)).toBe(true);
    });

    it('should return false when user does not have required role', () => {
      const userRoles = [UserRole.CARTABLE_APPROVER];
      const requiredRoles = [UserRole.CARTABLE_MANAGER];
      expect(hasRequiredRole(userRoles, requiredRoles)).toBe(false);
    });

    it('should return true when no roles are required', () => {
      const userRoles = [UserRole.CARTABLE_APPROVER];
      const requiredRoles = undefined;
      expect(hasRequiredRole(userRoles, requiredRoles)).toBe(true);
    });

    it('should return true when required roles is empty array', () => {
      const userRoles = [UserRole.CARTABLE_APPROVER];
      const requiredRoles: UserRole[] = [];
      expect(hasRequiredRole(userRoles, requiredRoles)).toBe(true);
    });

    it('should return false when user has no roles', () => {
      const userRoles = undefined;
      const requiredRoles = [UserRole.CARTABLE_APPROVER];
      expect(hasRequiredRole(userRoles, requiredRoles)).toBe(false);
    });

    it('should return false when user roles is empty array', () => {
      const userRoles: string[] = [];
      const requiredRoles = [UserRole.CARTABLE_APPROVER];
      expect(hasRequiredRole(userRoles, requiredRoles)).toBe(false);
    });

    it('should handle admin role correctly', () => {
      const userRoles = [UserRole.ADMIN];
      const requiredRoles = [UserRole.CARTABLE_MANAGER];
      expect(hasRequiredRole(userRoles, requiredRoles)).toBe(false);
    });
  });

  describe('canAccessRoute', () => {
    it('should allow access to public route without authentication', () => {
      expect(canAccessRoute('/', undefined, false)).toBe(true);
    });

    it('should allow access to auth error page without authentication', () => {
      expect(canAccessRoute('/auth/error', undefined, false)).toBe(true);
    });

    it('should deny access to dashboard without authentication', () => {
      expect(canAccessRoute('/dashboard', undefined, false)).toBe(false);
    });

    it('should allow approver to access dashboard', () => {
      const userRoles = [UserRole.CARTABLE_APPROVER];
      expect(canAccessRoute('/dashboard', userRoles, true)).toBe(true);
    });

    it('should allow manager to access dashboard', () => {
      const userRoles = [UserRole.CARTABLE_MANAGER];
      expect(canAccessRoute('/dashboard', userRoles, true)).toBe(true);
    });

    it('should allow approver to access my-cartable', () => {
      const userRoles = [UserRole.CARTABLE_APPROVER];
      expect(canAccessRoute('/my-cartable', userRoles, true)).toBe(true);
    });

    it('should deny manager access to my-cartable', () => {
      const userRoles = [UserRole.CARTABLE_MANAGER];
      expect(canAccessRoute('/my-cartable', userRoles, true)).toBe(false);
    });

    it('should allow manager to access manager-cartable', () => {
      const userRoles = [UserRole.CARTABLE_MANAGER];
      expect(canAccessRoute('/manager-cartable', userRoles, true)).toBe(true);
    });

    it('should deny approver access to manager-cartable', () => {
      const userRoles = [UserRole.CARTABLE_APPROVER];
      expect(canAccessRoute('/manager-cartable', userRoles, true)).toBe(false);
    });

    it('should allow admin to access all routes', () => {
      const userRoles = [UserRole.ADMIN];
      expect(canAccessRoute('/dashboard', userRoles, true)).toBe(true);
      expect(canAccessRoute('/my-cartable', userRoles, true)).toBe(true);
      expect(canAccessRoute('/manager-cartable', userRoles, true)).toBe(true);
      expect(canAccessRoute('/accounts', userRoles, true)).toBe(true);
    });

    it('should deny manager access to accounts when not authenticated', () => {
      const userRoles = [UserRole.CARTABLE_MANAGER];
      expect(canAccessRoute('/accounts', userRoles, false)).toBe(false);
    });

    it('should allow manager to access accounts when authenticated', () => {
      const userRoles = [UserRole.CARTABLE_MANAGER];
      expect(canAccessRoute('/accounts', userRoles, true)).toBe(true);
    });

    it('should deny approver access to accounts', () => {
      const userRoles = [UserRole.CARTABLE_APPROVER];
      expect(canAccessRoute('/accounts', userRoles, true)).toBe(false);
    });

    it('should handle nested routes correctly', () => {
      const userRoles = [UserRole.CARTABLE_APPROVER];
      expect(canAccessRoute('/my-cartable/details', userRoles, true)).toBe(true);
    });

    it('should handle unknown routes as public', () => {
      expect(canAccessRoute('/unknown-route', undefined, false)).toBe(true);
    });
  });

  describe('hasMinimumRole', () => {
    it('should return true for approver', () => {
      const userRoles = [UserRole.CARTABLE_APPROVER];
      expect(hasMinimumRole(userRoles)).toBe(true);
    });

    it('should return true for manager', () => {
      const userRoles = [UserRole.CARTABLE_MANAGER];
      expect(hasMinimumRole(userRoles)).toBe(true);
    });

    it('should return true for admin', () => {
      const userRoles = [UserRole.ADMIN];
      expect(hasMinimumRole(userRoles)).toBe(true);
    });

    it('should return false for empty roles', () => {
      const userRoles: string[] = [];
      expect(hasMinimumRole(userRoles)).toBe(false);
    });

    it('should return false for undefined roles', () => {
      expect(hasMinimumRole(undefined)).toBe(false);
    });

    it('should return false for invalid roles', () => {
      const userRoles = ['invalid-role'];
      expect(hasMinimumRole(userRoles)).toBe(false);
    });

    it('should return true when user has multiple roles including valid one', () => {
      const userRoles = ['some-other-role', UserRole.CARTABLE_APPROVER];
      expect(hasMinimumRole(userRoles)).toBe(true);
    });
  });

  describe('getAccessibleMenuItems', () => {
    it('should return all menu items for admin', () => {
      const userRoles = [UserRole.ADMIN];
      const items = getAccessibleMenuItems(userRoles);
      expect(items).toContain('dashboard');
      expect(items).toContain('myCartable');
      expect(items).toContain('managerCartable');
      expect(items).toContain('accounts');
    });

    it('should return approver menu items', () => {
      const userRoles = [UserRole.CARTABLE_APPROVER];
      const items = getAccessibleMenuItems(userRoles);
      expect(items).toContain('dashboard');
      expect(items).toContain('myCartable');
      expect(items).toContain('paymentOrders');
      expect(items).toContain('reports');
      expect(items).not.toContain('managerCartable');
      expect(items).not.toContain('accounts');
    });

    it('should return manager menu items', () => {
      const userRoles = [UserRole.CARTABLE_MANAGER];
      const items = getAccessibleMenuItems(userRoles);
      expect(items).toContain('dashboard');
      expect(items).toContain('managerCartable');
      expect(items).toContain('accounts');
      expect(items).toContain('paymentOrders');
      expect(items).toContain('reports');
      expect(items).not.toContain('myCartable');
    });

    it('should return empty array for no roles', () => {
      const items = getAccessibleMenuItems(undefined);
      expect(items).toEqual([]);
    });

    it('should return empty array for empty roles', () => {
      const userRoles: string[] = [];
      const items = getAccessibleMenuItems(userRoles);
      expect(items).toEqual([]);
    });

    it('should return empty array for invalid roles', () => {
      const userRoles = ['invalid-role'];
      const items = getAccessibleMenuItems(userRoles);
      expect(items).toEqual([]);
    });
  });

  describe('routePermissions configuration', () => {
    it('should have correct configuration for public routes', () => {
      expect(routePermissions['/']).toEqual({
        requiresAuth: false,
        isPublic: true,
      });
    });

    it('should have correct configuration for dashboard', () => {
      expect(routePermissions['/dashboard']).toEqual({
        requiresAuth: true,
        allowedRoles: [UserRole.CARTABLE_APPROVER, UserRole.CARTABLE_MANAGER, UserRole.ADMIN],
      });
    });

    it('should have correct configuration for my-cartable', () => {
      expect(routePermissions['/my-cartable']).toEqual({
        requiresAuth: true,
        allowedRoles: [UserRole.CARTABLE_APPROVER, UserRole.ADMIN],
      });
    });

    it('should have correct configuration for manager-cartable', () => {
      expect(routePermissions['/manager-cartable']).toEqual({
        requiresAuth: true,
        allowedRoles: [UserRole.CARTABLE_MANAGER, UserRole.ADMIN],
      });
    });

    it('should have correct configuration for accounts', () => {
      expect(routePermissions['/accounts']).toEqual({
        requiresAuth: true,
        allowedRoles: [UserRole.CARTABLE_MANAGER, UserRole.ADMIN],
      });
    });
  });

  describe('navigationPermissions configuration', () => {
    it('should have correct navigation permissions', () => {
      expect(navigationPermissions.dashboard).toEqual([
        UserRole.CARTABLE_APPROVER,
        UserRole.CARTABLE_MANAGER,
        UserRole.ADMIN,
      ]);
      expect(navigationPermissions.myCartable).toEqual([UserRole.CARTABLE_APPROVER, UserRole.ADMIN]);
      expect(navigationPermissions.managerCartable).toEqual([UserRole.CARTABLE_MANAGER, UserRole.ADMIN]);
      expect(navigationPermissions.accounts).toEqual([UserRole.CARTABLE_MANAGER, UserRole.ADMIN]);
    });
  });
});
