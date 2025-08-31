//! Brain module - consciousness implementation

pub struct Brain {
    pub id: uuid::Uuid,
    pub workspace: String,
}

impl Brain {
    pub fn new(workspace: String) -> Self {
        Self {
            id: uuid::Uuid::new_v4(),
            workspace,
        }
    }
}