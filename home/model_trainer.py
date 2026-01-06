import pandas as pd
import pickle
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import LabelEncoder

# 1. Load Data
data = pd.read_csv("roo_data (2).csv")

# 2. DEFINITIVE DROP LIST (Must match Flask App exactly)
drop_cols = [
    "Salary Range Expected", "Salary/work", 
    "In a Realtionship?", "Introvert", "interested in games", 
    "hard/smart worker", "Hours working per day", 
    "can work long time before system?", "Interested Type of Books", 
    "Gentle or Tuff behaviour?", "olympiads", "talenttests taken?", 
    "memory capability score"
]
data = data.drop(columns=drop_cols, errors="ignore")

# 3. Categorical columns that need encoding
object_cols = [
    'certifications', ' public speaking points', 'workshops', 'reading and writing skills', 
    'Interested subjects', 'interested career area ', 
    'Type of company want to settle in?', 'Management or Technical', 
    'worked in teams ever?', 'Taken inputs from seniors or elders', 
    'Job/Higher Studies?', 'Extra-courses did', 'self-learning capability?'
]

encoders = {}
for col in object_cols:
    if col in data.columns:
        le = LabelEncoder()
        data[col] = le.fit_transform(data[col].astype(str))
        encoders[col] = le

# 4. Train Model
X = data.drop('Suggested Job Role', axis=1)
y = data['Suggested Job Role']
clf = DecisionTreeClassifier()
clf.fit(X, y)

# 5. Save everything
with open('clf_model.pkl', 'wb') as f:
    pickle.dump(clf, f)
with open('encoders.pkl', 'wb') as f:
    pickle.dump(encoders, f)

print("✅ Model trained and saved successfully.")