from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

def create_presentation():
    # Create the presentation object
    prs = Presentation()
    
    # ---------------------------------------------------
    # Slide 1: Title
    # ---------------------------------------------------
    slide_layout = prs.slide_layouts[0]
    slide = prs.slides.add_slide(slide_layout)
    title = slide.shapes.title
    subtitle = slide.placeholders[1]
    
    title.text = "ScamShield AI"
    
    # Format Subtitle
    subtitle.text = (
        "Selected Domain: AI Agents | Cybersecurity | FinTech\n\n"
        "Team Name: [Your Team Name]\n"
        "Team Members: [Member 1], [Member 2], [Member 3], [Member 4]\n"
        "[Your College Name]"
    )
    
    # ---------------------------------------------------
    # Slide 2: Idea and Proposed Solution
    # ---------------------------------------------------
    slide_layout = prs.slide_layouts[1] # Title and Content
    slide = prs.slides.add_slide(slide_layout)
    slide.shapes.title.text = "Idea and Proposed Solution"
    
    tf = slide.placeholders[1].text_frame
    tf.text = "Describe Idea: An AI-powered platform to instantly detect online scams before users fall victim."
    
    p = tf.add_paragraph()
    p.text = "How is the problem approached: Users paste a suspicious SMS, link, or phone number. Our AI analyzes patterns, checks domains/reputations, and returns a Risk Score + Safety Tips."
    
    p = tf.add_paragraph()
    p.text = "Why is this problem important: Cyber fraud in India is exploding (UPI scams, Digital Arrest, Phishing). People lost over ₹1,750 Cr in 2024 alone."
    
    p = tf.add_paragraph()
    p.text = "Who is affected: The general public, especially senior citizens, students, and newly digital/UPI users."
    
    # ---------------------------------------------------
    # Slide 3: Technical Approach
    # ---------------------------------------------------
    slide = prs.slides.add_slide(slide_layout)
    slide.shapes.title.text = "Technical Approach"
    
    tf = slide.placeholders[1].text_frame
    tf.text = "Technologies Used: HTML/CSS/JS (Frontend Web App), FastAPI + Python (Backend), Google Gemini AI API (NLP Analysis), Safe Browsing APIs."
    
    p = tf.add_paragraph()
    p.text = "Process of Implementation: A user-friendly web interface connected securely to a Python REST API that runs logic and AI checks in real-time."
    
    p = tf.add_paragraph()
    p.text = "Architecture Flow: User Input -> Frontend UI -> FastAPI -> AI Engine & Pattern Matching -> Visual Risk Score Output."
    
    p = tf.add_paragraph()
    p.text = "Key Features: Message Scanner (NLP-based scam detection), Link Checker, Phone Lookup reputation, and an AI Chatbot for instant scam queries."

    # ---------------------------------------------------
    # Slide 4: Feasibility and Overall Impact
    # ---------------------------------------------------
    slide = prs.slides.add_slide(slide_layout)
    slide.shapes.title.text = "Feasibility and Overall Impact"
    
    tf = slide.placeholders[1].text_frame
    tf.text = "Feasibility: Highly feasible. Uses accessible Cloud APIs (Gemini) and standard web technologies requiring zero hardware."
    
    p = tf.add_paragraph()
    p.text = "Potential Challenges: Evolving scam patterns and potential false positives on legitimate messages."
    
    p = tf.add_paragraph()
    p.text = "Strategies for Overcoming Challenges: Deploying continuous AI prompt tuning and multi-factor analysis (checking 8 distinct scam vectors to prevent false flags)."
    
    p = tf.add_paragraph()
    p.text = "Scalability & Real-world application: Can easily scale into a Browser Extension or WhatsApp Bot to protect users exactly where they receive scams."

    # ---------------------------------------------------
    # Slide 5: Conclusion, References and Future
    # ---------------------------------------------------
    slide = prs.slides.add_slide(slide_layout)
    slide.shapes.title.text = "Conclusion and Future Enhancements"
    
    tf = slide.placeholders[1].text_frame
    tf.text = "Impact on Target Audience: Protects vulnerable users by providing a simple tool to instantly verify digital safety, saving millions in potential fraud theft."
    
    p = tf.add_paragraph()
    p.text = "Conclusion: ScamShield AI actively blocks the digital attack lifecycle by educating and alerting users before an action is taken."
    
    p = tf.add_paragraph()
    p.text = "Future Enhancements: WhatsApp/Telegram Bot (forward to verify), multi-language support (Hindi, Tamil, etc.), API integrations for Banking apps."
    
    p = tf.add_paragraph()
    p.text = "References: National Cybercrime Portal, CERT-IN Annual Reports, Google Safe Browsing Docs."

    # ---------------------------------------------------
    # Slide 6: Thank You
    # ---------------------------------------------------
    slide = prs.slides.add_slide(prs.slide_layouts[0]) # Title slide layout for Thank you
    slide.shapes.title.text = "Thank You!"
    
    subtitle = slide.placeholders[1]
    subtitle.text = (
        "Let's make India scam-free.\n\n"
        "Contact: [your-email@example.com]\n"
        "GitHub: github.com/your-repo"
    )

    # Save presentation
    prs.save("ScamShield_AI_Presentation.pptx")
    print("Presentation saved successfully!")

if __name__ == "__main__":
    create_presentation()
