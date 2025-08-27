//! 3D Semantic Space implementation

use std::collections::HashMap;
use uuid::Uuid;
use serde::{Deserialize, Serialize};

/// 3D position in semantic space
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub struct Position3D {
    pub x: f32,
    pub y: f32,
    pub z: f32,
}

impl Position3D {
    pub fn new(x: f32, y: f32, z: f32) -> Self {
        Self { x, y, z }
    }
    
    /// Calculate Euclidean distance to another position
    pub fn distance(&self, other: &Position3D) -> f32 {
        let dx = self.x - other.x;
        let dy = self.y - other.y;
        let dz = self.z - other.z;
        (dx * dx + dy * dy + dz * dz).sqrt()
    }
    
    /// Calculate barycenter of multiple positions
    pub fn barycenter(positions: &[Position3D], weights: Option<&[f32]>) -> Self {
        if positions.is_empty() {
            return Position3D::new(0.0, 0.0, 0.0);
        }
        
        let default_weights = vec![1.0; positions.len()];
        let weights = weights.unwrap_or(&default_weights);
        let total_weight: f32 = weights.iter().sum();
        
        let mut x = 0.0;
        let mut y = 0.0;
        let mut z = 0.0;
        
        for (pos, weight) in positions.iter().zip(weights.iter()) {
            x += pos.x * weight;
            y += pos.y * weight;
            z += pos.z * weight;
        }
        
        Position3D::new(
            x / total_weight,
            y / total_weight,
            z / total_weight,
        )
    }
}

/// Semantic sphere representing a concept
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Sphere {
    pub id: Uuid,
    pub position: Position3D,
    pub radius: f32,
    pub mass: f32,
    pub concept: String,
    pub chinese_char: Option<char>,
    pub activation: f32,
    pub document_id: Option<String>,
    pub edges: Vec<Edge>,
}

/// Edge between spheres
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Edge {
    pub target_id: Uuid,
    pub weight: f32,
    pub edge_type: EdgeType,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum EdgeType {
    Semantic,
    Temporal,
    Causal,
    Reference,
}

/// The 3D semantic space containing all spheres
pub struct SemanticSpace {
    spheres: HashMap<Uuid, Sphere>,
    octree: Option<Octree>,
    dimensions: Position3D,
}

impl SemanticSpace {
    /// Create a new semantic space
    pub fn new() -> Self {
        Self {
            spheres: HashMap::new(),
            octree: None,
            dimensions: Position3D::new(1000.0, 1000.0, 1000.0),
        }
    }
    
    /// Add a sphere to the space
    pub fn add_sphere(&mut self, mut sphere: Sphere) -> Uuid {
        let id = sphere.id;
        
        // Ensure position is within bounds
        sphere.position.x = sphere.position.x.clamp(-self.dimensions.x, self.dimensions.x);
        sphere.position.y = sphere.position.y.clamp(-self.dimensions.y, self.dimensions.y);
        sphere.position.z = sphere.position.z.clamp(-self.dimensions.z, self.dimensions.z);
        
        self.spheres.insert(id, sphere);
        
        // Rebuild octree if needed
        if self.spheres.len() > 100 {
            self.rebuild_octree();
        }
        
        id
    }
    
    /// Find spheres within radius of a position
    pub fn find_in_radius(&self, center: &Position3D, radius: f32) -> Vec<&Sphere> {
        let mut results = Vec::new();
        
        for sphere in self.spheres.values() {
            if sphere.position.distance(center) <= radius {
                results.push(sphere);
            }
        }
        
        results
    }
    
    /// Find nearest sphere to a position
    pub fn find_nearest(&self, position: &Position3D) -> Option<&Sphere> {
        self.spheres
            .values()
            .min_by(|a, b| {
                let dist_a = a.position.distance(position);
                let dist_b = b.position.distance(position);
                dist_a.partial_cmp(&dist_b).unwrap()
            })
    }
    
    /// Activate spheres with fuzzy propagation
    pub fn activate_fuzzy(&mut self, sphere_id: Uuid, initial_activation: f32) {
        // Activate the target sphere
        if let Some(sphere) = self.spheres.get_mut(&sphere_id) {
            sphere.activation = initial_activation;
            
            // Get neighbors for propagation
            let position = sphere.position;
            let neighbors = self.find_in_radius(&position, 50.0);
            
            // Collect neighbor updates
            let updates: Vec<(uuid::Uuid, f32)> = neighbors
                .into_iter()
                .map(|neighbor| {
                    let distance = position.distance(&neighbor.position);
                    let decay = 1.0 / (1.0 + distance * 0.1);
                    let new_activation = initial_activation * decay;
                    (neighbor.id, new_activation)
                })
                .collect();
            
            // Apply updates
            for (neighbor_id, new_activation) in updates {
                if let Some(neighbor_mut) = self.spheres.get_mut(&neighbor_id) {
                    neighbor_mut.activation = neighbor_mut.activation.max(new_activation);
                }
            }
        }
    }
    
    /// Ray tracing through semantic space
    pub fn raytrace(&self, origin: Position3D, direction: Position3D, max_distance: f32) -> Vec<RayHit> {
        let mut hits = Vec::new();
        let mut current_pos = origin;
        let step = 1.0;
        let mut distance_traveled = 0.0;
        
        // Normalize direction
        let dir_length = (direction.x * direction.x + direction.y * direction.y + direction.z * direction.z).sqrt();
        let normalized_dir = Position3D::new(
            direction.x / dir_length,
            direction.y / dir_length,
            direction.z / dir_length,
        );
        
        while distance_traveled < max_distance {
            // Check for sphere intersections at current position
            for sphere in self.spheres.values() {
                let dist = sphere.position.distance(&current_pos);
                if dist <= sphere.radius {
                    hits.push(RayHit {
                        sphere_id: sphere.id,
                        distance: distance_traveled,
                        hit_point: current_pos,
                    });
                }
            }
            
            // Move along ray
            current_pos.x += normalized_dir.x * step;
            current_pos.y += normalized_dir.y * step;
            current_pos.z += normalized_dir.z * step;
            distance_traveled += step;
        }
        
        hits
    }
    
    /// Calculate optimal position for new concept based on related concepts
    pub fn calculate_position(&self, related_concepts: &[Uuid]) -> Position3D {
        let positions: Vec<Position3D> = related_concepts
            .iter()
            .filter_map(|id| self.spheres.get(id))
            .map(|s| s.position)
            .collect();
        
        if positions.is_empty() {
            // Random position if no related concepts
            Position3D::new(
                rand::random::<f32>() * 100.0 - 50.0,
                rand::random::<f32>() * 100.0 - 50.0,
                rand::random::<f32>() * 100.0 - 50.0,
            )
        } else {
            // Barycenter of related concepts
            Position3D::barycenter(&positions, None)
        }
    }
    
    // Private methods
    
    fn rebuild_octree(&mut self) {
        // TODO: Implement octree for efficient spatial queries
        // For now, using linear search
    }
}

/// Result of ray tracing
#[derive(Debug, Clone)]
pub struct RayHit {
    pub sphere_id: Uuid,
    pub distance: f32,
    pub hit_point: Position3D,
}

/// Octree for spatial optimization (TODO: implement)
struct Octree {
    // Implementation pending
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_distance_calculation() {
        let pos1 = Position3D::new(0.0, 0.0, 0.0);
        let pos2 = Position3D::new(3.0, 4.0, 0.0);
        
        assert_eq!(pos1.distance(&pos2), 5.0);
    }
    
    #[test]
    fn test_barycenter() {
        let positions = vec![
            Position3D::new(0.0, 0.0, 0.0),
            Position3D::new(10.0, 0.0, 0.0),
            Position3D::new(0.0, 10.0, 0.0),
        ];
        
        let center = Position3D::barycenter(&positions, None);
        assert_eq!(center.x, 10.0 / 3.0);
        assert_eq!(center.y, 10.0 / 3.0);
        assert_eq!(center.z, 0.0);
    }
    
    #[test]
    fn test_barycenter_with_weights() {
        let positions = vec![
            Position3D::new(0.0, 0.0, 0.0),
            Position3D::new(10.0, 0.0, 0.0),
        ];
        let weights = vec![1.0, 3.0];
        
        let center = Position3D::barycenter(&positions, Some(&weights));
        assert_eq!(center.x, 7.5); // (0*1 + 10*3) / 4
        assert_eq!(center.y, 0.0);
        assert_eq!(center.z, 0.0);
    }
    
    #[test]
    fn test_empty_barycenter() {
        let positions = vec![];
        let center = Position3D::barycenter(&positions, None);
        assert_eq!(center.x, 0.0);
        assert_eq!(center.y, 0.0);
        assert_eq!(center.z, 0.0);
    }
    
    #[test]
    fn test_find_in_radius() {
        let mut space = SemanticSpace::new();
        
        let sphere1 = Sphere {
            id: Uuid::new_v4(),
            position: Position3D::new(0.0, 0.0, 0.0),
            radius: 5.0,
            mass: 1.0,
            concept: "test1".to_string(),
            chinese_char: Some('测'),
            activation: 0.0,
            document_id: None,
            edges: vec![],
        };
        
        let sphere2 = Sphere {
            id: Uuid::new_v4(),
            position: Position3D::new(10.0, 0.0, 0.0),
            radius: 5.0,
            mass: 1.0,
            concept: "test2".to_string(),
            chinese_char: Some('试'),
            activation: 0.0,
            document_id: None,
            edges: vec![],
        };
        
        space.add_sphere(sphere1);
        space.add_sphere(sphere2);
        
        let found = space.find_in_radius(&Position3D::new(0.0, 0.0, 0.0), 15.0);
        assert_eq!(found.len(), 2);
        
        let found = space.find_in_radius(&Position3D::new(0.0, 0.0, 0.0), 5.0);
        assert_eq!(found.len(), 1);
    }
    
    #[test]
    fn test_find_nearest() {
        let mut space = SemanticSpace::new();
        
        let id1 = Uuid::new_v4();
        let sphere1 = Sphere {
            id: id1,
            position: Position3D::new(5.0, 0.0, 0.0),
            radius: 5.0,
            mass: 1.0,
            concept: "near".to_string(),
            chinese_char: Some('近'),
            activation: 0.0,
            document_id: None,
            edges: vec![],
        };
        
        let sphere2 = Sphere {
            id: Uuid::new_v4(),
            position: Position3D::new(100.0, 0.0, 0.0),
            radius: 5.0,
            mass: 1.0,
            concept: "far".to_string(),
            chinese_char: Some('远'),
            activation: 0.0,
            document_id: None,
            edges: vec![],
        };
        
        space.add_sphere(sphere1);
        space.add_sphere(sphere2);
        
        let nearest = space.find_nearest(&Position3D::new(0.0, 0.0, 0.0)).unwrap();
        assert_eq!(nearest.id, id1);
        assert_eq!(nearest.concept, "near");
    }
    
    #[test]
    fn test_sphere_bounds_clamping() {
        let mut space = SemanticSpace::new();
        
        let sphere = Sphere {
            id: Uuid::new_v4(),
            position: Position3D::new(2000.0, -2000.0, 3000.0), // Out of bounds
            radius: 5.0,
            mass: 1.0,
            concept: "bounded".to_string(),
            chinese_char: Some('界'),
            activation: 0.0,
            document_id: None,
            edges: vec![],
        };
        
        let id = space.add_sphere(sphere);
        let clamped = space.spheres.get(&id).unwrap();
        
        assert_eq!(clamped.position.x, 1000.0);  // Clamped to max
        assert_eq!(clamped.position.y, -1000.0); // Clamped to min
        assert_eq!(clamped.position.z, 1000.0);  // Clamped to max
    }
    
    #[test]
    fn test_fuzzy_activation() {
        let mut space = SemanticSpace::new();
        
        let id1 = Uuid::new_v4();
        let id2 = Uuid::new_v4();
        
        let sphere1 = Sphere {
            id: id1,
            position: Position3D::new(0.0, 0.0, 0.0),
            radius: 5.0,
            mass: 1.0,
            concept: "source".to_string(),
            chinese_char: Some('源'),
            activation: 0.0,
            document_id: None,
            edges: vec![],
        };
        
        let sphere2 = Sphere {
            id: id2,
            position: Position3D::new(10.0, 0.0, 0.0), // Within activation radius
            radius: 5.0,
            mass: 1.0,
            concept: "neighbor".to_string(),
            chinese_char: Some('邻'),
            activation: 0.0,
            document_id: None,
            edges: vec![],
        };
        
        space.add_sphere(sphere1);
        space.add_sphere(sphere2);
        
        // Activate first sphere
        space.activate_fuzzy(id1, 1.0);
        
        // Check activations
        assert_eq!(space.spheres.get(&id1).unwrap().activation, 1.0);
        
        // Neighbor should have lower activation due to distance decay
        let neighbor_activation = space.spheres.get(&id2).unwrap().activation;
        assert!(neighbor_activation > 0.0);
        assert!(neighbor_activation < 1.0);
    }
    
    #[test]
    fn test_raytrace_basic() {
        let mut space = SemanticSpace::new();
        
        let id = Uuid::new_v4();
        let sphere = Sphere {
            id,
            position: Position3D::new(10.0, 0.0, 0.0),
            radius: 5.0,
            mass: 1.0,
            concept: "target".to_string(),
            chinese_char: Some('标'),
            activation: 0.0,
            document_id: None,
            edges: vec![],
        };
        
        space.add_sphere(sphere);
        
        // Ray from origin towards sphere
        let hits = space.raytrace(
            Position3D::new(0.0, 0.0, 0.0),
            Position3D::new(1.0, 0.0, 0.0),
            20.0,
        );
        
        assert!(!hits.is_empty());
        assert!(hits.iter().any(|h| h.sphere_id == id));
    }
    
    #[test]
    fn test_raytrace_miss() {
        let mut space = SemanticSpace::new();
        
        let sphere = Sphere {
            id: Uuid::new_v4(),
            position: Position3D::new(10.0, 0.0, 0.0),
            radius: 5.0,
            mass: 1.0,
            concept: "target".to_string(),
            chinese_char: Some('标'),
            activation: 0.0,
            document_id: None,
            edges: vec![],
        };
        
        space.add_sphere(sphere);
        
        // Ray in opposite direction
        let hits = space.raytrace(
            Position3D::new(0.0, 0.0, 0.0),
            Position3D::new(-1.0, 0.0, 0.0),
            20.0,
        );
        
        assert!(hits.is_empty());
    }
    
    #[test]
    fn test_calculate_position_with_related() {
        let mut space = SemanticSpace::new();
        
        let id1 = Uuid::new_v4();
        let id2 = Uuid::new_v4();
        
        let sphere1 = Sphere {
            id: id1,
            position: Position3D::new(10.0, 0.0, 0.0),
            radius: 5.0,
            mass: 1.0,
            concept: "concept1".to_string(),
            chinese_char: Some('一'),
            activation: 0.0,
            document_id: None,
            edges: vec![],
        };
        
        let sphere2 = Sphere {
            id: id2,
            position: Position3D::new(0.0, 10.0, 0.0),
            radius: 5.0,
            mass: 1.0,
            concept: "concept2".to_string(),
            chinese_char: Some('二'),
            activation: 0.0,
            document_id: None,
            edges: vec![],
        };
        
        space.add_sphere(sphere1);
        space.add_sphere(sphere2);
        
        let position = space.calculate_position(&vec![id1, id2]);
        
        // Should be barycenter
        assert_eq!(position.x, 5.0);
        assert_eq!(position.y, 5.0);
        assert_eq!(position.z, 0.0);
    }
    
    #[test]
    fn test_calculate_position_no_related() {
        let space = SemanticSpace::new();
        let position = space.calculate_position(&vec![]);
        
        // Should be random but within reasonable bounds
        assert!(position.x >= -50.0 && position.x <= 50.0);
        assert!(position.y >= -50.0 && position.y <= 50.0);
        assert!(position.z >= -50.0 && position.z <= 50.0);
    }
    
    #[test]
    fn test_edge_types() {
        let edge1 = Edge {
            target_id: Uuid::new_v4(),
            weight: 0.5,
            edge_type: EdgeType::Semantic,
        };
        
        let edge2 = Edge {
            target_id: Uuid::new_v4(),
            weight: 0.8,
            edge_type: EdgeType::Temporal,
        };
        
        assert_eq!(edge1.edge_type, EdgeType::Semantic);
        assert_eq!(edge2.edge_type, EdgeType::Temporal);
        assert_ne!(edge1.edge_type, edge2.edge_type);
    }
    
    #[test]
    fn test_sphere_with_edges() {
        let target1 = Uuid::new_v4();
        let target2 = Uuid::new_v4();
        
        let sphere = Sphere {
            id: Uuid::new_v4(),
            position: Position3D::new(0.0, 0.0, 0.0),
            radius: 5.0,
            mass: 1.0,
            concept: "connected".to_string(),
            chinese_char: Some('连'),
            activation: 0.0,
            document_id: Some("doc123".to_string()),
            edges: vec![
                Edge {
                    target_id: target1,
                    weight: 0.7,
                    edge_type: EdgeType::Semantic,
                },
                Edge {
                    target_id: target2,
                    weight: 0.3,
                    edge_type: EdgeType::Reference,
                },
            ],
        };
        
        assert_eq!(sphere.edges.len(), 2);
        assert_eq!(sphere.edges[0].target_id, target1);
        assert_eq!(sphere.edges[1].edge_type, EdgeType::Reference);
    }
}