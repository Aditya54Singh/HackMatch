import os
import joblib
import numpy as np


# Load model once (not every request)
BASE_DIR = os.path.abspath(os.path.join(os.getcwd(), "app", "ml", "saved_models"))
MODEL_PATH = os.path.join(BASE_DIR, "spam_model.pkl")

model = joblib.load(MODEL_PATH)


def predict_spam(feature_dict):
    """
    feature_dict = {
        "title_length": int,
        "desc_length": int,
        "num_words": int,
        "num_links": int,
        "contains_telegram": int,
        "suspicious_keyword_count": int,
        "emoji_count": int,
        "prize_amount": float,
        "unrealistic_prize_flag": int,
        "organizer_account_age": int,
        "organizer_past_events": int,
        "posting_frequency_24h": int,
        "duplicate_similarity_score": float,
        "external_link_domain_score": float
    }
    """

    feature_order = [
        'title_length',
        'desc_length',
        'num_words',
        'num_links',
        'contains_telegram',
        'suspicious_keyword_count',
        'emoji_count',
        'prize_amount',
        'unrealistic_prize_flag',
        'organizer_account_age',
        'organizer_past_events',
        'posting_frequency_24h',
        'duplicate_similarity_score',
        'external_link_domain_score'
    ]

    features = np.array([[feature_dict[col] for col in feature_order]])

    probability = model.predict_proba(features)[0][1]

    probability = float(probability)

    if probability > 0.85:
        risk_status = "high_risk"
        is_blocked = True
    elif probability > 0.6:
        risk_status = "medium_risk"
        is_blocked = False
    else:
        risk_status = "legit"
        is_blocked = False

    return {
        "spam_probability": probability,
        "risk_status": risk_status,
        "is_blocked": is_blocked
    }

