import re
import string
from typing import Dict

class TextPreprocessor:
    @staticmethod
    def clean_text(text: str) -> str:
        text = str(text).lower()
        text = re.sub(r'http\S+|www\S+|https\S+', '', text)
        text = re.sub(r'\S+@\S+', '', text)
        text = re.sub(r'\d+', '', text)
        text = text.translate(str.maketrans('', '', string.punctuation))
        text = ' '.join(text.split())
        return text
    
    @staticmethod
    def remove_stopwords(text: str, custom_stopwords: set = None) -> str:
        common_stopwords = {
            'the', 'is', 'at', 'which', 'on', 'a', 'an', 
            'and', 'or', 'but', 'in', 'with', 'to', 'for',
            'of', 'as', 'by', 'from', 'this', 'that', 'these',
            'those', 'be', 'been', 'being', 'have', 'has', 'had'
        }
        
        if custom_stopwords:
            common_stopwords.update(custom_stopwords)
        
        words = text.split()
        filtered = [w for w in words if w not in common_stopwords]
        
        return ' '.join(filtered)
    
    @staticmethod
    def get_text_stats(text: str) -> Dict[str, float]:
        words = text.split()
        sentences = text.count('.') + text.count('!') + text.count('?')
        
        return {
            'word_count': len(words),
            'char_count': len(text),
            'sentence_count': max(sentences, 1),
            'avg_word_length': sum(len(w) for w in words) / max(len(words), 1),
            'avg_sentence_length': len(words) / max(sentences, 1)
        }