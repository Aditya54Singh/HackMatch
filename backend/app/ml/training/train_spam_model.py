import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import classification_report, accuracy_score
from scipy.stats import randint, uniform

import os
import pandas as pd

BASE_DIR = os.path.abspath(os.path.join(os.getcwd(), ".."))
DATA_PATH = os.path.join(BASE_DIR, "dataset", "raw", "balanced_hackathon_dataset.csv")

df = pd.read_csv(DATA_PATH)

print("\nCorrelation with label:\n")
print(df.corr()["label"].sort_values(ascending=False))


X = df.drop(["label"], axis=1)
y = df["label"]

# Train-Test Split (holdout set)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Scaling for Logistic Regression
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)


# -----------------------------
# 1️⃣ Logistic Regression
# -----------------------------
log_reg = LogisticRegression(max_iter=1000)

log_params = {
    "C": uniform(0.01, 10),
    "penalty": ["l2"]
}

log_search = RandomizedSearchCV(
    log_reg,
    log_params,
    n_iter=20,
    cv=5,
    scoring="f1",
    random_state=42,
    n_jobs=-1
)

log_search.fit(X_train_scaled, y_train)
log_best = log_search.best_estimator_


# -----------------------------
# 2️⃣ Random Forest
# -----------------------------
rf = RandomForestClassifier()

rf_params = {
    "n_estimators": randint(100, 500),
    "max_depth": randint(3, 15),
    "min_samples_split": randint(2, 10)
}

rf_search = RandomizedSearchCV(
    rf,
    rf_params,
    n_iter=20,
    cv=5,
    scoring="f1",
    random_state=42,
    n_jobs=-1
)

rf_search.fit(X_train, y_train)
rf_best = rf_search.best_estimator_


# -----------------------------
# 3️⃣ Gradient Boosting
# -----------------------------
gb = GradientBoostingClassifier()

gb_params = {
    "n_estimators": randint(100, 400),
    "learning_rate": uniform(0.01, 0.3),
    "max_depth": randint(3, 10)
}

gb_search = RandomizedSearchCV(
    gb,
    gb_params,
    n_iter=20,
    cv=5,
    scoring="f1",
    random_state=42,
    n_jobs=-1
)

gb_search.fit(X_train, y_train)
gb_best = gb_search.best_estimator_


# -----------------------------
# Compare on Test Set
# -----------------------------
models = {
    "Logistic Regression": log_best,
    "Random Forest": rf_best,
    "Gradient Boosting": gb_best
}

best_model = None
best_score = 0

for name, model in models.items():

    if name == "Logistic Regression":
        y_pred = model.predict(X_test_scaled)
    else:
        y_pred = model.predict(X_test)

    score = accuracy_score(y_test, y_pred)

    print(f"\n{name}")
    print("Accuracy:", score)
    print(classification_report(y_test, y_pred))

    if score > best_score:
        best_score = score
        best_model = model
        best_name = name


print(f"\nBest Model: {best_name} with Accuracy {best_score}")

# Save best model
import os

SAVE_DIR = os.path.join(os.getcwd(), "app", "ml", "saved_models")

os.makedirs(SAVE_DIR, exist_ok=True)

joblib.dump(best_model, os.path.join(SAVE_DIR, "spam_model.pkl"))
joblib.dump(scaler, os.path.join(SAVE_DIR, "scaler.pkl"))


print("\nBest model saved successfully.")
print("Training Columns Order:")
print(X.columns.tolist())


