/**
 * Academic Wizard — 1-Click AI Directory Universal Autofill Bookmarklet
 * 
 * HOW TO USE:
 * 1. Create a new bookmark in Chrome / Safari / Brave / Edge (Cmd+D or Bookmark Bar).
 * 2. Name it: "⚡ Auto-Fill Academic Wizard"
 * 3. Paste the MINIFIED UNIVERSAL BOOKMARKLET CODE below into the "URL" field of the bookmark.
 * 4. Whenever you open any AI directory submission form (e.g. Toolify, Futurepedia, TAAFT),
 *    click the bookmark! A prompt asks which tool (1: AI Detector, 2: AI Humanizer, 3: Citation Gen, 4: Grammar, 5: Suite).
 */

// ==============================================================================
// 1. UNIVERSAL SMART BOOKMARKLET (Prompts you: 1=Detector, 2=Humanizer, etc.)
// ==============================================================================
/*
javascript:(function(){const T={"1":{n:"Academic Wizard Linguistic AI Detector",u:"https://academicwizard.online/tools/ai-detector/",t:"Free AI Content & Academic Integrity Detector for Essays",d:"Academic Wizard's Linguistic AI Detector analyzes sentence-level perplexity and burstiness to verify student essays against false Turnitin flags. Strict non-repository policy—never stored or indexed.",g:"ai detector, academic integrity, turnitin checker, essay checker, edtech"},"2":{n:"Academic Wizard AI Text Humanizer",u:"https://academicwizard.online/tools/ai-humanizer/",t:"Transform AI-Assisted Writing into Natural Academic Prose",d:"Academic Wizard's AI Text Humanizer eliminates robotic phrasing, injects authentic academic cadence, and protects in-text citations (APA, Harvard, OSCOLA) during rewriting.",g:"ai humanizer, paraphrasing tool, bypass ai detection, academic rewrite, essay polish"},"3":{n:"Academic Wizard Automatic Citation Generator",u:"https://academicwizard.online/tools/citation-generator/",t:"Free Multi-Style Academic Reference & Bibliography Generator",d:"Instant citation generator supporting APA 7th, MLA 9th, Harvard, Chicago 17th, IEEE, and Vancouver with one-click bibliography export.",g:"citation generator, apa citation, harvard referencing, bibliography maker, academic references"},"4":{n:"Academic Wizard Academic Grammar & Spell Checker",u:"https://academicwizard.online/tools/grammar-checker/",t:"Scholarly Grammar, Syntax & Style Polishing Engine",d:"Academic-grade grammar and spell checker eliminating informal colloquialisms, weak transitions, and faulty syntax for distinction-level papers.",g:"grammar checker, essay proofreader, academic spell check, writing enhancer, free proofreading"},"5":{n:"Academic Wizard Free Student AI Tools Suite",u:"https://academicwizard.online/tools/",t:"All-in-One Free AI Writing & Academic Integrity Platform",d:"Suite of 100% free web utilities: Linguistic AI Detection, AI Humanization, APA/Harvard Citation Maker, and Academic Grammar Polisher.",g:"ai tools for students, free academic tools, essay helper, citation maker, edtech"}};const c=prompt("Select Academic Wizard Tool to Autofill:\n1: AI Detector\n2: AI Humanizer\n3: Citation Generator\n4: Grammar Checker\n5: All-in-One Suite\n\n(Enter 1-5, default 1):","1")||"1";const s=T[c]||T["1"];function setVal(e,v){if(!e)return false;e.focus();e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));e.blur();return true;}let f=0;document.querySelectorAll('input, textarea, select').forEach(el=>{const n=(el.name||'').toLowerCase(),i=(el.id||'').toLowerCase(),p=(el.placeholder||'').toLowerCase(),t=(el.type||'').toLowerCase();const m=n+' '+i+' '+p;if(t==='email'||m.includes('email')){if(setVal(el,"support@academicwizard.online"))f++;}else if(m.includes('tagline')||m.includes('headline')||m.includes('short_desc')||m.includes('summary')||m.includes('punchline')||m.includes('subtitle')){if(setVal(el,s.t))f++;}else if(el.tagName==='TEXTAREA'||m.includes('description')||m.includes('about')||m.includes('details')||m.includes('overview')){if(setVal(el,s.d))f++;}else if(m.includes('url')||m.includes('website')||m.includes('link')||m.includes('domain')||m.includes('homepage')){if(setVal(el,s.u))f++;}else if(m.includes('tool_name')||m.includes('product_name')||m.includes('app_name')||m.includes('title')||m.includes('name')){if(setVal(el,s.n))f++;}else if(m.includes('pricing')||m.includes('price')){if(setVal(el,"Free"))f++;}else if(m.includes('tag')||m.includes('keyword')){if(setVal(el,s.g))f++;}});const b=document.createElement('div');b.innerText='⚡ Auto-filled '+f+' fields with '+s.n+'!';b.style.cssText='position:fixed;top:20px;right:20px;background:#D4AF37;color:#000;padding:14px 20px;border-radius:10px;font-family:sans-serif;font-weight:bold;font-size:14px;z-index:999999;box-shadow:0 4px 20px rgba(0,0,0,0.5);';document.body.appendChild(b);setTimeout(()=>b.remove(),4000);})();
*/

// ==============================================================================
// 2. UNMINIFIED SOURCE CODE (FOR REFERENCE & INSPECTION):
// ==============================================================================
(function universalAutoFill() {
    const tools = {
        "1": {
            name: "Academic Wizard Linguistic AI Detector",
            url: "https://academicwizard.online/tools/ai-detector/",
            tagline: "Free AI Content & Academic Integrity Detector for Essays",
            desc: "Academic Wizard's Linguistic AI Detector analyzes sentence-level perplexity and burstiness to verify student essays against false Turnitin flags. Strict non-repository policy—never stored or indexed.",
            tags: "ai detector, academic integrity, turnitin checker, essay checker, edtech"
        },
        "2": {
            name: "Academic Wizard AI Text Humanizer",
            url: "https://academicwizard.online/tools/ai-humanizer/",
            tagline: "Transform AI-Assisted Writing into Natural Academic Prose",
            desc: "Academic Wizard's AI Text Humanizer eliminates robotic phrasing, injects authentic academic cadence, and protects in-text citations (APA, Harvard, OSCOLA) during rewriting.",
            tags: "ai humanizer, paraphrasing tool, bypass ai detection, academic rewrite, essay polish"
        },
        "3": {
            name: "Academic Wizard Automatic Citation Generator",
            url: "https://academicwizard.online/tools/citation-generator/",
            tagline: "Free Multi-Style Academic Reference & Bibliography Generator",
            desc: "Instant citation generator supporting APA 7th, MLA 9th, Harvard, Chicago 17th, IEEE, and Vancouver with one-click bibliography export.",
            tags: "citation generator, apa citation, harvard referencing, bibliography maker, academic references"
        },
        "4": {
            name: "Academic Wizard Academic Grammar & Spell Checker",
            url: "https://academicwizard.online/tools/grammar-checker/",
            tagline: "Scholarly Grammar, Syntax & Style Polishing Engine",
            desc: "Academic-grade grammar and spell checker eliminating informal colloquialisms, weak transitions, and faulty syntax for distinction-level papers.",
            tags: "grammar checker, essay proofreader, academic spell check, writing enhancer, free proofreading"
        },
        "5": {
            name: "Academic Wizard Free Student AI Tools Suite",
            url: "https://academicwizard.online/tools/",
            tagline: "All-in-One Free AI Writing & Academic Integrity Platform",
            desc: "Suite of 100% free web utilities: Linguistic AI Detection, AI Humanization, APA/Harvard Citation Maker, and Academic Grammar Polisher.",
            tags: "ai tools for students, free academic tools, essay helper, citation maker, edtech"
        }
    };

    const choice = prompt(
        "Select Academic Wizard Tool to Autofill:\n1: AI Detector\n2: AI Humanizer\n3: Citation Generator\n4: Grammar Checker\n5: All-in-One Suite\n\n(Enter 1-5, default 1):",
        "1"
    ) || "1";

    const selected = tools[choice] || tools["1"];

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
            if (setVal(el, "support@academicwizard.online")) filledCount++;
        } else if (combined.includes('tagline') || combined.includes('headline') || combined.includes('short_desc') || combined.includes('summary') || combined.includes('punchline') || combined.includes('subtitle')) {
            if (setVal(el, selected.tagline)) filledCount++;
        } else if (el.tagName === 'TEXTAREA' || combined.includes('description') || combined.includes('about') || combined.includes('details') || combined.includes('overview')) {
            if (setVal(el, selected.desc)) filledCount++;
        } else if (combined.includes('url') || combined.includes('website') || combined.includes('link') || combined.includes('domain') || combined.includes('homepage')) {
            if (setVal(el, selected.url)) filledCount++;
        } else if (combined.includes('tool_name') || combined.includes('product_name') || combined.includes('app_name') || combined.includes('title') || combined.includes('name')) {
            if (setVal(el, selected.name)) filledCount++;
        } else if (combined.includes('pricing') || combined.includes('price')) {
            if (setVal(el, "Free")) filledCount++;
        } else if (combined.includes('tag') || combined.includes('keyword')) {
            if (setVal(el, selected.tags)) filledCount++;
        }
    });

    const toast = document.createElement('div');
    toast.innerText = `⚡ Auto-filled ${filledCount} fields with ${selected.name}!`;
    toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#D4AF37;color:#000;padding:14px 20px;border-radius:10px;font-family:sans-serif;font-weight:bold;font-size:14px;z-index:999999;box-shadow:0 4px 20px rgba(0,0,0,0.5);';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
})();
