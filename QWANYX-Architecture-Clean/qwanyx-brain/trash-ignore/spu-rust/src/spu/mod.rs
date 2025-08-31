//! Semantic Processing Unit - Core Engine

pub mod processor;
pub mod space;
pub mod instruction;
pub mod cache;
pub mod compression;
pub mod worlds;

pub use processor::SemanticProcessor;
pub use space::{SemanticSpace, Sphere, Position3D};
pub use instruction::{Instruction, InstructionSet};