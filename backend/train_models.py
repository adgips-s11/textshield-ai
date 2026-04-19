"""
train_models.py
===============
Train (or retrain) both ML models by merging the original CSV datasets
with all user feedback stored in the SQLite database.

Run once before starting the server:
    python train_models.py

Also importable — routes.py calls train_all_models() for auto/manual retrain.
"""

import os
import pickle
import re
import string
import logging
import pandas as pd
from typing import List, Dict

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MODELS_DIR = "app/models"
os.makedirs(MODELS_DIR, exist_ok=True)

SPAM_CSV_CANDIDATES = [
    "datasets/spam_dataset.csv",
    "spam_dataset.csv",
    "../spam_dataset.csv",
]


def _clean(text: str) -> str:
    text = str(text).lower()
    text = re.sub(r"http\S+|www\S+|https\S+", "", text)
    text = re.sub(r"\S+@\S+", "", text)
    text = re.sub(r"\d+", "", text)
    text = text.translate(str.maketrans("", "", string.punctuation))
    return " ".join(text.split())


def _load_feedback() -> tuple:
    try:
        import feedback_db
        spam_fb = feedback_db.get_spam_feedback()
        fn_fb   = feedback_db.get_fake_news_feedback()
        logger.info("Feedback loaded — spam: %d rows, fake_news: %d rows", len(spam_fb), len(fn_fb))
        return spam_fb, fn_fb
    except Exception as e:
        logger.warning("Could not load feedback DB (%s) — training without it.", e)
        return [], []


# ── Spam model ────────────────────────────────────────────────────────────────

def train_spam_model(spam_feedback: List[Dict]) -> None:
    print("\n" + "="*60)
    print("  Training Spam Detection Model")
    print("="*60)

    csv_path = next((p for p in SPAM_CSV_CANDIDATES if os.path.exists(p)), None)
    if csv_path is None:
        raise FileNotFoundError("spam_dataset.csv not found. Expected at: " + str(SPAM_CSV_CANDIDATES))

    df_csv = pd.read_csv(csv_path, encoding="latin-1", usecols=[0, 1])
    df_csv.columns = ["label", "text"]
    df_csv = df_csv.dropna()
    print(f"  CSV  : {len(df_csv):,} rows  {df_csv['label'].value_counts().to_dict()}")

    if spam_feedback:
        df_fb = pd.DataFrame(spam_feedback)
        df_all = pd.concat([df_csv, df_fb], ignore_index=True)
        print(f"  + DB : {len(df_fb):,} feedback rows merged")
    else:
        df_all = df_csv
        print("  + DB : 0 feedback rows (none yet)")

    df_all["text"] = df_all["text"].apply(_clean)
    print(f"  Total: {len(df_all):,} rows  {df_all['label'].value_counts().to_dict()}")

    X_tr, X_te, y_tr, y_te = train_test_split(
        df_all["text"], df_all["label"],
        test_size=0.2, random_state=42, stratify=df_all["label"],
    )
    vec   = TfidfVectorizer(ngram_range=(1, 2), max_features=10_000, sublinear_tf=True)
    model = MultinomialNB(alpha=0.1)
    model.fit(vec.fit_transform(X_tr), y_tr)

    preds = model.predict(vec.transform(X_te))
    print(f"\n  Accuracy : {accuracy_score(y_te, preds)*100:.2f}%")
    print(classification_report(y_te, preds))

    with open(f"{MODELS_DIR}/spam_detector.pkl",   "wb") as f: pickle.dump(model, f)
    with open(f"{MODELS_DIR}/spam_vectorizer.pkl", "wb") as f: pickle.dump(vec,   f)
    print("  Saved spam_detector.pkl + spam_vectorizer.pkl")


# ── Fake-news model ───────────────────────────────────────────────────────────

_SEED_FAKE = [
    "SHOCKING: Scientists discover that drinking bleach cures cancer, government hiding the truth",
    "BREAKING: Aliens have landed in Nevada and the military is covering it up completely",
    "You won't believe what they found in vaccines — doctors are terrified of this secret",
    "The moon landing was FAKED in a Hollywood studio, leaked documents prove it",
    "This miracle cure your doctor doesn't want you to know about destroys all viruses",
    "EXPOSED: 5G towers are secretly mind-control devices activated by big tech billionaires",
    "Secret underground city found beneath Antarctica — globalists are hiding this from us",
    "Thousands of birds suddenly drop dead after 5G test — media blackout in effect",
    "Government weather machines are causing hurricanes to control the population",
    "Doctors HATE this one weird trick that cures diabetes overnight guaranteed",
    "Hollywood elites drink child blood in secret rituals, whistleblower reveals all",
    "COVID-19 was a bioweapon created in a lab to reduce world population deliberately",
    "Bill Gates microchips are in every COVID vaccine to track your location 24/7",
    "LEAKED: NASA admits Earth is actually flat and has been lying for 500 years",
    "New World Order plans to replace cash with digital currency to control everyone",
    "Explosive report: Chemtrails contain mind-altering chemicals sprayed on citizens",
    "REVEALED: The cure for all cancers has been suppressed by Big Pharma for profit",
    "Robots disguised as politicians are running our government, insider claims",
    "Scientists ADMIT that evolution is a hoax invented to destroy religious faith",
    "Global elites are building bunkers ahead of planned extinction event they created",
    "Whistleblower: FBI secretly arresting citizens and replacing them with clones",
    "BOMBSHELL: The sun is artificial and controlled by a secret government agency",
    "Eating raw garlic cures HIV — doctors don't want you to know this natural secret",
    "Entire mainstream media owned by three people who control all information flow",
    "BREAKING NEWS: Celebrities being replaced by AI doubles, sources claim exclusively",
    "Secret treaty allows foreign troops to patrol American cities without your knowledge",
    "Ancient pyramids powered by free energy technology that has been destroyed by elites",
    "Magnetic implants in COVID vaccines causing people to become magnetized permanently",
    "Elite bankers control all world governments through a secret underground council",
    "SHOCKING VIDEO: Mayor caught admitting chemtrails are real and dangerous",
    "Scientists warn: Eating microwave popcorn will give you cancer in exactly 30 days",
    "EXPOSED: The tooth fairy is a government spy program collecting DNA from children",
    "Chocolate cures depression permanently according to study doctors are hiding from us",
    "ALERT: New law allows government to enter your home at night without a warrant",
    "Scientists discover time travel machine hidden under Denver International Airport",
    "Celebrity reveals: All pop music contains subliminal messages to control listeners",
    "Mysterious deaths of scientists who discovered free energy covered up by oil companies",
    "BREAKING: Water fluoridation is actually a mind control program started in 1950s",
    "Proof emerges that dinosaurs never existed fossils planted by museum conspiracy",
    "George Soros personally paying protesters 500 dollars a day to cause riots nationwide",
    "Obama born in Kenya, new birth certificate proves the lie the media won't discuss",
    "Antifa planning to overthrow government on specific date, leaked chat logs show",
    "Deep state operatives have been poisoning water supply to cause mass infertility",
    "EXPOSED: Every major election for 50 years has been rigged by globalist organization",
    "Secret society of lizard people has controlled world governments since ancient times",
    "Hospital secretly killing patients to harvest organs for black market profit scheme",
    "Facebook is listening to your conversations through your phone even when app is closed",
    "China has already taken over five American cities — media won't report this truth",
    "Scientists reveal: The human brain can be completely reprogrammed by television signals",
    "Whistleblower claims Antarctica is actually a giant dome surrounding flat earth",
]

_SEED_REAL = [
    "Federal Reserve raises interest rates by 25 basis points amid ongoing inflation concerns",
    "Scientists at Stanford University publish new research on climate change mitigation",
    "Congress passes bipartisan infrastructure bill after months of negotiations",
    "Apple announces record quarterly earnings driven by iPhone and services revenue growth",
    "WHO releases updated guidelines on antibiotic resistance and appropriate medication use",
    "Local city council approves new zoning laws to increase affordable housing supply",
    "NASA James Webb telescope captures detailed images of a distant galaxy formation",
    "University researchers develop more efficient solar panel using new materials",
    "Stock markets decline following concerns about rising bond yields globally",
    "Supreme Court issues ruling on digital privacy rights in the modern technological age",
    "Scientists discover new species of deep-sea fish in the Pacific Ocean trench area",
    "United Nations climate summit concludes with agreement to reduce carbon emissions",
    "Tech giants face antitrust scrutiny from European regulators over market dominance",
    "Researchers publish study linking sleep deprivation to increased cardiovascular risk",
    "International trade negotiations stall over disagreements on tariff reduction terms",
    "New electric vehicle battery technology promises longer range and faster charging",
    "Central bank announces policy review to address persistent inflationary pressures",
    "Archaeologists uncover ancient Roman settlement beneath modern European city center",
    "Major pharmaceutical company releases results of clinical trial for new diabetes drug",
    "City officials announce expansion of public transit system to reduce traffic congestion",
    "Scientists warn of declining bee populations and impact on agricultural ecosystems",
    "Education department releases annual report showing improvement in literacy rates",
    "Hospital network expands telehealth services following increased patient demand",
    "Government officials meet to discuss border security and immigration policy reforms",
    "New study finds Mediterranean diet linked to reduced risk of heart disease",
    "Technology company announces layoffs amid restructuring to focus on core business",
    "Researchers make progress on Alzheimer treatment in early-stage clinical trials",
    "Global shipping disruptions cause delays and price increases across multiple industries",
    "Environmental agency releases report on air quality improvements in major cities",
    "Sports federation announces new doping regulations effective from next season",
    "Central bank governor testifies before parliament about monetary policy decisions",
    "Scientists track migratory patterns of endangered species using satellite technology",
    "Local government launches initiative to plant one million trees over next decade",
    "International court issues ruling in maritime boundary dispute between two nations",
    "Consumer price index rises slightly driven by energy and food costs according to data",
    "Technology startup secures funding to develop renewable energy storage solutions",
    "Public health officials urge vaccination as flu season approaches in northern hemisphere",
    "New regulations require greater transparency in algorithmic decision-making systems",
    "University study examines impact of social media use on adolescent mental health",
    "Government announces budget allocation for infrastructure repair and modernization",
    "Economists forecast modest growth for next quarter based on employment and trade data",
    "Scientists successfully test new method for carbon capture at industrial facilities",
    "City adopts new recycling program aiming to reduce landfill waste by forty percent",
    "Global leaders gather at summit to address food security challenges in developing nations",
    "Researchers identify genetic factors that may influence risk of developing type 2 diabetes",
    "Tech industry reports increasing demand for cybersecurity professionals amid rising attacks",
    "New traffic safety study recommends lower speed limits in residential neighborhoods",
    "International aid organization distributes emergency supplies following natural disaster",
    "Regulators approve new cholesterol medication following successful phase three trials",
    "Scientists confirm that regular physical exercise reduces risk of cognitive decline",
    "Senate committee holds hearings on proposed changes to social security benefits",
    "Aviation authority releases safety recommendations following investigation of incident",
    "New study shows urban green spaces improve mental health and community wellbeing",
    "Health department launches campaign to increase awareness of preventable diseases",
    "Trade union negotiates new contract with major employer securing better wages",
    "Scientists develop new material that conducts electricity more efficiently at room temperature",
    "City announces plan to convert abandoned industrial sites into community parks",
    "Research institutions collaborate on international study of ocean temperature trends",
    "Government launches digital literacy program to help seniors use online services",
    "Environmental group releases annual report on deforestation rates in tropical regions",
    "Medical researchers identify biomarker that could help diagnose early-stage pancreatic cancer",
]


def train_fake_news_model(fn_feedback: List[Dict]) -> None:
    print("\n" + "="*60)
    print("  Training Fake News Detection Model")
    print("="*60)

    texts  = _SEED_FAKE + _SEED_REAL
    labels = ["fake"] * len(_SEED_FAKE) + ["real"] * len(_SEED_REAL)

    df = pd.DataFrame({"text": texts, "label": labels})
    print(f"  Seed : {len(df)} rows  {df['label'].value_counts().to_dict()}")

    if fn_feedback:
        df_fb = pd.DataFrame(fn_feedback)
        df = pd.concat([df, df_fb], ignore_index=True)
        print(f"  + DB : {len(df_fb)} feedback rows merged")
    else:
        print("  + DB : 0 feedback rows (none yet)")

    df["text"] = df["text"].apply(_clean)
    print(f"  Total: {len(df)} rows  {df['label'].value_counts().to_dict()}")

    X_tr, X_te, y_tr, y_te = train_test_split(
        df["text"], df["label"],
        test_size=0.2, random_state=42, stratify=df["label"],
    )
    vec   = TfidfVectorizer(ngram_range=(1, 3), max_features=5_000, sublinear_tf=True)
    model = LogisticRegression(C=1.0, max_iter=1000, random_state=42)
    model.fit(vec.fit_transform(X_tr), y_tr)

    preds = model.predict(vec.transform(X_te))
    print(f"\n  Accuracy : {accuracy_score(y_te, preds)*100:.2f}%")
    print(classification_report(y_te, preds))

    with open(f"{MODELS_DIR}/fake_news_detector.pkl",   "wb") as f: pickle.dump(model, f)
    with open(f"{MODELS_DIR}/fake_news_vectorizer.pkl", "wb") as f: pickle.dump(vec,   f)
    print("  Saved fake_news_detector.pkl + fake_news_vectorizer.pkl")


# ── Public entry point ────────────────────────────────────────────────────────

def train_all_models() -> None:
    spam_fb, fn_fb = _load_feedback()
    train_spam_model(spam_fb)
    train_fake_news_model(fn_fb)
    print("\n" + "="*60)
    print("  All models trained and saved successfully!")
    print(f"  Location : {os.path.abspath(MODELS_DIR)}")
    print("="*60 + "\n")


if __name__ == "__main__":
    train_all_models()