from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz  # PyMuPDF
import re
from flask_cors import CORS
import os
import requests
app = Flask(__name__)
CORS(app)

# Load skills from file
with open("skills_list.txt") as f:
    skills_list = [line.strip().lower() for line in f]

def extract_text_from_pdf(file):
    doc = fitz.open(stream=file.read(), filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text.lower()

def clean_and_tokenize(text):
    text = re.sub(r'[^\w\s]', '', text)
    return text.split()

def extract_skills(tokens):
    return list(set(skill for skill in skills_list if skill in tokens))

@app.route('/extract-skills', methods=['POST'])
def extract_skills_from_resume():
    if 'resume' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['resume']
    text = extract_text_from_pdf(file)
    tokens = clean_and_tokenize(text)
    skills = extract_skills(tokens)
    return jsonify({'skills': skills})

if __name__ == '__main__':
    #app.run(debug=True ,port=5050)
    
    port = int(os.environ.get("PORT", 5050))
    app.run(host='0.0.0.0', port=port)
    #complete
