#!/usr/bin/env python3
"""
Exoplanet LLM Fine-tuning with Unsloth
Optimized training script for exoplanet reasoning tasks
"""

import os
import json
import argparse
from typing import Dict, List, Optional
import torch
from datasets import Dataset, load_dataset
from transformers import TrainingArguments
from trl import SFTTrainer
from unsloth import FastLanguageModel
import wandb

# Model configurations
MODEL_CONFIGS = {
    "llama-3-8b": "unsloth/llama-3-8b-bnb-4bit",
    "llama-3-8b-instruct": "unsloth/llama-3-8b-Instruct-bnb-4bit",
    "qwen2.5-7b": "unsloth/Qwen2.5-7B-bnb-4bit",
    "qwen2.5-7b-instruct": "unsloth/Qwen2.5-7B-Instruct-bnb-4bit",
    "mistral-7b": "unsloth/mistral-7b-v0.3-bnb-4bit",
}

def load_exoplanet_dataset(dataset_path: str) -> Dataset:
    """Load and format exoplanet dataset for training"""
    
    if dataset_path.endswith('.json'):
        with open(dataset_path, 'r') as f:
            data = json.load(f)
    else:
        # Load from Hugging Face dataset
        data = load_dataset(dataset_path)['train']
    
    # Format for chat template
    def format_conversation(example):
        if 'conversation' in example:
            # Multi-turn conversation format
            messages = []
            for turn in example['conversation']:
                messages.append({"role": turn['role'], "content": turn['content']})
        else:
            # Simple Q&A format
            messages = [
                {"role": "user", "content": example['question']},
                {"role": "assistant", "content": example['answer']}
            ]
        
        return {"messages": messages}
    
    if isinstance(data, list):
        dataset = Dataset.from_list(data)
    else:
        dataset = data
    
    return dataset.map(format_conversation)

def setup_model_and_tokenizer(model_name: str, max_seq_length: int = 2048):
    """Initialize model and tokenizer with Unsloth optimizations"""
    
    model_path = MODEL_CONFIGS.get(model_name, model_name)
    
    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name=model_path,
        max_seq_length=max_seq_length,
        dtype=None,  # Auto-detect
        load_in_4bit=True,
    )
    
    # Apply LoRA adapters
    model = FastLanguageModel.get_peft_model(
        model,
        r=16,  # LoRA rank
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj",
                       "gate_proj", "up_proj", "down_proj"],
        lora_alpha=16,
        lora_dropout=0.05,
        bias="none",
        use_gradient_checkpointing="unsloth",
        random_state=42,
        use_rslora=False,
        loftq_config=None,
    )
    
    return model, tokenizer

def create_training_arguments(output_dir: str, **kwargs) -> TrainingArguments:
    """Create optimized training arguments"""
    
    return TrainingArguments(
        per_device_train_batch_size=2,
        gradient_accumulation_steps=4,
        warmup_steps=5,
        max_steps=60,  # Adjust based on dataset size
        learning_rate=2e-4,
        fp16=not torch.cuda.is_bf16_supported(),
        bf16=torch.cuda.is_bf16_supported(),
        logging_steps=1,
        optim="adamw_8bit",
        weight_decay=0.01,
        lr_scheduler_type="linear",
        seed=42,
        output_dir=output_dir,
        save_steps=20,
        save_total_limit=3,
        report_to="wandb" if wandb.run else None,
    )

def main():
    parser = argparse.ArgumentParser(description="Fine-tune LLM for exoplanet reasoning")
    parser.add_argument("--model", type=str, default="llama-3-8b-instruct",
                       choices=list(MODEL_CONFIGS.keys()),
                       help="Model to fine-tune")
    parser.add_argument("--dataset", type=str, required=True,
                       help="Path to training dataset")
    parser.add_argument("--output_dir", type=str, default="./outputs/finetuned_model",
                       help="Output directory for trained model")
    parser.add_argument("--max_seq_length", type=int, default=2048,
                       help="Maximum sequence length")
    parser.add_argument("--max_steps", type=int, default=60,
                       help="Maximum training steps")
    parser.add_argument("--learning_rate", type=float, default=2e-4,
                       help="Learning rate")
    parser.add_argument("--batch_size", type=int, default=2,
                       help="Per device batch size")
    parser.add_argument("--use_wandb", action="store_true",
                       help="Enable Weights & Biases logging")
    
    args = parser.parse_args()
    
    # Initialize wandb if requested
    if args.use_wandb:
        wandb.init(
            project="exoplanet-llm",
            name=f"finetune-{args.model}",
            config=vars(args)
        )
    
    print(f"🚀 Starting fine-tuning with {args.model}")
    print(f"📊 Dataset: {args.dataset}")
    print(f"💾 Output: {args.output_dir}")
    
    # Load dataset
    print("📚 Loading dataset...")
    dataset = load_exoplanet_dataset(args.dataset)
    print(f"✅ Loaded {len(dataset)} training examples")
    
    # Setup model and tokenizer
    print("🤖 Initializing model...")
    model, tokenizer = setup_model_and_tokenizer(args.model, args.max_seq_length)
    
    # Create training arguments
    training_args = create_training_arguments(
        output_dir=args.output_dir,
        max_steps=args.max_steps,
        learning_rate=args.learning_rate,
        per_device_train_batch_size=args.batch_size,
    )
    
    # Initialize trainer
    trainer = SFTTrainer(
        model=model,
        tokenizer=tokenizer,
        train_dataset=dataset,
        dataset_text_field="messages",
        max_seq_length=args.max_seq_length,
        dataset_num_proc=2,
        packing=False,
        args=training_args,
    )
    
    # Show model info
    if torch.cuda.is_available():
        gpu_stats = torch.cuda.get_device_properties(0)
        start_gpu_memory = round(torch.cuda.max_memory_reserved() / 1024 / 1024 / 1024, 3)
        max_memory = round(gpu_stats.total_memory / 1024 / 1024 / 1024, 3)
        print(f"🔥 GPU: {gpu_stats.name}")
        print(f"💾 GPU memory: {start_gpu_memory} GB / {max_memory} GB")
    else:
        print("💻 Using CPU for training")
    
    # Start training
    print("🏋️ Starting training...")
    trainer_stats = trainer.train()
    
    # Save model
    print("💾 Saving model...")
    model.save_pretrained(args.output_dir)
    tokenizer.save_pretrained(args.output_dir)
    
    # Print training stats
    print(f"✅ Training completed!")
    if torch.cuda.is_available():
        used_memory = round(torch.cuda.max_memory_reserved() / 1024 / 1024 / 1024, 3)
        used_memory_for_lora = round(used_memory - start_gpu_memory, 3)
        used_percentage = round(used_memory / max_memory * 100, 3)
        lora_percentage = round(used_memory_for_lora / max_memory * 100, 3)
        print(f"📊 Peak GPU memory: {used_memory} GB ({used_percentage}%)")
        print(f"🎯 LoRA memory usage: {used_memory_for_lora} GB ({lora_percentage}%)")
    print(f"📁 Model saved to: {args.output_dir}")
    
    if args.use_wandb:
        log_data = {"final_loss": trainer_stats.training_loss}
        if torch.cuda.is_available():
            log_data.update({
                "peak_gpu_memory_gb": used_memory,
                "lora_memory_gb": used_memory_for_lora,
            })
        wandb.log(log_data)
        wandb.finish()

if __name__ == "__main__":
    main()
