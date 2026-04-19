from typing import Dict

class ContentTypeClassifier:
    NEWS_KEYWORDS = {
        'breaking', 'report', 'reports', 'study', 'research', 'scientists',
        'according', 'published', 'announced', 'investigation', 'sources',
        'officials', 'government', 'president', 'minister', 'senate',
        'parliament', 'economy', 'economic', 'market', 'analysis', 'data',
        'findings', 'evidence', 'experts', 'professor', 'university',
        'conference', 'statement', 'revealed', 'discovered', 'survey'
    }
    
    SMS_KEYWORDS = {
        'click', 'free', 'win', 'winner', 'prize', 'congratulations',
        'urgent', 'claim', 'limited', 'offer', 'discount', 'call now',
        'text', 'reply', 'verify', 'account', 'suspended', 'expires',
        'meeting', 'lunch', 'tomorrow', 'see you', 'thanks', 'reminder',
        'hey', 'hello', 'hi', 'dear', 'regards', 'sincerely'
    }
    
    @staticmethod
    def classify_content_type(text: str) -> str:
        text_lower = text.lower()
        words = text_lower.split()
        word_count = len(words)
        
        length_score = 2 if word_count > 30 else (1 if word_count > 15 else -1)
        
        news_count = sum(1 for kw in ContentTypeClassifier.NEWS_KEYWORDS if kw in text_lower)
        sms_count = sum(1 for kw in ContentTypeClassifier.SMS_KEYWORDS if kw in text_lower)
        
        sentence_count = text.count('.') + text.count('!') + text.count('?')
        avg_words = word_count / max(sentence_count, 1)
        structure_score = 1 if avg_words > 15 else -1
        
        punct_score = -2 if ('!!!' in text or '???' in text) else 0
        
        caps_count = sum(1 for w in words if w.isupper() and len(w) > 2)
        caps_score = -1 if caps_count > 2 else 0
        
        total = (
            length_score +
            (news_count * 2) -
            (sms_count * 2) +
            structure_score +
            punct_score +
            caps_score
        )
        
        return 'news' if total > 0 else 'sms'
    
    @staticmethod
    def get_content_features(text: str) -> Dict:
        text_lower = text.lower()
        words = text_lower.split()
        
        news_kw = [kw for kw in ContentTypeClassifier.NEWS_KEYWORDS if kw in text_lower]
        sms_kw = [kw for kw in ContentTypeClassifier.SMS_KEYWORDS if kw in text_lower]
        
        return {
            'word_count': len(words),
            'news_keywords': news_kw[:5],
            'sms_keywords': sms_kw[:5],
            'has_excessive_punctuation': '!!!' in text or '???' in text,
            'classified_as': ContentTypeClassifier.classify_content_type(text)
        }