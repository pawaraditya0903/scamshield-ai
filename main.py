"""
ScamShield AI — FastAPI Backend
Run: uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import re
import hashlib

app = FastAPI(
    title="ScamShield AI API",
    description="AI-powered scam detection API",
    version="1.0.0"
)

# CORS - allow frontend to call API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== Request/Response Models =====
class MessageRequest(BaseModel):
    text: str

class LinkRequest(BaseModel):
    url: str

class PhoneRequest(BaseModel):
    phone: str

class ChatRequest(BaseModel):
    message: str

class AnalysisResult(BaseModel):
    score: int
    level: str  # safe, suspicious, scam
    reason: str
    flags: list[str]
    tips: list[str]

class ChatResponse(BaseModel):
    reply: str


# ===== Scam Detection Engine =====
SCAM_PATTERNS = {
    "urgency": ["urgent", "immediately", "expire", "suspended", "blocked", "last chance", "act now", "hurry", "limited time"],
    "financial": ["account", "bank", "upi", "credit card", "debit card", "payment", "transaction", "pan card", "aadhaar", "kyc", "verify"],
    "phishing": ["click here", "click below", "verify now", "login", "update your", "confirm your", "reset password"],
    "reward": ["won", "winner", "prize", "lottery", "reward", "congratulations", "cashback", "gift", "free", "offer"],
    "threat": ["legal action", "arrest", "police", "court", "warrant", "case filed", "fine", "penalty", "digital arrest", "cbi"],
    "otp": ["otp", "one time password", "verification code", "share code", "pin number"],
    "impersonation": ["customer care", "technical support", "rbi", "income tax", "government", "sbi", "hdfc", "icici", "amazon", "flipkart"],
    "job": ["work from home", "earn daily", "part time job", "earn money", "easy money", "guaranteed income"],
}

SUSPICIOUS_TLDS = [".tk", ".ml", ".ga", ".cf", ".gq", ".xyz", ".top", ".club", ".click", ".site", ".fun", ".online"]
TRUSTED_DOMAINS = ["google.com", "facebook.com", "amazon.in", "flipkart.com", "paytm.com", "sbi.co.in", "hdfcbank.com", "icicibank.com", "rbi.org.in", "gov.in"]


@app.get("/")
def root():
    return {"message": "🛡️ ScamShield AI API is running!", "version": "1.0.0"}


@app.post("/analyze/message", response_model=AnalysisResult)
def analyze_message(req: MessageRequest):
    text = req.text
    lower = text.lower()
    flags = []
    score = 0
    matched = {}

    for category, keywords in SCAM_PATTERNS.items():
        for keyword in keywords:
            if keyword in lower:
                if category not in matched:
                    matched[category] = []
                matched[category].append(keyword)
                score += 12

    # Check for URLs
    urls = re.findall(r'https?://[^\s]+', text, re.IGNORECASE)
    if urls:
        score += 15
        flags.append(f"Contains {len(urls)} URL(s) in message")

    # All caps
    caps = re.findall(r'[A-Z]{4,}', text)
    if caps and len(caps) > 1:
        score += 8
        flags.append("Contains excessive CAPS (urgency tactic)")

    # Money amounts
    if re.search(r'₹[\d,.]+|rs\.?\s*[\d,.]+', text, re.IGNORECASE):
        score += 10
        flags.append("Mentions specific monetary amounts")

    # Generate flags from categories
    flag_messages = {
        "urgency": "Creates urgency/pressure",
        "financial": "References banking/financial services",
        "phishing": "Contains phishing language",
        "reward": "Promises rewards/prizes",
        "threat": "Uses threats/intimidation",
        "otp": "Asks for OTP/verification codes",
        "impersonation": "Impersonates known brand/authority",
        "job": "Suspicious job/income offer",
    }
    for cat in matched:
        flags.append(f'{flag_messages.get(cat, cat)}: "{matched[cat][0]}"')

    score = min(score, 100)
    category_count = len(matched)

    if score >= 60 or category_count >= 3:
        score = max(score, 75)
        level = "scam"
        reason = f"This message shows {category_count} distinct scam patterns. It exhibits characteristics commonly found in fraudulent messages targeting Indian users."
        tips = [
            "Do NOT click any links in this message",
            "Do NOT share OTP, PIN, or passwords",
            "Block and report this number",
            "Report to cybercrime.gov.in or call 1930",
        ]
    elif score >= 30 or category_count >= 2:
        score = max(score, 40)
        level = "suspicious"
        reason = f"This message contains {category_count} suspicious pattern(s). While not definitively a scam, exercise caution."
        tips = [
            "Verify the sender through official channels",
            "Do not click links — type official URLs manually",
            "Never share personal information over messages",
        ]
    else:
        level = "safe"
        reason = "This message does not exhibit common scam patterns. It appears normal, but stay cautious."
        tips = [
            "Always verify the sender's identity",
            "Be cautious with links from unknown sources",
            "Enable two-factor authentication",
        ]
        if not flags:
            flags.append("No significant scam indicators found")

    return AnalysisResult(score=score, level=level, reason=reason, flags=flags, tips=tips)


@app.post("/analyze/link", response_model=AnalysisResult)
def analyze_link(req: LinkRequest):
    url = req.url
    flags = []
    score = 0

    try:
        from urllib.parse import urlparse
        parsed = urlparse(url)
        hostname = parsed.hostname or ""
        path = parsed.path.lower()

        # Trusted domains
        if any(hostname.endswith(d) for d in TRUSTED_DOMAINS):
            return AnalysisResult(
                score=5, level="safe",
                reason=f"This URL belongs to a trusted domain ({hostname}).",
                flags=["Domain is recognized and trusted"],
                tips=["Even trusted domains can have compromised pages"]
            )

        # Suspicious TLDs
        if any(hostname.endswith(tld) for tld in SUSPICIOUS_TLDS):
            score += 35
            flags.append(f"Uses suspicious domain extension")

        # IP address URLs
        if re.match(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$', hostname):
            score += 40
            flags.append("URL uses IP address instead of domain name")

        # Domain spoofing
        bank_names = ["sbi", "hdfc", "icici", "paytm", "phonepe", "amazon", "flipkart"]
        for bank in bank_names:
            if bank in hostname and not any(hostname.endswith(d) for d in TRUSTED_DOMAINS):
                score += 30
                flags.append(f"Domain impersonates {bank.upper()}")

        # HTTP
        if parsed.scheme == "http":
            score += 15
            flags.append("Uses insecure HTTP")

        # Suspicious paths
        for p in ["login", "verify", "update", "confirm", "password", "banking"]:
            if p in path:
                score += 10
                flags.append(f'URL path contains "{p}"')

    except Exception:
        score = 60
        flags.append("URL format is invalid")

    score = min(score, 100)

    if score >= 60:
        return AnalysisResult(score=max(score, 70), level="scam", reason="This URL shows strong phishing indicators.", flags=flags,
                              tips=["Do NOT visit this link", "Report at safebrowsing.google.com", "Change passwords if you clicked"])
    elif score >= 25:
        return AnalysisResult(score=score, level="suspicious", reason="This URL has suspicious characteristics.", flags=flags,
                              tips=["Verify via Google search", "Check for HTTPS", "Use VirusTotal.com"])
    else:
        if not flags:
            flags.append("No obvious phishing indicators")
        return AnalysisResult(score=score, level="safe", reason="No obvious signs of malicious intent.", flags=flags,
                              tips=["Verify SSL certificate", "Be cautious with personal info"])


@app.post("/analyze/phone", response_model=AnalysisResult)
def analyze_phone(req: PhoneRequest):
    phone = re.sub(r'[\s\-\(\)]', '', req.phone)
    flags = []
    score = 0

    if not re.match(r'^\+?\d{10,13}$', phone):
        return AnalysisResult(score=0, level="safe", reason="Invalid phone number format.",
                              flags=["Invalid format"], tips=["Enter a valid 10-digit number"])

    # Simulate reputation
    hash_val = int(hashlib.md5(phone.encode()).hexdigest()[:8], 16) % 15
    if hash_val > 8:
        score += 50
        flags.append(f"{hash_val} community reports of spam/scam")
    elif hash_val > 4:
        score += 25
        flags.append(f"{hash_val} reports flagged")
    else:
        flags.append("No significant reports found")

    score = min(score, 100)

    if score >= 50:
        return AnalysisResult(score=max(score, 65), level="scam",
                              reason=f"This number has {hash_val} reports for fraudulent activities.",
                              flags=flags, tips=["Block this number", "Report to cybercrime.gov.in", "Call 1930"])
    elif score >= 25:
        return AnalysisResult(score=score, level="suspicious",
                              reason="This number has some reports.", flags=flags,
                              tips=["Be cautious", "Verify caller identity", "Use Truecaller"])
    else:
        return AnalysisResult(score=score, level="safe",
                              reason="No significant negative reports found.", flags=flags,
                              tips=["Stay vigilant", "Never share OTP on calls"])


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    msg = req.message.lower()

    if any(w in msg for w in ["upi", "payment", "gpay", "phonepe"]):
        return ChatResponse(reply="🛡️ UPI Safety: Never share UPI PIN. You don't need PIN to receive money. Verify receiver name before paying. Use only official apps.")
    if any(w in msg for w in ["digital arrest", "cbi", "police", "arrest"]):
        return ChatResponse(reply="🚔 Digital Arrest is a SCAM! No agency conducts arrests over phone/video call. Hang up and report to 1930.")
    if any(w in msg for w in ["otp", "pin", "password"]):
        return ChatResponse(reply="🔑 Never share OTP/PIN with anyone. Banks never ask for these on calls. If you shared by mistake, block your card immediately.")
    if any(w in msg for w in ["safe", "tips", "protect"]):
        return ChatResponse(reply="🛡️ Stay safe: 1) Never share OTP/PIN 2) Enable 2FA 3) Don't click unknown links 4) Verify callers 5) Report scams at cybercrime.gov.in")

    return ChatResponse(reply="Thanks for asking! Stay cautious online. Never share personal info with unknown callers. Use our analyzer tools to check suspicious messages, links, or phone numbers. Report scams at cybercrime.gov.in or call 1930.")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
