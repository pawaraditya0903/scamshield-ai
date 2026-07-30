# ScamShield AI — Protect Yourself from Online Scams

ScamShield AI helps users instantly detect fake messages, phishing links, and fraud calls using a smart rule-based engine. It is designed especially for common scams seen on WhatsApp, SMS, and online banking in India.

## Features

- Analyze WhatsApp/SMS messages for scam patterns such as urgency, rewards, OTP requests, and impersonation of banks or government.
- Check suspicious URLs for phishing indicators like unsafe HTTP, fake banking domains, and suspicious TLDs.
- Evaluate phone numbers for basic scam call behavior and format issues.
- Modern responsive frontend built with HTML, CSS, and JavaScript.
- Backend API built with FastAPI (Python) for message, link, and phone analysis.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (`index.html`, `style.css`, `app.js`)
- **Backend:** Python, FastAPI (`main.py` or `main-5.py`)
- **Detection:** Regex patterns, domain heuristics, basic scoring system
- **Other:** `requirements.txt` (or `requirements-6.txt`) for Python dependencies

## Project Structure

Typical file layout:

```text
.
├── index.html              # Main frontend page (ScamShield AI UI)
├── style.css               # Design system and styling
├── app.js                  # Frontend logic and mock AI
├── main.py / main-5.py     # FastAPI backend for analysis API
├── requirements.txt        # Python dependencies
└── ScamShield_AI_Presentation.pptx  # Project presentation (optional)
```

## How to run the backend locally

1. Create and activate a virtual environment (optional but recommended):

```bash
python -m venv venv
venv\Scripts\activate    # On Windows
```

2. Install dependencies:

```bash
pip install -r requirements.txt
# or if your file is named requirements-6.txt:
pip install -r requirements-6.txt
```

3. Start the FastAPI server:

```bash
uvicorn main:app --reload --port 8000
# or if your file name is main-5.py:
uvicorn main-5:app --reload --port 8000
```

4. The API will be available at:

```text
http://localhost:8000
```

You can open the interactive docs at:

```text
http://localhost:8000/docs
```

## How to use the frontend

1. Open `index.html` in your browser (you can double-click the file or serve it via a simple HTTP server).
2. Use the ScamShield UI to:
   - Paste suspicious WhatsApp/SMS messages.
   - Paste URLs you want to check.
   - Enter phone numbers.
3. Configure the frontend (if integrated with the backend) to call:

```text
http://localhost:8000/analyze/message
http://localhost:8000/analyze/link
http://localhost:8000/analyze/phone
```

depending on the type of analysis.

## Future Improvements

- Use a real machine learning model instead of rule-based scoring.
- Store and visualize scam patterns reported by users.
- Add multi-language support (English + Marathi/Hindi).
- Deploy the backend on a cloud platform (Render, Railway, etc.) and host the frontend as a live website.

## Author

Developed by **Aditya Pawar** (`pawaraditya0903`) as an academic / personal project to help users stay safe from online scams.
