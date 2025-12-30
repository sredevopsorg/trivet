declare module "@tryghost/admin-api" {
  interface GhostAdminAPIOptions {
    url: string;
    key: string;
    version: string;
  }

  interface GhostMember {
    id: string;
    labels?: Array<{ name: string }>;
  }

  interface GhostAdminAPI {
    members: {
      browse: (options: { filter: string; limit: number }) => Promise<GhostMember[]>;
      add: (data: {
        email: string;
        name?: string;
        labels?: Array<{ name: string }>;
      }) => Promise<GhostMember>;
      edit: (data: { id: string; labels?: Array<{ name: string }> }) => Promise<GhostMember>;
    };
    site: {
      read: () => Promise<unknown>;
    };
  }

  const GhostAdminAPI: {
    new (options: GhostAdminAPIOptions): GhostAdminAPI;
  };

  export default GhostAdminAPI;
}
