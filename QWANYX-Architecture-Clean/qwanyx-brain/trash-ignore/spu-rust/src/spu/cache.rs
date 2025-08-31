//! Multi-level cache for SPU

use dashmap::DashMap;
use std::sync::Arc;
use std::time::{Duration, Instant};

/// Multi-level cache implementation
pub struct SPUCache {
    /// L1 cache - hot data (in-memory)
    l1: Arc<DashMap<String, CachedItem>>,
    /// L2 cache - warm data (in-memory with LRU)
    l2: Arc<DashMap<String, CachedItem>>,
    /// Cache configuration
    max_size_mb: usize,
    /// Current size in bytes
    current_size: Arc<std::sync::atomic::AtomicUsize>,
}

#[derive(Clone)]
struct CachedItem {
    data: Vec<u8>,
    accessed_at: Instant,
    access_count: usize,
}

impl SPUCache {
    /// Create new cache with specified size limit
    pub fn new(max_size_mb: usize) -> Self {
        Self {
            l1: Arc::new(DashMap::new()),
            l2: Arc::new(DashMap::new()),
            max_size_mb,
            current_size: Arc::new(std::sync::atomic::AtomicUsize::new(0)),
        }
    }
    
    /// Get item from cache
    pub async fn get(&self, key: &str) -> Option<Vec<u8>> {
        // Check L1 first
        if let Some(mut item) = self.l1.get_mut(key) {
            item.accessed_at = Instant::now();
            item.access_count += 1;
            return Some(item.data.clone());
        }
        
        // Check L2
        if let Some(mut item) = self.l2.get_mut(key) {
            item.accessed_at = Instant::now();
            item.access_count += 1;
            
            // Promote to L1 if frequently accessed
            if item.access_count > 5 {
                let data = item.data.clone();
                drop(item); // Release lock
                self.l2.remove(key);
                self.l1.insert(key.to_string(), CachedItem {
                    data: data.clone(),
                    accessed_at: Instant::now(),
                    access_count: 1,
                });
                return Some(data);
            }
            
            return Some(item.data.clone());
        }
        
        None
    }
    
    /// Put item in cache
    pub async fn put(&self, key: &str, data: Vec<u8>) {
        let size = data.len();
        
        // Check if we have space
        let current = self.current_size.load(std::sync::atomic::Ordering::Relaxed);
        let max_size = self.max_size_mb * 1024 * 1024;
        
        if current + size > max_size {
            // Evict old items
            self.evict(size).await;
        }
        
        // Add to L1
        self.l1.insert(key.to_string(), CachedItem {
            data,
            accessed_at: Instant::now(),
            access_count: 1,
        });
        
        self.current_size.fetch_add(size, std::sync::atomic::Ordering::Relaxed);
        
        // Move old L1 items to L2
        if self.l1.len() > 100 {
            self.demote_old_items().await;
        }
    }
    
    /// Clear all cache
    pub fn clear(&self) {
        self.l1.clear();
        self.l2.clear();
        self.current_size.store(0, std::sync::atomic::Ordering::Relaxed);
    }
    
    /// Get cache statistics
    pub fn stats(&self) -> CacheStats {
        CacheStats {
            l1_items: self.l1.len(),
            l2_items: self.l2.len(),
            size_bytes: self.current_size.load(std::sync::atomic::Ordering::Relaxed),
            max_size_bytes: self.max_size_mb * 1024 * 1024,
        }
    }
    
    // Private methods
    
    async fn evict(&self, needed_space: usize) {
        let mut freed = 0;
        let threshold = Instant::now() - Duration::from_secs(300); // 5 minutes
        
        // Evict old items from L2 first
        let mut to_remove = Vec::new();
        
        for item in self.l2.iter() {
            if item.accessed_at < threshold {
                freed += item.data.len();
                to_remove.push(item.key().clone());
                
                if freed >= needed_space {
                    break;
                }
            }
        }
        
        for key in to_remove {
            self.l2.remove(&key);
        }
        
        self.current_size.fetch_sub(freed, std::sync::atomic::Ordering::Relaxed);
    }
    
    async fn demote_old_items(&self) {
        let threshold = Instant::now() - Duration::from_secs(60); // 1 minute
        let mut to_demote = Vec::new();
        
        for item in self.l1.iter() {
            if item.accessed_at < threshold && item.access_count < 3 {
                to_demote.push((item.key().clone(), item.value().clone()));
            }
        }
        
        for (key, value) in to_demote {
            self.l1.remove(&key);
            self.l2.insert(key, value);
        }
    }
}

/// Cache statistics
#[derive(Debug, Clone)]
pub struct CacheStats {
    pub l1_items: usize,
    pub l2_items: usize,
    pub size_bytes: usize,
    pub max_size_bytes: usize,
}