import re
from datetime import datetime


SUSPICIOUS_KEYWORDS = [
    "urgent",
    "guaranteed",
    "limited",
    "offer",
    "pay",
    "exclusive",
    "win",
    "earn",
    "cash",
    "fast",
    "telegram",
    "now",
    "money"
]



def count_suspicious_keywords(text):
    text = text.lower()
    return sum(text.count(word) for word in SUSPICIOUS_KEYWORDS)


def count_links(text):
    return len(re.findall(r"http[s]?://", text))


def contains_telegram(text):
    return 1 if "telegram" in text.lower() else 0


def count_emojis(text):
    return len(re.findall(r"[😀-🙏]", text))


def compute_unrealistic_prize(prize_amount):
    return 1 if prize_amount > 70000 else 0


def compute_account_age_days(account_created_at):
    return (datetime.utcnow() - account_created_at).days


def build_feature_dict(hackathon_data, organizer):
    """
    hackathon_data: dict from request
    organizer: User object from DB
    """

    title = hackathon_data.get("title", "")
    description = hackathon_data.get("description", "")
    prize_amount = hackathon_data.get("prize_pool", 0)

    full_text = title + " " + description

    feature_dict = {
        "title_length": len(title),
        "desc_length": len(description),
        "num_words": len(full_text.split()),
        "num_links": count_links(full_text),
        "contains_telegram": contains_telegram(full_text),
        "suspicious_keyword_count": count_suspicious_keywords(full_text),
        "emoji_count": count_emojis(full_text),
        "prize_amount": prize_amount,
        "unrealistic_prize_flag": compute_unrealistic_prize(prize_amount),
        "organizer_account_age": compute_account_age_days(organizer.account_created_at),
        "organizer_past_events": len(organizer.hackathons),
        "posting_frequency_24h": 0, 
        "duplicate_similarity_score": 0.0,  # placeholder
        "external_link_domain_score": 0.5  # placeholder
    }

    return feature_dict
