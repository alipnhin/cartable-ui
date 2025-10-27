/**
 * Mock Users
 * داده‌های نمونه کاربران
 */

import { User, UserRole } from "@/types";
import { subtractDays, now, addHours } from "@/lib/date";


export const mockUsers: User[] = [
  {
    id: "user-1",
    username: "admin",
    fullName: "محمد رضایی",
    email: "m.rezaei@example.com",
    phoneNumber: "09121234567",
    nationalId: "0012345678",
    role: UserRole.SuperAdmin,
    avatar: "/media/avatars/300-1.jpg",
    isActive: true,
    createdAt: subtractDays(now(), 365),
    lastLoginAt: subtractDays(now(), 1),
  },
  {
    id: "user-2",
    username: "a.karimi",
    fullName: "علی کریمی",
    email: "a.karimi@example.com",
    phoneNumber: "09121234568",
    nationalId: "0012345679",
    role: UserRole.Admin,
    avatar: "/media/avatars/300-2.jpg",
    isActive: true,
    createdAt: subtractDays(now(), 300),
    lastLoginAt: addHours(now(), -3),
  },
  {
    id: "user-3",
    username: "s.hosseini",
    fullName: "سارا حسینی",
    email: "s.hosseini@example.com",
    phoneNumber: "09121234569",
    nationalId: "0012345680",
    role: UserRole.Manager,
    avatar: "/media/avatars/300-3.jpg",
    isActive: true,
    createdAt: subtractDays(now(), 250),
    lastLoginAt: addHours(now(), -5),
  },
  {
    id: "user-4",
    username: "r.mohammadi",
    fullName: "رضا محمدی",
    email: "r.mohammadi@example.com",
    phoneNumber: "09121234570",
    nationalId: "0012345681",
    role: UserRole.Accountant,
    avatar: "/media/avatars/300-4.jpg",
    isActive: true,
    createdAt: subtractDays(now(), 200),
    lastLoginAt: addHours(now(), -2),
  },
  {
    id: "user-5",
    username: "m.ahmadi",
    fullName: "مریم احمدی",
    email: "m.ahmadi@example.com",
    phoneNumber: "09121234571",
    nationalId: "0012345682",
    role: UserRole.Accountant,
    avatar: "/media/avatars/300-5.jpg",
    isActive: true,
    createdAt: subtractDays(now(), 180),
    lastLoginAt: addHours(now(), -4),
  },
  {
    id: "user-6",
    username: "h.safari",
    fullName: "حسین صفری",
    email: "h.safari@example.com",
    phoneNumber: "09121234572",
    nationalId: "0012345683",
    role: UserRole.Manager,
    avatar: "/media/avatars/300-6.jpg",
    isActive: true,
    createdAt: subtractDays(now(), 150),
    lastLoginAt: addHours(now(), -6),
  },
  {
    id: "user-7",
    username: "f.moradi",
    fullName: "فاطمه مرادی",
    email: "f.moradi@example.com",
    phoneNumber: "09121234573",
    nationalId: "0012345684",
    role: UserRole.Accountant,
    avatar: "/media/avatars/300-7.jpg",
    isActive: true,
    createdAt: subtractDays(now(), 120),
    lastLoginAt: addHours(now(), -8),
  },
  {
    id: "user-8",
    username: "p.jamali",
    fullName: "پریسا جمالی",
    email: "p.jamali@example.com",
    phoneNumber: "09121234574",
    nationalId: "0012345685",
    role: UserRole.Viewer,
    avatar: "/media/avatars/300-8.jpg",
    isActive: true,
    createdAt: subtractDays(now(), 90),
    lastLoginAt: addHours(now(), -12),
  },
  {
    id: "user-9",
    username: "a.rahimi",
    fullName: "امیر رحیمی",
    email: "a.rahimi@example.com",
    phoneNumber: "09121234575",
    nationalId: "0012345686",
    role: UserRole.Manager,
    avatar: "/media/avatars/300-9.jpg",
    isActive: true,
    createdAt: subtractDays(now(), 60),
    lastLoginAt: addHours(now(), -24),
  },
  {
    id: "user-10",
    username: "z.bagheri",
    fullName: "زهرا باقری",
    email: "z.bagheri@example.com",
    phoneNumber: "09121234576",
    nationalId: "0012345687",
    role: UserRole.Accountant,
    avatar: "/media/avatars/300-10.jpg",
    isActive: true,
    createdAt: subtractDays(now(), 30),
    lastLoginAt: addHours(now(), -48),
  },
  {
    id: "user-11",
    username: "k.hashemi",
    fullName: "کامران هاشمی",
    email: "k.hashemi@example.com",
    phoneNumber: "09121234577",
    nationalId: "0012345688",
    role: UserRole.Viewer,
    avatar: "/media/avatars/300-11.jpg",
    isActive: false,
    createdAt: subtractDays(now(), 400),
    lastLoginAt: subtractDays(now(), 100),
  },
  {
    id: "user-12",
    username: "n.rostami",
    fullName: "نرگس رستمی",
    email: "n.rostami@example.com",
    phoneNumber: "09121234578",
    nationalId: "0012345689",
    role: UserRole.Accountant,
    avatar: "/media/avatars/300-12.jpg",
    isActive: true,
    createdAt: subtractDays(now(), 45),
    lastLoginAt: addHours(now(), -10),
  },
];

/**
 * گرفتن کاربر با ID
 */
export const getUserById = (userId: string): User | undefined => {
  return mockUsers.find((u) => u.id === userId);
};

/**
 * گرفتن کاربر با username
 */
export const getUserByUsername = (username: string): User | undefined => {
  return mockUsers.find((u) => u.username === username);
};

/**
 * گرفتن کاربران فعال
 */
export const getActiveUsers = (): User[] => {
  return mockUsers.filter((u) => u.isActive);
};

/**
 * گرفتن کاربران با نقش خاص
 */
export const getUsersByRole = (role: UserRole): User[] => {
  return mockUsers.filter((u) => u.role === role);
};

/**
 * Current User (برای تست)
 */
export const CURRENT_USER: User = mockUsers[0]; // admin
