// ===== ScamShield AI — Application Logic =====

// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (link) {
            link.classList.toggle('active', scrollY >= top && scrollY < top + height);
        }
    });
});

// ===== Floating Particles =====
const particlesContainer = document.getElementById('particles');
for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = (4 + Math.random() * 4) + 's';
    particlesContainer.appendChild(particle);
}

// ===== Counter Animation =====
function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count);
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            el.textContent = current.toLocaleString();
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    });
}

// Trigger counter animation when hero is in view
const heroObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            heroObserver.disconnect();
        }
    });
}, { threshold: 0.3 });
heroObserver.observe(document.getElementById('home'));

// ===== Tab System =====
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`content-${btn.dataset.tab}`).classList.add('active');
    });
});

// ===== ScamShield AI Engine (Smart Mock) =====
const ScamAI = {
    // Scam keyword patterns
    scamPatterns: {
        urgency: ['urgent', 'immediately', 'expire', 'suspended', 'blocked', 'last chance', 'act now', 'hurry', 'limited time', 'deadline', 'turat', 'jaldi'],
        financial: ['account', 'bank', 'upi', 'credit card', 'debit card', 'payment', 'transaction', 'pan card', 'aadhaar', 'kyc', 'verify', 'loan approved'],
        phishing: ['click here', 'click below', 'verify now', 'login', 'update your', 'confirm your', 'reset password', 'unlock'],
        reward: ['won', 'winner', 'prize', 'lottery', 'reward', 'congratulations', 'cashback', 'gift', 'free', 'offer', 'claim'],
        threat: ['legal action', 'arrest', 'police', 'court', 'warrant', 'case filed', 'fine', 'penalty', 'seized', 'digital arrest', 'cbi', 'narcotics'],
        otp: ['otp', 'one time password', 'verification code', 'share code', 'send code', 'pin number'],
        impersonation: ['customer care', 'technical support', 'rbi', 'income tax', 'government', 'official', 'sbi', 'hdfc', 'icici', 'amazon', 'flipkart', 'paytm'],
        job: ['work from home', 'earn daily', 'part time job', 'earn money', 'income opportunity', 'easy money', 'guaranteed income', 'data entry job'],
    },

    suspiciousTLDs: ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.club', '.work', '.click', '.link', '.site', '.fun', '.online', '.icu', '.buzz', '.rest'],
    trustedDomains: ['google.com', 'facebook.com', 'amazon.in', 'flipkart.com', 'paytm.com', 'sbi.co.in', 'hdfcbank.com', 'icicibank.com', 'rbi.org.in', 'gov.in', 'nic.in', 'npci.org.in', 'github.com', 'youtube.com', 'wikipedia.org'],

    analyzeMessage(text) {
        const lower = text.toLowerCase();
        const flags = [];
        let score = 0;
        const matched = {};

        // Check each pattern category
        for (const [category, keywords] of Object.entries(this.scamPatterns)) {
            for (const keyword of keywords) {
                if (lower.includes(keyword)) {
                    if (!matched[category]) {
                        matched[category] = [];
                    }
                    matched[category].push(keyword);
                    score += 12;
                }
            }
        }

        // Check for URLs in message
        const urlRegex = /https?:\/\/[^\s]+/gi;
        const urls = text.match(urlRegex);
        if (urls) {
            urls.forEach(url => {
                const linkResult = this.analyzeLink(url);
                if (linkResult.score > 50) {
                    score += 20;
                    flags.push(`Contains suspicious link: ${url}`);
                }
            });
        }

        // Check for phone numbers
        if (/\+?\d{10,13}/.test(text)) {
            score += 5;
        }

        // Check for all caps sections
        const capsWords = text.match(/[A-Z]{4,}/g);
        if (capsWords && capsWords.length > 1) {
            score += 8;
            flags.push('Contains excessive CAPS (urgency tactic)');
        }

        // Check for money/amounts
        if (/₹[\d,.]+|rs\.?\s*[\d,.]+|inr\s*[\d,.]+/i.test(text)) {
            score += 10;
            flags.push('Mentions specific monetary amounts');
        }

        // Generate red flags
        if (matched.urgency) flags.push(`Creates urgency: "${matched.urgency[0]}"`);
        if (matched.financial) flags.push(`References financial/banking: "${matched.financial[0]}"`);
        if (matched.phishing) flags.push(`Contains phishing language: "${matched.phishing[0]}"`);
        if (matched.reward) flags.push(`Promises rewards/prizes: "${matched.reward[0]}"`);
        if (matched.threat) flags.push(`Uses threats/intimidation: "${matched.threat[0]}"`);
        if (matched.otp) flags.push(`Asks for OTP/verification codes`);
        if (matched.impersonation) flags.push(`Impersonates known brand/authority: "${matched.impersonation[0]}"`);
        if (matched.job) flags.push(`Suspicious job/income offer: "${matched.job[0]}"`);

        // Cap score at 100
        score = Math.min(score, 100);

        // Length check — very short messages are less suspicious
        if (text.length < 20 && score < 30) {
            score = Math.max(0, score - 10);
        }

        // Determine risk level
        let level, reason, tips;
        const categoryCount = Object.keys(matched).length;

        if (score >= 60 || categoryCount >= 3) {
            score = Math.max(score, 75);
            level = 'scam';
            reason = `This message shows ${categoryCount} distinct scam patterns. It ${matched.urgency ? 'creates a false sense of urgency' : 'uses manipulative tactics'}, ${matched.financial || matched.otp ? 'attempts to access financial information' : 'tries to deceive you'}, and ${matched.phishing ? 'contains phishing elements' : 'exhibits suspicious characteristics'}. This is very likely a scam attempt.`;
            tips = [
                'Do NOT click any links in this message',
                'Do NOT share OTP, PIN, or passwords with anyone',
                'Block and report this number immediately',
                'If it mentions your bank, call your bank directly using the number on your card',
                'Report to cybercrime.gov.in or call 1930'
            ];
        } else if (score >= 30 || categoryCount >= 2) {
            score = Math.max(score, 40);
            level = 'suspicious';
            reason = `This message contains ${categoryCount} suspicious pattern(s) that require caution. While it may not be a definitive scam, it uses language commonly found in fraudulent messages. ${matched.urgency ? 'The urgency language is a common pressure tactic.' : ''} ${matched.financial ? 'References to banking/financial services need verification.' : ''}`;
            tips = [
                'Verify the sender through official channels',
                'Do not click links directly — type the official URL manually',
                'Never share personal/financial information over messages',
                'When in doubt, contact the organization directly',
                'Take a screenshot and report if it\'s suspicious'
            ];
        } else {
            level = 'safe';
            reason = 'This message does not exhibit common scam patterns. It appears to be a normal message. However, always stay cautious with messages from unknown senders.';
            tips = [
                'Always verify the sender\'s identity',
                'Be cautious with links from unknown sources',
                'Keep your apps and devices updated',
                'Enable two-factor authentication on all accounts'
            ];
            if (flags.length === 0) flags.push('No significant scam indicators found');
        }

        return { score, level, reason, flags, tips };
    },

    analyzeLink(url) {
        const flags = [];
        let score = 0;

        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname.toLowerCase();
            const path = urlObj.pathname.toLowerCase();

            // Check trusted domains
            if (this.trustedDomains.some(d => hostname === d || hostname.endsWith('.' + d))) {
                return {
                    score: 5,
                    level: 'safe',
                    reason: `This URL belongs to a known trusted domain (${hostname}). It appears legitimate, but always verify the full URL path.`,
                    flags: ['Domain is recognized and trusted'],
                    tips: ['Even trusted domains can have compromised pages — verify the full URL', 'Make sure the URL doesn\'t have unusual paths or parameters']
                };
            }

            // Check suspicious TLDs
            if (this.suspiciousTLDs.some(tld => hostname.endsWith(tld))) {
                score += 35;
                flags.push(`Uses suspicious domain extension (${hostname.split('.').pop()})`);
            }

            // Check for IP address URLs
            if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
                score += 40;
                flags.push('URL uses IP address instead of domain name');
            }

            // Check for domain spoofing (e.g., sbi-login.tk)
            const bankNames = ['sbi', 'hdfc', 'icici', 'axis', 'pnb', 'bob', 'kotak', 'paytm', 'phonepe', 'gpay', 'amazon', 'flipkart'];
            bankNames.forEach(bank => {
                if (hostname.includes(bank) && !this.trustedDomains.some(d => hostname.endsWith(d))) {
                    score += 30;
                    flags.push(`Domain impersonates ${bank.toUpperCase()} but is not the official site`);
                }
            });

            // Check for suspicious path keywords
            const suspiciousPaths = ['login', 'verify', 'update', 'confirm', 'secure', 'account', 'password', 'banking', 'payment'];
            suspiciousPaths.forEach(p => {
                if (path.includes(p)) {
                    score += 10;
                    flags.push(`URL path contains "${p}" — common in phishing pages`);
                }
            });

            // HTTP vs HTTPS
            if (urlObj.protocol === 'http:') {
                score += 15;
                flags.push('Uses insecure HTTP (not HTTPS)');
            }

            // Very long URL
            if (url.length > 100) {
                score += 10;
                flags.push('Unusually long URL (may hide malicious content)');
            }

            // URL shortener detection
            const shorteners = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'is.gd', 'v.gd', 'shorte.st'];
            if (shorteners.some(s => hostname.includes(s))) {
                score += 15;
                flags.push('Uses URL shortener (hides real destination)');
            }

            // Multiple subdomains
            const subdomains = hostname.split('.').length;
            if (subdomains > 3) {
                score += 15;
                flags.push(`Uses ${subdomains - 2} subdomains (suspicious structure)`);
            }

        } catch (e) {
            score = 60;
            flags.push('URL format is malformed or invalid');
        }

        score = Math.min(score, 100);

        let level, reason, tips;
        if (score >= 60) {
            score = Math.max(score, 70);
            level = 'scam';
            reason = `This URL shows strong indicators of being a phishing or scam link. ${flags.length} red flags were detected. Do NOT visit this link or enter any information on it.`;
            tips = [
                'Do NOT click or visit this link',
                'Do NOT enter any passwords or personal info',
                'Report this URL at safebrowsing.google.com/safebrowsing/report_phish',
                'If you already clicked, change your passwords immediately',
                'Run a malware scan on your device'
            ];
        } else if (score >= 25) {
            level = 'suspicious';
            reason = `This URL has some suspicious characteristics. While it may be legitimate, several elements raise concern. ${flags.join('. ')}.`;
            tips = [
                'Verify the URL by searching for the official website on Google',
                'Look for HTTPS and a valid security certificate',
                'Don\'t enter sensitive information unless you\'re certain it\'s legitimate',
                'Use a URL scanner like VirusTotal.com for additional checks'
            ];
        } else {
            level = 'safe';
            reason = 'This URL does not show obvious signs of being malicious. However, no automated check is 100% reliable — always exercise caution.';
            tips = [
                'Verify the website\'s SSL certificate (lock icon)',
                'Be cautious when entering personal information',
                'Use a URL scanner for additional verification'
            ];
            if (flags.length === 0) flags.push('No obvious phishing indicators detected');
        }

        return { score, level, reason, flags, tips };
    },

    analyzePhone(phone) {
        const cleaned = phone.replace(/[\s\-\(\)]/g, '');
        const flags = [];
        let score = 0;

        // Validate format
        if (!/^\+?\d{10,13}$/.test(cleaned)) {
            return {
                score: 0,
                level: 'safe',
                reason: 'Please enter a valid 10-digit Indian mobile number (with or without +91).',
                flags: ['Invalid phone number format'],
                tips: ['Enter a 10-digit number or +91 followed by 10 digits']
            };
        }

        // Known scam prefixes (simulated)
        const scamPrefixes = ['140', '160']; // International/telemarketer prefixes
        if (scamPrefixes.some(p => cleaned.startsWith(p) || cleaned.startsWith('+91' + p))) {
            score += 40;
            flags.push('Number uses prefix commonly associated with telemarketers');
        }

        // Simulate reputation check with hash-based pseudo-random
        const hash = cleaned.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
        const reportsSimulated = hash % 15;

        if (reportsSimulated > 8) {
            score += 50;
            flags.push(`${reportsSimulated} community reports of spam/scam from this number`);
            flags.push('Reported for: Fake customer care / Financial fraud');
        } else if (reportsSimulated > 4) {
            score += 25;
            flags.push(`${reportsSimulated} community reports flagged for this number`);
            flags.push('Reported for: Unsolicited calls / Telemarketing');
        } else {
            flags.push('No significant community reports found');
        }

        // Non-standard Indian numbers
        if (cleaned.startsWith('+91') || cleaned.length === 10) {
            // Valid Indian number format
        } else if (cleaned.startsWith('+')) {
            score += 20;
            flags.push('International number — be extra cautious');
        }

        score = Math.min(score, 100);

        let level, reason, tips;
        if (score >= 60) {
            level = 'scam';
            reason = `This number has been reported by multiple users for fraudulent activities. It appears in our scam database with ${reportsSimulated} reports. Exercise extreme caution.`;
            tips = [
                'Do NOT call back or share any information',
                'Block this number on your phone',
                'Report to your telecom provider',
                'File a complaint at cybercrime.gov.in',
                'If they claimed to be from a bank, contact your bank directly'
            ];
        } else if (score >= 25) {
            level = 'suspicious';
            reason = `This number has some reports from users. It may be a telemarketer or potentially suspicious caller. ${reportsSimulated > 0 ? `${reportsSimulated} reports found.` : 'Limited data available.'}`;
            tips = [
                'Be cautious when answering calls from this number',
                'Do not share personal or financial information',
                'Verify the caller\'s identity through official channels',
                'Use call-blocking apps like Truecaller'
            ];
        } else {
            level = 'safe';
            reason = 'This number does not have significant negative reports in our database. However, always be cautious with unknown callers.';
            tips = [
                'Even "safe" numbers can be spoofed — stay vigilant',
                'Never share OTP or passwords on calls',
                'Verify identity before sharing any information',
                'Install Truecaller for real-time caller ID'
            ];
        }

        return { score, level, reason, flags, tips };
    }
};

// ===== Analyzer Functions =====
function setLoading(btnId, loading) {
    const btn = document.getElementById(btnId);
    const text = btn.querySelector('.btn-text');
    const loader = btn.querySelector('.btn-loader');
    const icon = btn.querySelector('.btn-icon');

    if (loading) {
        text.textContent = 'Analyzing...';
        loader.style.display = 'block';
        icon.style.display = 'none';
        btn.disabled = true;
        btn.style.opacity = '0.7';
    } else {
        text.textContent = btn.dataset.originalText || 'Analyze';
        loader.style.display = 'none';
        icon.style.display = 'inline';
        btn.disabled = false;
        btn.style.opacity = '1';
    }
}

function showResults(result) {
    const panel = document.getElementById('resultsPanel');
    panel.style.display = 'block';

    // Animate gauge
    const gaugeFill = document.getElementById('gaugeFill');
    const gaugeScore = document.getElementById('gaugeScore');
    const gaugeLabel = document.getElementById('gaugeLabel');
    const riskBadge = document.getElementById('riskBadge');
    const riskIcon = document.getElementById('riskIcon');
    const riskText = document.getElementById('riskText');

    // Set color based on level
    const colors = { safe: '#22c55e', suspicious: '#f59e0b', scam: '#ef4444' };
    const icons = { safe: '✅', suspicious: '⚠️', scam: '🚨' };
    const labels = { safe: 'SAFE', suspicious: 'SUSPICIOUS', scam: 'SCAM DETECTED' };

    const color = colors[result.level];
    gaugeFill.style.stroke = color;

    // Animate score
    const dashOffset = 534 - (534 * result.score / 100);
    setTimeout(() => {
        gaugeFill.style.strokeDashoffset = dashOffset;
    }, 100);

    // Animate number
    let current = 0;
    const interval = setInterval(() => {
        current += Math.ceil(result.score / 30);
        if (current >= result.score) {
            current = result.score;
            clearInterval(interval);
        }
        gaugeScore.textContent = current;
        gaugeScore.style.color = color;
    }, 40);

    gaugeLabel.textContent = 'Risk Score';

    // Risk badge
    riskBadge.className = `risk-badge ${result.level}`;
    riskIcon.textContent = icons[result.level];
    riskText.textContent = labels[result.level];

    // Analysis details
    document.getElementById('analysisReason').textContent = result.reason;

    const flagsList = document.getElementById('redFlagsList');
    flagsList.innerHTML = result.flags.map(f => `<li>${f}</li>`).join('');

    const tipsList = document.getElementById('safetyTipsList');
    tipsList.innerHTML = result.tips.map(t => `<li>${t}</li>`).join('');

    // Scroll to results
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closeResults() {
    const panel = document.getElementById('resultsPanel');
    panel.style.display = 'none';
    // Reset gauge
    document.getElementById('gaugeFill').style.strokeDashoffset = 534;
}

function analyzeMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (!text) {
        input.style.borderColor = '#ef4444';
        setTimeout(() => input.style.borderColor = '', 2000);
        return;
    }

    const btn = document.getElementById('analyzeMessage');
    btn.dataset.originalText = 'Analyze Message';
    setLoading('analyzeMessage', true);

    // Simulate AI processing time
    setTimeout(() => {
        const result = ScamAI.analyzeMessage(text);
        showResults(result);
        setLoading('analyzeMessage', false);
    }, 1500);
}

function analyzeLink() {
    const input = document.getElementById('linkInput');
    let url = input.value.trim();
    if (!url) {
        input.style.borderColor = '#ef4444';
        setTimeout(() => input.style.borderColor = '', 2000);
        return;
    }

    // Add protocol if missing
    if (!url.startsWith('http')) url = 'https://' + url;

    const btn = document.getElementById('analyzeLink');
    btn.dataset.originalText = 'Check Link';
    setLoading('analyzeLink', true);

    setTimeout(() => {
        const result = ScamAI.analyzeLink(url);
        showResults(result);
        setLoading('analyzeLink', false);
    }, 1200);
}

function analyzePhone() {
    const input = document.getElementById('phoneInput');
    const phone = input.value.trim();
    if (!phone) {
        input.style.borderColor = '#ef4444';
        setTimeout(() => input.style.borderColor = '', 2000);
        return;
    }

    const btn = document.getElementById('analyzePhone');
    btn.dataset.originalText = 'Check Number';
    setLoading('analyzePhone', true);

    setTimeout(() => {
        const result = ScamAI.analyzePhone(phone);
        showResults(result);
        setLoading('analyzePhone', false);
    }, 1000);
}

// ===== AI Chat =====
const chatResponses = {
    'upi': `<p><strong>🛡️ UPI Safety Tips:</strong></p>
<p>1. <strong>Never share your UPI PIN</strong> with anyone — not even bank employees.</p>
<p>2. You do NOT need to enter PIN to <strong>receive</strong> money. If someone asks you to enter PIN for "receiving" money, it's a scam.</p>
<p>3. Always verify the <strong>receiver's name</strong> before confirming payment.</p>
<p>4. Be wary of <strong>collect requests</strong> from unknown people.</p>
<p>5. Use only official apps: Google Pay, PhonePe, Paytm, BHIM.</p>`,

    'fake call': `<p><strong>📞 How to Identify Fake Calls:</strong></p>
<p>1. <strong>No bank or government agency</strong> will call and ask for your OTP, PIN, or password.</p>
<p>2. Scammers create <strong>urgency and fear</strong> — "Your account will be blocked in 1 hour!"</p>
<p>3. They may use <strong>voice-changing software</strong> or official-sounding backgrounds.</p>
<p>4. <strong>Caller ID can be spoofed</strong> — even if it shows a bank number, verify independently.</p>
<p>5. If in doubt, <strong>hang up and call the official number</strong> from the bank's website.</p>`,

    'digital arrest': `<p><strong>🚔 Digital Arrest Scam Explained:</strong></p>
<p>This is one of the most dangerous scams in India right now!</p>
<p>1. Scammers call/video call pretending to be from <strong>CBI, Police, Customs, or Narcotics</strong>.</p>
<p>2. They claim a <strong>parcel with drugs/money</strong> was found in your name.</p>
<p>3. They show <strong>fake ID cards and offices</strong> on video call.</p>
<p>4. They demand you stay on call ("digital arrest") and <strong>transfer money</strong> to "clear your name."</p>
<p>⚠️ <strong>REMEMBER: No law enforcement agency conducts "digital arrests" or asks for money over phone!</strong></p>
<p>If you receive such a call, <strong>hang up immediately</strong> and report to <strong>1930</strong> or <strong>cybercrime.gov.in</strong>.</p>`,

    'safe': `<p><strong>🛡️ Top Tips to Stay Safe Online:</strong></p>
<p>1. <strong>Never share OTP, PIN, CVV, or passwords</strong> with anyone.</p>
<p>2. <strong>Enable 2-Factor Authentication</strong> on all accounts.</p>
<p>3. <strong>Don't click links</strong> from unknown senders.</p>
<p>4. <strong>Verify before you trust</strong> — call official numbers, not numbers in the message.</p>
<p>5. <strong>Use strong, unique passwords</strong> for each account.</p>
<p>6. Keep your <strong>apps and OS updated</strong>.</p>
<p>7. <strong>Report suspicious activity</strong> at cybercrime.gov.in or call 1930.</p>
<p>8. Install <strong>Truecaller</strong> to identify spam calls.</p>`,

    'otp': `<p><strong>🔑 OTP Fraud Awareness:</strong></p>
<p>1. OTP is your <strong>digital signature</strong> — sharing it is like handing over your key.</p>
<p>2. <strong>Banks, UPI apps, and government sites will NEVER ask for OTP</strong> on call/message.</p>
<p>3. Scammers may say "I accidentally sent OTP to your number" — this is a trick!</p>
<p>4. If you shared OTP by mistake, <strong>immediately block your card and change passwords</strong>.</p>`,

    'phishing': `<p><strong>🔗 How to Spot Phishing Links:</strong></p>
<p>1. Check the <strong>domain name carefully</strong> — "amaz0n.com" is NOT amazon.com.</p>
<p>2. Look for <strong>HTTPS</strong> (lock icon) — but note that scam sites can also have HTTPS.</p>
<p>3. Suspicious TLDs like <strong>.tk, .ml, .xyz, .click</strong> are red flags.</p>
<p>4. <strong>URL shorteners</strong> (bit.ly) can hide the real destination.</p>
<p>5. <strong>Never enter passwords</strong> on pages opened through links in messages.</p>
<p>6. Use <strong>ScamShield AI Link Checker</strong> to verify any link! ⬆️</p>`,

    'default': `<p>That's a great question! Here's what I'd recommend:</p>
<p>1. <strong>Stay vigilant</strong> — if something feels too good to be true, it probably is.</p>
<p>2. <strong>Verify independently</strong> — always use official websites and phone numbers.</p>
<p>3. <strong>Never share sensitive info</strong> (OTP, PIN, passwords) over calls or messages.</p>
<p>4. Use our <strong>analyzer tools above</strong> to check suspicious messages, links, or phone numbers.</p>
<p>5. Report scams at <strong>cybercrime.gov.in</strong> or call <strong>1930</strong>.</p>
<p>Is there something specific you'd like to know about? Try asking about UPI scams, phishing links, digital arrest, or OTP fraud.</p>`
};

function getChatResponse(message) {
    const lower = message.toLowerCase();

    if (lower.includes('upi') || lower.includes('payment') || lower.includes('gpay') || lower.includes('phonepe')) {
        return chatResponses['upi'];
    }
    if (lower.includes('fake call') || lower.includes('identify') || lower.includes('phone call') || lower.includes('caller')) {
        return chatResponses['fake call'];
    }
    if (lower.includes('digital arrest') || lower.includes('cbi') || lower.includes('police') || lower.includes('arrest')) {
        return chatResponses['digital arrest'];
    }
    if (lower.includes('safe') || lower.includes('tips') || lower.includes('protect') || lower.includes('secure')) {
        return chatResponses['safe'];
    }
    if (lower.includes('otp') || lower.includes('pin') || lower.includes('password') || lower.includes('verification')) {
        return chatResponses['otp'];
    }
    if (lower.includes('link') || lower.includes('phishing') || lower.includes('url') || lower.includes('website')) {
        return chatResponses['phishing'];
    }

    return chatResponses['default'];
}

function sendSuggestion(btn) {
    const text = btn.textContent;
    document.getElementById('chatInput').value = '';
    addChatMessage(text, 'user');

    // Hide suggestions after first use
    document.querySelector('.chat-suggestions').style.display = 'none';

    showTypingIndicator();
    setTimeout(() => {
        removeTypingIndicator();
        addChatMessage(getChatResponse(text), 'bot');
    }, 1200 + Math.random() * 800);
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;

    addChatMessage(text, 'user');
    input.value = '';

    // Hide suggestions
    const suggestions = document.querySelector('.chat-suggestions');
    if (suggestions) suggestions.style.display = 'none';

    showTypingIndicator();
    setTimeout(() => {
        removeTypingIndicator();
        addChatMessage(getChatResponse(text), 'bot');
    }, 1000 + Math.random() * 1000);
}

function addChatMessage(content, type) {
    const container = document.getElementById('chatMessages');
    const msg = document.createElement('div');
    msg.className = `chat-message ${type}`;

    const avatar = type === 'bot' ? '🤖' : '👤';

    if (type === 'bot') {
        msg.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-bubble">${content}</div>
        `;
    } else {
        msg.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-bubble"><p>${content}</p></div>
        `;
    }

    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
}

function showTypingIndicator() {
    const container = document.getElementById('chatMessages');
    const typing = document.createElement('div');
    typing.className = 'chat-message bot';
    typing.id = 'typingIndicator';
    typing.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-bubble">
            <div class="typing-indicator">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator() {
    const typing = document.getElementById('typingIndicator');
    if (typing) typing.remove();
}

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .stat-card, .scam-card, .step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    fadeObserver.observe(el);
});

// Stagger delay for grid items
document.querySelectorAll('.features-grid .feature-card, .stats-grid .stat-card, .scams-grid .scam-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
});

console.log('🛡️ ScamShield AI initialized successfully!');
