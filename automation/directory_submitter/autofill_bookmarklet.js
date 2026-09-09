/**
 * Academic Wizard — 1-Click AI Directory Autofill Bookmarklet
 * 
 * HOW TO USE:
 * 1. Create a new bookmark in Chrome/Safari/Brave/Edge.
 * 2. Name it: "⚡ Auto-Fill Academic Wizard"
 * 3. Paste the MINIFIED BOOKMARKLET CODE below into the "URL" field of the bookmark.
 * 4. Whenever you open any AI directory submission form (e.g., Futurepedia, Toolify, TAAFT),
 *    click the bookmark! It will instantly fill all inputs in 0.1 seconds.
 */

// ==========================================
// 1. MINIFIED BOOKMARKLET (COPY & PASTE AS BOOKMARK URL):
// ==========================================
/*
javascript:(function(){const d={name:"Academic Wizard Linguistic AI Detector",url:"https://academicwizard.online/tools/ai-detector/",email:"support@academicwizard.online",tagline:"Free AI Content & Academic Integrity Detector for Essays",pitch:"Instant linguistic AI detector analyzing perplexity and sentence burstiness to verify student essays against false Turnitin flags. 100% free with zero data logging.",desc:"Academic Wizard's Linguistic AI Detector is an essential academic integrity companion engineered specifically for higher education students and researchers.\n\nKey Capabilities:\n• Multi-Sentence Perplexity Scoring: Pinpoints exact paragraphs with uniform phrasing likely to trigger false positive flags.\n• Strict Non-Repository Policy: Your text is never stored, indexed, or shared with third-party databases.\n• Academic Convention Awareness: Calibrated for formal coursework, lab reports, and literature reviews.\n• Instant Color-Coded Heatmaps: Visual breakdown of human vs algorithmic syntax patterns.\n\n100% Free with zero ads or paywalls.",pricing:"Free",pricingType:"0",category:"Education / AI Detection",tags:"ai detector, academic integrity, turnitin checker, essay checker, edtech"};function setVal(el,val){if(!el)return false;el.focus();el.value=val;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));el.blur();return true;}let c=0;document.querySelectorAll('input, textarea, select').forEach(el=>{const n=(el.name||'').toLowerCase(),i=(el.id||'').toLowerCase(),p=(el.placeholder||'').toLowerCase(),t=(el.type||'').toLowerCase();const m=n+' '+i+' '+p;if(t==='email'||m.includes('email')){if(setVal(el,d.email))c++;}else if(m.includes('tagline')||m.includes('headline')||m.includes('short_desc')||m.includes('summary')||m.includes('punchline')||m.includes('subtitle')){if(setVal(el,d.tagline))c++;}else if(el.tagName==='TEXTAREA'||m.includes('description')||m.includes('about')||m.includes('details')||m.includes('overview')){if(setVal(el,d.desc))c++;}else if(m.includes('url')||m.includes('website')||m.includes('link')||m.includes('domain')||m.includes('homepage')){if(setVal(el,d.url))c++;}else if(m.includes('tool_name')||m.includes('product_name')||m.includes('app_name')||m.includes('title')||m.includes('name')){if(setVal(el,d.name))c++;}else if(m.includes('pricing')||m.includes('price')){if(setVal(el,d.pricing))c++;}else if(m.includes('tag')||m.includes('keyword')){if(setVal(el,d.tags))c++;}});const t=document.createElement('div');t.innerText='⚡ Auto-filled '+c+' fields with Academic Wizard AI Detector data!';t.style.cssText='position:fixed;top:20px;right:20px;background:#D4AF37;color:#000;padding:14px 20px;border-radius:10px;font-family:sans-serif;font-weight:bold;font-size:14px;z-index:999999;box-shadow:0 4px 20px rgba(0,0,0,0.5);';document.body.appendChild(t);setTimeout(()=>t.remove(),4000);})();
*/

// ==========================================
// 2. UNMINIFIED SOURCE CODE (FOR REFERENCE & EXTENSION):
// ==========================================
(function autoFillAcademicWizard() {
    const data = {
        name: "Academic Wizard Linguistic AI Detector",
        url: "https://academicwizard.online/tools/ai-detector/",
        email: "support@academicwizard.online",
        tagline: "Free AI Content & Academic Integrity Detector for Essays",
        pitch: "Instant linguistic AI detector analyzing perplexity and sentence burstiness to verify student essays against false Turnitin flags. 100% free with zero data logging.",
        desc: "Academic Wizard's Linguistic AI Detector is an essential academic integrity companion engineered specifically for higher education students and researchers.\n\nKey Capabilities:\n• Multi-Sentence Perplexity Scoring: Pinpoints exact paragraphs with uniform phrasing likely to trigger false positive flags.\n• Strict Non-Repository Policy: Your text is never stored, indexed, or shared with third-party databases.\n• Academic Convention Awareness: Calibrated for formal coursework, lab reports, and literature reviews.\n• Instant Color-Coded Heatmaps: Visual breakdown of human vs algorithmic syntax patterns.\n\n100% Free with zero ads or paywalls.",
        pricing: "Free",
        pricingType: "0",
        category: "Education / AI Detection",
        tags: "ai detector, academic integrity, turnitin checker, essay checker, edtech"
    };

    function setVal(el, val) {
        if (!el) return false;
        el.focus();
        el.value = val;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.blur();
        return true;
    }

    let filledCount = 0;
    const elements = document.querySelectorAll('input, textarea, select');

    elements.forEach(el => {
        const name = (el.name || '').toLowerCase();
        const id = (el.id || '').toLowerCase();
        const placeholder = (el.placeholder || '').toLowerCase();
        const type = (el.type || '').toLowerCase();
        const combined = `${name} ${id} ${placeholder}`;

        if (type === 'email' || combined.includes('email')) {
            if (setVal(el, data.email)) filledCount++;
        } else if (combined.includes('tagline') || combined.includes('headline') || combined.includes('short_desc') || combined.includes('summary') || combined.includes('punchline') || combined.includes('subtitle')) {
            if (setVal(el, data.tagline)) filledCount++;
        } else if (el.tagName === 'TEXTAREA' || combined.includes('description') || combined.includes('about') || combined.includes('details') || combined.includes('overview')) {
            if (setVal(el, data.desc)) filledCount++;
        } else if (combined.includes('url') || combined.includes('website') || combined.includes('link') || combined.includes('domain') || combined.includes('homepage')) {
            if (setVal(el, data.url)) filledCount++;
        } else if (combined.includes('tool_name') || combined.includes('product_name') || combined.includes('app_name') || combined.includes('title') || combined.includes('name')) {
            if (setVal(el, data.name)) filledCount++;
        } else if (combined.includes('pricing') || combined.includes('price')) {
            if (setVal(el, data.pricing)) filledCount++;
        } else if (combined.includes('tag') || combined.includes('keyword')) {
            if (setVal(el, data.tags)) filledCount++;
        }
    });

    // Display confirmation toast
    const toast = document.createElement('div');
    toast.innerText = `⚡ Auto-filled ${filledCount} fields with Academic Wizard AI Detector data!`;
    toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#D4AF37;color:#000;padding:14px 20px;border-radius:10px;font-family:sans-serif;font-weight:bold;font-size:14px;z-index:999999;box-shadow:0 4px 20px rgba(0,0,0,0.5);';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
})();
