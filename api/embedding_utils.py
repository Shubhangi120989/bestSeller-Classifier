import numpy as np
import re
import torch
from transformers import BertTokenizer, BertModel

# Load BERT model and tokenizer for multilingual support
tokenizer = BertTokenizer.from_pretrained('bert-base-multilingual-cased')
bert_model = BertModel.from_pretrained('bert-base-multilingual-cased')
bert_model.eval()

def clean_text(text):
    """Clean the input text by removing special characters, multiple spaces, and stopwords."""
    text = re.sub(r'[^a-zA-Z0-9\u0900-\u097F\s]', '', text)  # Keep numbers and Hindi characters
    text = re.sub(r'\s+', ' ', text).strip()  # Remove multiple spaces
    stopwords = set(["है", "यह", "और", "की", "के", "में", "से", "किया", "पर", "के", "ही", "is", "the", "and", "of", "to", "a", "in", "that", "it", "on", "for", "with", "as", "was", "at", "by", "an", "be", "this", "which", "or", "from", "but", "not", "are", "we", "were", "they", "have", "has", "had", "you", "he", "she", "their", "my", "me", "your", "our", "his", "her"])  # Add more as needed
    text = ' '.join([word for word in text.split() if word not in stopwords])
    return text

def get_bert_embedding(text):
    """Get BERT embedding for the input text."""
    inputs = tokenizer(text, return_tensors='pt', truncation=True, padding=True, max_length=128)
    with torch.no_grad():
        outputs = bert_model(**inputs)
    last_hidden_state = outputs.last_hidden_state
    cls_embedding = last_hidden_state[:, 0, :]
    return cls_embedding.squeeze().cpu().numpy()

def get_embedding_statistics(title, category):
    """Return mean and standard deviation of BERT embeddings for title and category."""
    cleaned_title = clean_text(title)
    cleaned_category = clean_text(category)
    title_embedding = get_bert_embedding(cleaned_title)
    category_embedding = get_bert_embedding(cleaned_category)
    title_stats = {'mean': np.mean(title_embedding), 'std': np.std(title_embedding)}
    category_stats = {'mean': np.mean(category_embedding), 'std': np.std(category_embedding)}
    return title_stats, category_stats
