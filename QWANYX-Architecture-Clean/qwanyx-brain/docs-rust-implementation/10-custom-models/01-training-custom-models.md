# Création de Modèles Custom pour SPU - Phase 2

## 📅 Prérequis : SPU de Base Fonctionnel

**⚠️ À IMPLÉMENTER APRÈS LA PHASE 1**

Ce document décrit comment créer des modèles ML personnalisés une fois que le SPU de base tourne correctement.

## 🎯 Objectifs des Modèles Custom

### Pourquoi des Modèles Personnalisés ?

1. **Précision Domain-Specific** : 95%+ sur VOS données
2. **Performance CPU** : < 1ms sans GPU
3. **Taille Minimale** : 1-50MB par modèle
4. **Privacy** : Vos données restent privées
5. **Coût** : Zero après entraînement

### Modèles Prioritaires pour QWANYX

| Modèle | Tâche | Taille Cible | Latence Cible | Dataset Requis |
|--------|-------|--------------|---------------|----------------|
| **UrgencyDetector** | Classifier urgence emails | 5MB | < 0.5ms | 5,000 emails |
| **SentimentAnalyzer** | Analyse sentiment client | 10MB | < 1ms | 10,000 emails |
| **BANTQualifier** | Qualification leads | 15MB | < 2ms | 3,000 conversations |
| **CategoryClassifier** | Router emails | 8MB | < 1ms | 5,000 emails |
| **EntityExtractor** | Extraire noms/dates/montants | 20MB | < 3ms | 10,000 documents |
| **IntentDetector** | Comprendre intention | 12MB | < 2ms | 8,000 requêtes |

## 🔧 Pipeline de Création

### Phase 1 : Collecte de Données (2 semaines)

```python
# Script de collecte depuis MongoDB
def collect_training_data():
    emails = db.emails.find({
        "processed": True,
        "has_label": True
    })
    
    dataset = []
    for email in emails:
        dataset.append({
            "text": email["body"],
            "compressed": email["compressed_chinese"],
            "urgency": email["metadata"]["urgency"],
            "sentiment": email["metadata"]["sentiment"],
            "category": email["metadata"]["category"],
            "bant": email["metadata"]["bant"]
        })
    
    # Sauvegarder pour training
    save_dataset("qwanyx_emails_dataset.json", dataset)
    
    print(f"Collected {len(dataset)} samples")
    # Objectif : 10,000+ samples
```

### Phase 2 : Annotation Semi-Automatique (1 semaine)

```python
# Utiliser GPT-4 pour pré-annoter
async def auto_annotate(emails):
    annotated = []
    
    for email in emails:
        # GPT-4 fait une première annotation
        analysis = await gpt4.analyze(email, 
            prompt="Classify urgency, sentiment, category, BANT"
        )
        
        # Validation humaine rapide
        if needs_review(analysis):
            analysis = human_review(email, analysis)
        
        annotated.append({
            "text": email,
            "labels": analysis
        })
    
    return annotated

# Interface de validation
def human_review_interface():
    # Simple web UI pour valider/corriger
    # 100 emails/heure possible
    pass
```

### Phase 3 : Architecture des Modèles (Semaine 3)

#### Modèle 1 : UrgencyDetector Ultra-Léger

```python
import torch
import torch.nn as nn

class UrgencyNanoModel(nn.Module):
    def __init__(self, vocab_size=10000, embed_dim=32):
        super().__init__()
        # Architecture minimale
        self.embedding = nn.Embedding(vocab_size, embed_dim)
        self.conv1 = nn.Conv1d(embed_dim, 64, kernel_size=3)
        self.conv2 = nn.Conv1d(64, 32, kernel_size=3)
        self.pool = nn.AdaptiveMaxPool1d(1)
        self.classifier = nn.Linear(32, 4)  # 4 levels
        self.dropout = nn.Dropout(0.2)
        
    def forward(self, x):
        # x shape: (batch, seq_len)
        x = self.embedding(x)  # (batch, seq_len, embed_dim)
        x = x.transpose(1, 2)  # (batch, embed_dim, seq_len)
        
        x = torch.relu(self.conv1(x))
        x = self.dropout(x)
        x = torch.relu(self.conv2(x))
        x = self.pool(x).squeeze(-1)  # (batch, 32)
        
        return self.classifier(x)
    
    def total_params(self):
        return sum(p.numel() for p in self.parameters())
        # Target: < 500K parameters = ~2MB

# Version avec caractères chinois
class ChineseUrgencyModel(nn.Module):
    def __init__(self, chinese_vocab=5000):
        super().__init__()
        # Embedding pour caractères chinois courants
        self.chinese_embed = nn.Embedding(chinese_vocab, 64)
        self.lstm = nn.LSTM(64, 128, batch_first=True)
        self.attention = nn.MultiheadAttention(128, 4)
        self.classifier = nn.Linear(128, 4)
        
    def forward(self, chinese_chars):
        x = self.chinese_embed(chinese_chars)
        x, _ = self.lstm(x)
        x, _ = self.attention(x, x, x)
        x = x.mean(dim=1)  # Global pooling
        return self.classifier(x)
```

#### Modèle 2 : Sentiment avec Contexte

```python
class ContextualSentimentModel(nn.Module):
    def __init__(self):
        super().__init__()
        # Pré-trained embeddings
        self.base = AutoModel.from_pretrained(
            "microsoft/MiniLM-L6-H256-uncased"  # 17M params
        )
        
        # Fine-tuning head
        self.sentiment_head = nn.Sequential(
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, 5)  # 5 sentiments
        )
        
    def forward(self, input_ids, attention_mask):
        outputs = self.base(input_ids, attention_mask)
        pooled = outputs.last_hidden_state.mean(dim=1)
        return self.sentiment_head(pooled)
```

### Phase 4 : Entraînement Efficace (Semaine 4)

```python
# Configuration d'entraînement
training_config = {
    "urgency": {
        "model": UrgencyNanoModel(),
        "epochs": 10,
        "batch_size": 32,
        "lr": 0.001,
        "optimizer": "AdamW",
        "loss": "CrossEntropyLoss",
        "early_stopping": 3,
        "target_accuracy": 0.95
    },
    "sentiment": {
        "model": ContextualSentimentModel(),
        "epochs": 5,
        "batch_size": 16,
        "lr": 0.0001,
        "optimizer": "Adam",
        "loss": "CrossEntropyLoss",
        "target_accuracy": 0.92
    }
}

# Script d'entraînement
def train_model(config, dataset):
    model = config["model"]
    optimizer = getattr(torch.optim, config["optimizer"])(
        model.parameters(), lr=config["lr"]
    )
    
    for epoch in range(config["epochs"]):
        for batch in DataLoader(dataset, batch_size=config["batch_size"]):
            optimizer.zero_grad()
            outputs = model(batch["input"])
            loss = F.cross_entropy(outputs, batch["labels"])
            loss.backward()
            optimizer.step()
            
        # Validation
        accuracy = validate(model, val_dataset)
        print(f"Epoch {epoch}: Accuracy {accuracy:.4f}")
        
        if accuracy > config["target_accuracy"]:
            break
    
    return model
```

### Phase 5 : Optimisation pour Production (Semaine 5)

#### Quantization (Réduction 4×)

```python
# Quantization 8-bit
def quantize_model(model):
    import torch.quantization as quant
    
    # Prepare
    model.eval()
    model_prepared = quant.prepare(model)
    
    # Calibrate with data
    with torch.no_grad():
        for batch in calibration_data:
            model_prepared(batch)
    
    # Convert
    model_int8 = quant.convert(model_prepared)
    
    # Size reduction
    original_size = get_model_size(model)  # 20MB
    quantized_size = get_model_size(model_int8)  # 5MB
    
    print(f"Size reduced: {original_size}MB → {quantized_size}MB")
    return model_int8
```

#### Export ONNX pour Rust

```python
def export_to_onnx(model, example_input, output_path):
    model.eval()
    
    torch.onnx.export(
        model,
        example_input,
        output_path,
        export_params=True,
        opset_version=14,
        do_constant_folding=True,
        input_names=['input'],
        output_names=['output'],
        dynamic_axes={
            'input': {0: 'batch_size', 1: 'sequence'},
            'output': {0: 'batch_size'}
        }
    )
    
    # Optimize ONNX
    import onnx
    from onnxoptimizer import optimize
    
    model_onnx = onnx.load(output_path)
    model_optimized = optimize(model_onnx)
    onnx.save(model_optimized, output_path.replace('.onnx', '_opt.onnx'))
    
    print(f"Exported to {output_path}")
```

### Phase 6 : Intégration dans SPU Rust (Semaine 6)

```rust
// Structure pour modèles custom
pub struct CustomModels {
    urgency: ONNXModel,
    sentiment: ONNXModel,
    category: ONNXModel,
    bant: ONNXModel,
    entities: ONNXModel,
}

impl CustomModels {
    pub fn load() -> Result<Self> {
        Ok(Self {
            urgency: ONNXModel::load("models/urgency_opt.onnx")?,
            sentiment: ONNXModel::load("models/sentiment_opt.onnx")?,
            category: ONNXModel::load("models/category_opt.onnx")?,
            bant: ONNXModel::load("models/bant_opt.onnx")?,
            entities: ONNXModel::load("models/entities_opt.onnx")?,
        })
    }
    
    pub async fn analyze_email(&self, text: &str) -> EmailAnalysis {
        // Tokenization
        let tokens = self.tokenize(text);
        
        // Parallel inference
        let (urgency, sentiment, category, bant) = tokio::join!(
            self.urgency.infer(&tokens),
            self.sentiment.infer(&tokens),
            self.category.infer(&tokens),
            self.bant.infer(&tokens)
        );
        
        EmailAnalysis {
            urgency: decode_urgency(urgency?),
            sentiment: decode_sentiment(sentiment?),
            category: decode_category(category?),
            bant: decode_bant(bant?),
            latency_ms: 0.8,  // < 1ms total !
        }
    }
}
```

## 📊 Métriques de Succès

### Objectifs de Performance

| Modèle | Accuracy Target | Latence Max | Taille Max | F1 Score Min |
|--------|----------------|-------------|------------|--------------|
| Urgency | 95% | 0.5ms | 5MB | 0.94 |
| Sentiment | 92% | 1ms | 10MB | 0.90 |
| BANT | 90% | 2ms | 15MB | 0.88 |
| Category | 93% | 1ms | 8MB | 0.91 |
| Entities | 88% | 3ms | 20MB | 0.85 |

### Tests de Validation

```python
def validate_model_performance(model, test_set):
    metrics = {
        "accuracy": [],
        "latency": [],
        "memory": []
    }
    
    for batch in test_set:
        start = time.perf_counter()
        predictions = model(batch["input"])
        latency = (time.perf_counter() - start) * 1000
        
        accuracy = (predictions.argmax(1) == batch["labels"]).mean()
        memory = get_memory_usage()
        
        metrics["accuracy"].append(accuracy)
        metrics["latency"].append(latency)
        metrics["memory"].append(memory)
    
    print(f"Average Accuracy: {np.mean(metrics['accuracy']):.4f}")
    print(f"Average Latency: {np.mean(metrics['latency']):.2f}ms")
    print(f"Max Memory: {np.max(metrics['memory']):.1f}MB")
```

## 🔄 Cycle d'Amélioration Continue

### Pipeline MLOps

```yaml
# .github/workflows/model-training.yml
name: Model Training Pipeline

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly
  workflow_dispatch:

jobs:
  collect_data:
    steps:
      - name: Collect new emails
        run: python scripts/collect_data.py
      
  train_models:
    steps:
      - name: Train urgency model
        run: python train.py --model urgency
      
      - name: Validate performance
        run: python validate.py --model urgency
        
  deploy:
    if: success()
    steps:
      - name: Export to ONNX
        run: python export.py --format onnx
        
      - name: Deploy to SPU
        run: cargo test --features custom-models
```

### Monitoring en Production

```rust
// Métriques des modèles custom
pub struct ModelMetrics {
    pub predictions_count: AtomicU64,
    pub total_latency_us: AtomicU64,
    pub accuracy_tracker: AccuracyTracker,
    pub drift_detector: DriftDetector,
}

impl ModelMetrics {
    pub fn should_retrain(&self) -> bool {
        self.accuracy_tracker.get_accuracy() < 0.90 ||
        self.drift_detector.significant_drift()
    }
}
```

## 🎯 Roadmap

### Phase 2.1 : Modèles Basiques (Mois 1)
- [ ] Urgency Detector
- [ ] Sentiment Analyzer
- [ ] Category Classifier

### Phase 2.2 : Modèles Avancés (Mois 2)
- [ ] BANT Qualifier
- [ ] Entity Extractor
- [ ] Intent Detector

### Phase 2.3 : Modèles Spécialisés (Mois 3)
- [ ] Complaint Detector
- [ ] Lead Scorer
- [ ] Response Suggester

### Phase 2.4 : Optimisation (Mois 4)
- [ ] Quantization 4-bit
- [ ] Pruning
- [ ] Knowledge Distillation

## ⚠️ Important

**NE PAS COMMENCER AVANT QUE :**
1. ✅ SPU de base fonctionne
2. ✅ Pipeline email opérationnel
3. ✅ 5,000+ emails collectés
4. ✅ Infrastructure Rust stable

---

*Les modèles custom transformeront SPU en système vraiment intelligent et spécifique à vos besoins.*

→ Retour à [Architecture Rust](../01-rust-architecture/README.md)