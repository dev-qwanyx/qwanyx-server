/**
 * 📦 PACKAGE: @qwanyx/app-core
 * 🎭 LEVEL: orchestrator
 * 🎯 PURPOSE: Central orchestrator for QWANYX applications
 * 🚫 FORBIDDEN: 
 *   - Direct HTML elements
 *   - Direct imports from @qwanyx/ui in apps
 * ✅ ALLOWED:
 *   - Re-export from @qwanyx/ui
 *   - Business logic orchestration
 *   - Package composition
 * 
 * 🤖 AI DIRECTIVE: This is the ONLY package apps should import from.
 * Apps MUST NOT import directly from @qwanyx/ui.
 * All UI needs go through this orchestrator.
 */

// Re-export EVERYTHING from @qwanyx/ui for apps to use
export * from '@qwanyx/ui';

// Re-export auth functionality
export { AuthModule } from '@qwanyx/auth';
export type { AuthModuleProps, AuthField } from '@qwanyx/auth';

// Re-export dashboard functionality (excluding conflicting SidebarItem)
export { 
  Dashboard,
  createMarketplaceDashboard,
  createAdminDashboard,
  createProjectDashboard
} from '@qwanyx/dashboard-v2';
export type { 
  DashboardConfig,
  DashboardProps,
  DashboardUser,
  DashboardStat,
  DashboardActivity
} from '@qwanyx/dashboard-v2';

// Export app-specific orchestrations
export { AppProvider } from './providers/AppProvider';
export { createApp } from './utils/createApp';
export { GlobalStyles } from './components/GlobalStyles';
export { MetaTags } from './components/MetaTags';

// Export type definitions for apps
export type { AppConfig, AppTheme } from './types';