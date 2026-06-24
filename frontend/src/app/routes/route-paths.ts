export const routePaths = {
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  patients: '/patients',
  drugs: '/drugs',
  bookmarkedDrugs: '/drugs/bookmarks',
  usageStatistics: '/usage-statistics',
  evaluations: '/evaluations',
  history: '/history',
  settings: '/settings',
  admin: {
    users: '/admin/users',
    system: '/admin/system',
  }
} as const;
