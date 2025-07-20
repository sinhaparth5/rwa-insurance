import pandas as pd
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
import json
import os
import re

def extract_responses_from_conversations(df):
    """Extract user queries and bot responses from conversation data"""
    queries = []
    responses = []
    contexts = []
    
    for _, row in df.iterrows():
        conversation = row['training_conversation']
        
        # Split into user and bot parts
        parts = conversation.split('\n')
        
        user_query = ""
        bot_response = ""
        
        for part in parts:
            if part.startswith('User:'):
                user_query = part.replace('User:', '').strip().strip('"')
            elif part.startswith('Bot:'):
                bot_response = part.replace('Bot:', '').strip()
        
        if user_query and bot_response:
            queries.append(user_query)
            responses.append(bot_response)
            
            # Extract context
            context = {
                'value': row.get('value', 0),
                'risk_score': row.get('risk_score', 0),
                'premium': row.get('premium', 0),
                'vehicle_info': row.get('vehicle_info', ''),
                'location': row.get('location', 'London')
            }
            contexts.append(context)
    
    return queries, responses, contexts

def train_chatbot_model():
    """Train the chatbot model using FAISS index"""
    # Load training data
    chatbot_df = pd.read_csv('data/raw/chatbot_training_data.csv')
    
    # Extract queries and responses
    queries, responses, contexts = extract_responses_from_conversations(chatbot_df)
    
    # Initialize sentence transformer
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    # Encode all queries
    query_embeddings = model.encode(queries)
    
    # Create FAISS index
    dimension = query_embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(query_embeddings.astype('float32'))
    
    # Create model directory
    model_dir = 'data/models/chatbot_model'
    os.makedirs(model_dir, exist_ok=True)
    
    # Save FAISS index
    faiss.write_index(index, f"{model_dir}/chatbot_index.faiss")
    
    # Save responses and contexts
    with open(f"{model_dir}/chatbot_responses.json", 'w') as f:
        json.dump({
            'responses': responses,
            'contexts': contexts
        }, f)
    
    print(f"Chatbot model trained with {len(queries)} examples")
    
    return index, responses

if __name__ == "__main__":
    train_chatbot_model()