import numpy as np
import pandas as pd
import faiss
from sentence_transformers import SentenceTransformer
import json
import os
from typing import List, Dict, Tuple, Optional

class ChatbotModel:
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.sentence_model = SentenceTransformer('all-MiniLM-L6-v2')
        self.index = None
        self.responses = []
        self.contexts = []
        
    def load_model(self):
        """Load the trained chatbot model and index"""
        if os.path.exists(f"{self.model_path}/chatbot_index.faiss"):
            self.index = faiss.read_index(f"{self.model_path}/chatbot_index.faiss")
            
            # Load responses and contexts
            with open(f"{self.model_path}/chatbot_responses.json", 'r') as f:
                data = json.load(f)
                self.responses = data['responses']
                self.contexts = data['contexts']
        else:
            raise FileNotFoundError(f"Chatbot model not found at {self.model_path}")
    
    def get_response(self, query: str, context: Optional[Dict] = None) -> str:
        """Get chatbot response for a query"""
        if self.index is None:
            self.load_model()
        
        # Encode query
        query_embedding = self.sentence_model.encode([query])
        
        # Search similar responses
        k = 5
        distances, indices = self.index.search(query_embedding.astype('float32'), k)
        
        # Get best matching response
        best_idx = indices[0][0]
        response_template = self.responses[best_idx]
        
        # Customize response with context if available
        if context:
            response = self._customize_response(response_template, context)
        else:
            response = response_template
        
        return response
    
    def _customize_response(self, template: str, context: Dict) -> str:
        """Customize response template with actual context data"""
        response = template
        
        # Replace placeholders with actual values
        if '{value}' in response and 'value' in context:
            response = response.replace('{value}', f"£{context['value']:,.0f}")
        
        if '{risk_score}' in response and 'risk_score' in context:
            response = response.replace('{risk_score}', f"{context['risk_score']:.0f}")
        
        if '{premium}' in response and 'premium' in context:
            response = response.replace('{premium}', f"£{context['premium']:.2f}")
        
        if '{location}' in response and 'location' in context:
            response = response.replace('{location}', context['location'])
        
        if '{vehicle_info}' in response and 'vehicle_info' in context:
            response = response.replace('{vehicle_info}', context['vehicle_info'])
        
        return response