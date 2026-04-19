import sqlite3
import os
import logging
from typing import List, Dict

logger = logging.getLogger(__name__)

DB_PATH = "app/feedback.db"

OPPOSITE: Dict[str, str] = {
    "spam": "ham",
    "ham":  "spam",
    "fake": "real",
    "real": "fake",
}

def _get_conn() -> sqlite3.Connection:
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db() -> None:
    conn = _get_conn()
    try:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS spam_feedback (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                text       TEXT NOT NULL,
                label      TEXT NOT NULL CHECK(label IN ('spam','ham')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS fake_news_feedback (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                text       TEXT NOT NULL,
                label      TEXT NOT NULL CHECK(label IN ('fake','real')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()
        logger.info("Feedback database ready at %s", DB_PATH)
    finally:
        conn.close()

def store_spam_feedback(text: str, label: str) -> None:
    conn = _get_conn()
    try:
        conn.execute(
            "INSERT INTO spam_feedback (text, label) VALUES (?, ?)", (text, label)
        )
        conn.commit()
        logger.info("Spam feedback stored  label=%s", label)
    finally:
        conn.close()

def store_fake_news_feedback(text: str, label: str) -> None:
    conn = _get_conn()
    try:
        conn.execute(
            "INSERT INTO fake_news_feedback (text, label) VALUES (?, ?)", (text, label)
        )
        conn.commit()
        logger.info("Fake-news feedback stored  label=%s", label)
    finally:
        conn.close()

def get_spam_feedback() -> List[Dict[str, str]]:
    conn = _get_conn()
    try:
        rows = conn.execute("SELECT text, label FROM spam_feedback").fetchall()
        return [{"text": r["text"], "label": r["label"]} for r in rows]
    finally:
        conn.close()

def get_fake_news_feedback() -> List[Dict[str, str]]:
    conn = _get_conn()
    try:
        rows = conn.execute("SELECT text, label FROM fake_news_feedback").fetchall()
        return [{"text": r["text"], "label": r["label"]} for r in rows]
    finally:
        conn.close()

def get_counts() -> Dict[str, int]:
    conn = _get_conn()
    try:
        spam = conn.execute("SELECT COUNT(*) FROM spam_feedback").fetchone()[0]
        fn   = conn.execute("SELECT COUNT(*) FROM fake_news_feedback").fetchone()[0]
        return {"spam": spam, "fake_news": fn, "total": spam + fn}
    finally:
        conn.close()