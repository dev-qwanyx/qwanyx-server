import { useState, useEffect } from 'react';

interface WorkspaceConfig {
  workspace: string;
  apiUrl: string;
  theme?: any;
  features?: string[];
}

export const useWorkspace = (initialWorkspace?: string) => {
  const [workspace, setWorkspace] = useState<string>(
    initialWorkspace || import.meta.env.VITE_WORKSPACE || 'qwanyx-com'
  );
  
  const [config, setConfig] = useState<WorkspaceConfig>({
    workspace,
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5002',
  });

  useEffect(() => {
    // Load workspace-specific configuration
    const loadConfig = async () => {
      try {
        // In a real app, this might fetch from an API or load a config file
        const workspaceConfigs: Record<string, Partial<WorkspaceConfig>> = {
          'qwanyx-com': {
            apiUrl: 'http://api.qwanyx.com',
            features: ['dashboard', 'modules', 'docs']
          },
          'autodin-be': {
            apiUrl: 'http://api.qwanyx.com',
            features: ['marketplace', 'inventory', 'requests']
          },
          'belgicomics-be': {
            apiUrl: 'http://api.qwanyx.com',
            features: ['collections', 'mystery', 'community']
          }
        };

        const wsConfig = workspaceConfigs[workspace] || {};
        setConfig({
          workspace,
          apiUrl: wsConfig.apiUrl || config.apiUrl,
          theme: wsConfig.theme,
          features: wsConfig.features || []
        });
      } catch (error) {
        console.error('Failed to load workspace config:', error);
      }
    };

    loadConfig();
  }, [workspace]);

  const hasFeature = (feature: string) => {
    return config.features?.includes(feature) || false;
  };

  return {
    workspace,
    config,
    hasFeature,
    setWorkspace
  };
};