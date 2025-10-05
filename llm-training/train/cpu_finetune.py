#!/usr/bin/env python3
"""
CPU-only Exoplanet LLM Fine-tuning Demo
Simplified training script that works reliably on CPU
"""

import os
import json
import argparse
from typing import Dict, List
import torch
from datasets import Dataset
from transformers import (
    AutoTokenizer, 
    AutoModelForCausalLM, 
    TrainingArguments,
    Trainer,
    DataCollatorForLanguageModeling
)

# Force CPU usage for compatibility
os.environ["CUDA_VISIBLE_DEVICES"] = ""
if hasattr(torch.backends, 'mps'):
    torch.backends.mps.is_available = lambda: False

def load_exoplanet_dataset(dataset_path: str) -> Dataset:
    """Load and format exoplanet dataset for training"""
    
    with open(dataset_path, 'r') as f:
        data = json.load(f)
    
    # Format for training
    formatted_data = []
    for item in data:
        if 'messages' in item and len(item['messages']) >= 2:
            # Convert conversation to text
            text = ""
            for message in item['messages']:
                if message['role'] == 'user':
                    text += f"Human: {message['content']}\n"
                elif message['role'] == 'assistant':
                    text += f"Assistant: {message['content']}\n"
            
            if text.strip():
                formatted_data.append({"text": text.strip()})
    
    return Dataset.from_list(formatted_data)

def tokenize_function(examples, tokenizer, max_length=256):
    """Tokenize the examples"""
    result = tokenizer(
        examples["text"],
        truncation=True,
        padding=True,
        max_length=max_length,
        return_tensors="pt"
    )
    # Add labels for language modeling
    result["labels"] = result["input_ids"].clone()
    return result

def main():
    parser = argparse.ArgumentParser(description="CPU fine-tune for exoplanet reasoning")
    parser.add_argument("--model", type=str, default="distilgpt2",
                       help="Base model to fine-tune")
    parser.add_argument("--dataset", type=str, required=True,
                       help="Path to training dataset")
    parser.add_argument("--output_dir", type=str, default="./outputs/cpu_model",
                       help="Output directory for trained model")
    parser.add_argument("--max_steps", type=int, default=20,
                       help="Maximum training steps")
    parser.add_argument("--learning_rate", type=float, default=5e-5,
                       help="Learning rate")
    
    args = parser.parse_args()
    
    print(f"🚀 Starting CPU-based fine-tuning demo")
    print(f"📊 Dataset: {args.dataset}")
    print(f"🤖 Model: {args.model}")
    print(f"💾 Output: {args.output_dir}")
    
    # Load dataset
    print("📚 Loading dataset...")
    dataset = load_exoplanet_dataset(args.dataset)
    print(f"✅ Loaded {len(dataset)} training examples")
    
    # Show sample data
    if len(dataset) > 0:
        print(f"📝 Sample: {dataset[0]['text'][:100]}...")
    
    # Load model and tokenizer
    print("🤖 Loading model and tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained(args.model)
    model = AutoModelForCausalLM.from_pretrained(args.model)
    
    # Add pad token if missing
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
        model.config.pad_token_id = tokenizer.eos_token_id
    
    # Tokenize dataset
    print("🔤 Tokenizing dataset...")
    tokenized_dataset = dataset.map(
        lambda examples: tokenize_function(examples, tokenizer),
        batched=True,
        remove_columns=dataset.column_names
    )
    
    # Setup training arguments
    training_args = TrainingArguments(
        output_dir=args.output_dir,
        overwrite_output_dir=True,
        num_train_epochs=1,
        max_steps=args.max_steps,
        per_device_train_batch_size=1,  # Small batch for CPU
        learning_rate=args.learning_rate,
        logging_steps=5,
        save_steps=args.max_steps,  # Save at the end
        save_total_limit=1,
        prediction_loss_only=True,
        remove_unused_columns=False,
        dataloader_num_workers=0,  # Avoid multiprocessing issues
        report_to=[],  # Disable wandb
    )
    
    # Data collator
    data_collator = DataCollatorForLanguageModeling(
        tokenizer=tokenizer,
        mlm=False,
    )
    
    # Initialize trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_dataset,
        data_collator=data_collator,
    )
    
    print("💻 Using CPU for training")
    
    # Start training
    print("🏋️ Starting training...")
    try:
        trainer.train()
        
        # Save model
        print("💾 Saving model...")
        trainer.save_model()
        tokenizer.save_pretrained(args.output_dir)
        
        print("✅ Training completed!")
        print(f"📁 Model saved to: {args.output_dir}")
        
        # Quick test
        print("\n🧪 Quick test:")
        test_prompt = "Human: What is the transit method?\nAssistant:"
        inputs = tokenizer.encode(test_prompt, return_tensors="pt")
        
        with torch.no_grad():
            outputs = model.generate(
                inputs,
                max_new_tokens=30,
                temperature=0.8,
                do_sample=True,
                pad_token_id=tokenizer.eos_token_id
            )
        
        response = tokenizer.decode(outputs[0], skip_special_tokens=True)
        print(f"Input: {test_prompt}")
        print(f"Output: {response}")
        
    except Exception as e:
        print(f"❌ Training error: {e}")
        print("Demo completed - for production use GPU training with more data")

if __name__ == "__main__":
    main()
