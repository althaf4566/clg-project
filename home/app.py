from flask import Flask, render_template, request, jsonify
import pickle
import pandas as pd

app = Flask(__name__)

# Load the saved AI components
with open('clf_model.pkl', 'rb') as f:
    model = pickle.load(f)
with open('encoders.pkl', 'rb') as f:
    encoders = pickle.load(f)

@app.route('/')
def index():
    return render_template('profile-find-job.html')

# Helper function to ensure we don't crash on 'yes'/'no' strings
def handle_binary_input(val):
    val = str(val).strip().lower()
    if val in ['yes', 'no']:
        return val
    # If it's a number (like '5' from your scale), convert to yes/no
    try:
        score = int(val)
        return 'yes' if score >= 3 else 'no'
    except:
        return 'yes' # Default fallback

@app.route('/api/jobs', methods=['POST'])
def predict():
    try:
        json_data = request.json
        
        # 1. Map Frontend Data to Model Features
        raw_input = {
            'Acedamic percentage in Operating Systems': float(json_data.get('OS_percent', 0)),
            'percentage in Algorithms': float(json_data.get('Algorithms_percent', 0)),
            'Percentage in Programming Concepts': float(json_data.get('Programming_percent', 0)),
            'Percentage in Software Engineering': float(json_data.get('SE_percent', 0)),
            'Percentage in Computer Networks': float(json_data.get('Networks_percent', 0)),
            'Percentage in Electronics Subjects': float(json_data.get('Electronics_percent', 0)),
            'Percentage in Computer Architecture': float(json_data.get('Architecture_percent', 0)),
            'Percentage in Mathematics': float(json_data.get('Math_percent', 0)),
            'Percentage in Communication skills': float(json_data.get('Comm_percent', 0)),
            
            # These are actual numbers, so int() is fine here
            'Logical quotient rating': int(json_data.get('Logical_Rating', 1)),
            'hackathons': int(json_data.get('Hackathons_Count', 0)),
            'coding skills rating': int(json_data.get('Coding_Rating', 1)),
            'public speaking points': int(json_data.get('public speaking points', 1)),
            
            # FIX: Use the helper for binary fields to avoid the int() error
            'self-learning capability?': handle_binary_input(json_data.get('Self_Learning', 'yes')),
            'worked in teams ever?': handle_binary_input(json_data.get('Teamwork_Exp', 'yes')),
            
            'Extra-courses did': 'yes',
            'certifications': str(json_data.get('Certifications', 'shell programming')).lower(),
            'workshops': str(json_data.get('Workshops', 'cloud computing')).lower(),
            'Interested subjects': str(json_data.get('Interested_Subjects', 'networks')).lower(),
            'interested career area ': str(json_data.get('Career_Area', 'system developer')).lower(),
            'Type of company want to settle in?': str(json_data.get('Company_Type', 'Web Services')),
            'reading and writing skills': str(json_data.get('reading and writing skills', 'medium')).lower(),
            
            # Defaults for columns dropped during training but still expected by model structure
            'Job/Higher Studies?': 'job',
            'Taken inputs from seniors or elders': 'yes',
            'Management or Technical': 'Technical'
        }

        df = pd.DataFrame([raw_input])

        # 2. Apply Encoders (This converts 'yes'/'no' into the numbers the model needs)
        for col, le in encoders.items():
            if col in df.columns:
                val = str(df[col].iloc[0]).strip().lower()
                try:
                    df[col] = le.transform([val])
                except ValueError:
                    # If user typed something unknown, use the most common label
                    df[col] = le.transform([le.classes_[0]])

        # 3. Ensure column order matches training
        df = df[model.feature_names_in_]

        prediction = model.predict(df)[0]
        return jsonify({"msg": "Success", "recommended_jobs": [{"title": prediction, "company": "AI Best Match", "match_score": 95}]})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"msg": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)