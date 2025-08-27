//! Workspace module - Multi-tenancy support

pub struct WorkspaceManager {
    pub workspaces: Vec<Workspace>,
}

pub struct Workspace {
    pub code: String,
    pub name: String,
    pub domain: String,
}