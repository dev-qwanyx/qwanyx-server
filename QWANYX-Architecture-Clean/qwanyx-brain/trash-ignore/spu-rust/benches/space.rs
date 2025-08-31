//! Semantic space benchmarks

use criterion::{black_box, criterion_group, criterion_main, Criterion, BatchSize};
use qwanyx_spu::spu::space::{SemanticSpace, Sphere, Position3D};
use uuid::Uuid;

fn create_test_sphere(position: Position3D) -> Sphere {
    Sphere {
        id: Uuid::new_v4(),
        position,
        radius: 5.0,
        mass: 1.0,
        concept: "test".to_string(),
        chinese_char: Some('测'),
        activation: 0.0,
        document_id: None,
        edges: vec![],
    }
}

fn space_operations_benchmark(c: &mut Criterion) {
    // Benchmark sphere insertion
    c.bench_function("add_sphere", |b| {
        b.iter_batched(
            || SemanticSpace::new(),
            |mut space| {
                let sphere = create_test_sphere(Position3D::new(10.0, 20.0, 30.0));
                space.add_sphere(black_box(sphere))
            },
            BatchSize::SmallInput,
        );
    });
    
    // Benchmark find_in_radius with few spheres
    c.bench_function("find_in_radius_small", |b| {
        let mut space = SemanticSpace::new();
        for i in 0..10 {
            let pos = Position3D::new(i as f32 * 10.0, 0.0, 0.0);
            space.add_sphere(create_test_sphere(pos));
        }
        
        b.iter(|| {
            space.find_in_radius(black_box(&Position3D::new(25.0, 0.0, 0.0)), 30.0)
        });
    });
    
    // Benchmark find_in_radius with many spheres
    c.bench_function("find_in_radius_large", |b| {
        let mut space = SemanticSpace::new();
        for i in 0..100 {
            let x = (i % 10) as f32 * 10.0;
            let y = (i / 10) as f32 * 10.0;
            let pos = Position3D::new(x, y, 0.0);
            space.add_sphere(create_test_sphere(pos));
        }
        
        b.iter(|| {
            space.find_in_radius(black_box(&Position3D::new(50.0, 50.0, 0.0)), 40.0)
        });
    });
    
    // Benchmark find_nearest
    c.bench_function("find_nearest", |b| {
        let mut space = SemanticSpace::new();
        for i in 0..50 {
            let angle = (i as f32) * std::f32::consts::TAU / 50.0;
            let x = angle.cos() * 100.0;
            let y = angle.sin() * 100.0;
            let pos = Position3D::new(x, y, 0.0);
            space.add_sphere(create_test_sphere(pos));
        }
        
        b.iter(|| {
            space.find_nearest(black_box(&Position3D::new(25.0, 25.0, 0.0)))
        });
    });
}

fn activation_benchmark(c: &mut Criterion) {
    // Benchmark fuzzy activation propagation
    c.bench_function("activate_fuzzy", |b| {
        b.iter_batched(
            || {
                let mut space = SemanticSpace::new();
                let mut center_id = Uuid::nil();
                
                // Create a cluster of spheres
                for i in 0..20 {
                    let angle = (i as f32) * std::f32::consts::TAU / 20.0;
                    let x = angle.cos() * 30.0;
                    let y = angle.sin() * 30.0;
                    let sphere = create_test_sphere(Position3D::new(x, y, 0.0));
                    if i == 0 {
                        center_id = sphere.id;
                    }
                    space.add_sphere(sphere);
                }
                (space, center_id)
            },
            |(mut space, id)| {
                space.activate_fuzzy(black_box(id), 1.0)
            },
            BatchSize::SmallInput,
        );
    });
}

fn raytracing_benchmark(c: &mut Criterion) {
    // Benchmark basic raytracing
    c.bench_function("raytrace_simple", |b| {
        let mut space = SemanticSpace::new();
        
        // Create a line of spheres
        for i in 0..10 {
            let pos = Position3D::new(i as f32 * 10.0, 0.0, 0.0);
            space.add_sphere(create_test_sphere(pos));
        }
        
        b.iter(|| {
            space.raytrace(
                black_box(Position3D::new(-10.0, 0.0, 0.0)),
                black_box(Position3D::new(1.0, 0.0, 0.0)),
                100.0,
            )
        });
    });
    
    // Benchmark complex raytracing
    c.bench_function("raytrace_complex", |b| {
        let mut space = SemanticSpace::new();
        
        // Create a 3D grid of spheres
        for x in 0..5 {
            for y in 0..5 {
                for z in 0..5 {
                    let pos = Position3D::new(
                        x as f32 * 20.0,
                        y as f32 * 20.0,
                        z as f32 * 20.0,
                    );
                    space.add_sphere(create_test_sphere(pos));
                }
            }
        }
        
        b.iter(|| {
            space.raytrace(
                black_box(Position3D::new(-10.0, -10.0, -10.0)),
                black_box(Position3D::new(1.0, 1.0, 1.0)),
                200.0,
            )
        });
    });
}

fn position_calculation_benchmark(c: &mut Criterion) {
    // Benchmark position calculation
    c.bench_function("calculate_position", |b| {
        let mut space = SemanticSpace::new();
        let mut ids = vec![];
        
        for i in 0..10 {
            let pos = Position3D::new(i as f32 * 10.0, i as f32 * 5.0, 0.0);
            let sphere = create_test_sphere(pos);
            ids.push(sphere.id);
            space.add_sphere(sphere);
        }
        
        b.iter(|| {
            space.calculate_position(black_box(&ids[0..5]))
        });
    });
    
    // Benchmark distance calculation
    c.bench_function("distance_calculation", |b| {
        let pos1 = Position3D::new(0.0, 0.0, 0.0);
        let pos2 = Position3D::new(100.0, 100.0, 100.0);
        
        b.iter(|| {
            pos1.distance(black_box(&pos2))
        });
    });
    
    // Benchmark barycenter calculation
    c.bench_function("barycenter", |b| {
        let positions: Vec<Position3D> = (0..20)
            .map(|i| Position3D::new(i as f32, i as f32 * 2.0, i as f32 * 3.0))
            .collect();
        
        b.iter(|| {
            Position3D::barycenter(black_box(&positions), None)
        });
    });
    
    // Benchmark weighted barycenter
    c.bench_function("barycenter_weighted", |b| {
        let positions: Vec<Position3D> = (0..20)
            .map(|i| Position3D::new(i as f32, i as f32 * 2.0, i as f32 * 3.0))
            .collect();
        let weights: Vec<f32> = (0..20).map(|i| 1.0 + i as f32 * 0.1).collect();
        
        b.iter(|| {
            Position3D::barycenter(black_box(&positions), Some(black_box(&weights)))
        });
    });
}

criterion_group!(
    benches,
    space_operations_benchmark,
    activation_benchmark,
    raytracing_benchmark,
    position_calculation_benchmark
);
criterion_main!(benches);