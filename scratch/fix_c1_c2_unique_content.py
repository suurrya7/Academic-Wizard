"""
C1 + C2 Fix: Generate unique FAQs, metaTitles, and metaDescriptions
for all 56 country variants in services.js

This script uses regex to find and replace the duplicated FAQ blocks
and inject unique metaTitle/metaDescription for each country entry.
"""
import re

FILE_PATH = "/Users/surya/Desktop/Academic Wizard Latest./src/data/services.js"

# ─── UNIQUE FAQs PER SERVICE × COUNTRY ───────────────────────────────────────
# Each key is (service_slug, country_slug) → list of unique FAQ dicts

UNIQUE_FAQS = {
    # ── ASSIGNMENT HELP ──────────────────────────────────────────────────────
    ("assignment-help", "uk"): [
        {"q": "Are your writers familiar with UK grading criteria?", "a": "Yes, our academic advisors hold degrees from leading British universities and specialize in the critical evaluation frameworks required for UK degrees."},
        {"q": "Can you format according to Cite Them Right Harvard?", "a": "Absolutely. Our editors are fully trained in the Cite Them Right standard used by most UK institutions."},
        {"q": "Do you offer assignment help for students in Scotland or Wales?", "a": "Yes, we regularly support students across the UK, including those studying in Edinburgh, Glasgow, Cardiff, and beyond, ensuring alignment with their specific university rubrics."},
        {"q": "Can you help with HNC, HND, and Edexcel assignments?", "a": "Absolutely. Our experts are well-versed in the practical and theoretical requirements of HNC, HND, and Edexcel qualifications."},
        {"q": "Do you provide support for university resit assignments?", "a": "Yes, we offer targeted support for resit assignments. We can review your previous feedback to ensure the new submission addresses all tutor comments and meets the required passing standard."},
        {"q": "What types of university assessments do you help with?", "a": "We cover essays, case studies, lab reports, reflective journals, group project contributions, presentations, portfolios, and all forms of coursework across PTLLS, LSPM, and ATHE qualifications."},
    ],
    ("assignment-help", "usa"): [
        {"q": "Does your service cover GPA improvement guidelines?", "a": "Yes, we focus on helping you understand grading rubrics to produce essays that hit high GPA requirements at US colleges and universities."},
        {"q": "Which citation styles do you support for American universities?", "a": "We are proficient in APA 7th Edition, MLA 9th Edition, Chicago/Turabian, and IEEE — the primary formats used across US institutions."},
        {"q": "Can you help with community college transfer assignments?", "a": "Yes, we assist community college students preparing transfer portfolios and assignments that need to meet four-year university admissions standards."},
        {"q": "Do you understand the US credit-hour system?", "a": "Absolutely. Our advisors are familiar with how credit hours, cumulative GPA, and Dean's List requirements work across American universities."},
        {"q": "Can you help with capstone projects?", "a": "Yes, we support capstone and senior thesis projects across all disciplines, helping you design your research framework and present findings effectively."},
    ],
    ("assignment-help", "australia"): [
        {"q": "Do you understand the HD/D/C grading scale in Australia?", "a": "Yes, our tutors are fully versed in Australian university marking rubrics and structure support to hit HD and Distinction benchmarks."},
        {"q": "Are you familiar with the Australian Qualifications Framework?", "a": "Absolutely. We align all our guidance with AQF levels and the specific learning outcomes required by TEQSA-accredited institutions."},
        {"q": "Can you help with TAFE assignments?", "a": "Yes, we support both university and TAFE-level assignments, understanding the practical competency focus of vocational education in Australia."},
        {"q": "Which referencing styles are used in Australian universities?", "a": "We handle AGM, Harvard (AGPS), APA, and Vancouver styles commonly required across Go8 and metropolitan universities."},
        {"q": "Do you support international students studying in Australia?", "a": "Yes, many of our clients are international students adjusting to Australian academic expectations. We help bridge the gap in writing standards and assessment formats."},
    ],
    ("assignment-help", "canada"): [
        {"q": "Do your editors support Canadian spelling conventions?", "a": "Yes, we adjust spelling and vocabulary styles specifically for Canadian university submissions, including the Canadian Oxford standard."},
        {"q": "Can you help with French-language assignments from Quebec?", "a": "We primarily support English-language assignments, but we can assist with bilingual formatting requirements common at McGill and Université de Montréal."},
        {"q": "Are you familiar with Canadian academic integrity policies?", "a": "Yes, our advisors understand Tri-Agency policies and the academic integrity standards enforced at Canadian institutions like UBC, U of T, and McMaster."},
        {"q": "Do you cover Co-op work term reports?", "a": "Absolutely. We help students at the University of Waterloo and similar co-op programs structure their work term reports to meet both academic and employer standards."},
        {"q": "What subjects do you cover for Canadian students?", "a": "We cover all major disciplines including nursing, law, business, engineering, computer science, social sciences, and humanities across Canadian universities."},
    ],
    ("assignment-help", "india"): [
        {"q": "Can you help with thesis structuring for Indian universities?", "a": "Yes, we specialize in structuring theses and research papers to align with UGC and specific university guidelines in India."},
        {"q": "Do you support IIT and IIM assignment formats?", "a": "Absolutely. Our advisors are familiar with the technical writing standards, lab report formats, and case analysis methodologies used at IITs and IIMs."},
        {"q": "Can you help with IGNOU assignments?", "a": "Yes, we provide support for IGNOU distance learning assignments, ensuring they meet the specific submission guidelines and marking schemes."},
        {"q": "Are you familiar with CBCS and semester-based patterns?", "a": "Yes, we understand the Choice Based Credit System adopted by Indian universities and can align our support with semester-specific requirements."},
        {"q": "Do you offer support in regional languages?", "a": "Our primary support is in English, which is the medium of instruction at most premier Indian institutions. We ensure your English academic writing meets international standards."},
    ],
    ("assignment-help", "ireland"): [
        {"q": "Are your services compliant with Irish university policies?", "a": "Yes, our services focus on ethical editing and academic guidance to help you write better papers, in full compliance with Irish university guidelines."},
        {"q": "Do you understand the NFQ framework?", "a": "Absolutely. We align our guidance with the Irish National Framework of Qualifications, ensuring your work meets the expected learning outcomes for your NFQ level."},
        {"q": "Can you help with Technological University (TU) assignments?", "a": "Yes, we support students across TU Dublin, ATU, SETU, and MTU, understanding the practical and applied research focus of these institutions."},
        {"q": "Which referencing styles are used in Irish universities?", "a": "Irish universities commonly require Cite Them Right Harvard, APA, and OSCOLA (for law). Our editors are trained in all three."},
        {"q": "Do you help with QQI-accredited programme assignments?", "a": "Yes, we support assignments across QQI-validated programmes at both NFQ Level 6 (Higher Certificate) and Level 8 (Honours Degree)."},
    ],
    ("assignment-help", "singapore"): [
        {"q": "Do your writers cover NUS and NTU course guidelines?", "a": "Yes, our academic advisors are familiar with the high standards and rubrics used at NUS, NTU, and SMU, including their modular credit systems."},
        {"q": "Can you help with SIT applied learning assignments?", "a": "Yes, we support SIT's unique integrated work-study model and the applied research assignments specific to their programmes."},
        {"q": "How do you handle the bell-curve grading system?", "a": "We understand that Singaporean universities grade on a relative curve. Our guidance focuses on producing work that stands out analytically, not just meets minimum requirements."},
        {"q": "Do you support polytechnic diploma assignments?", "a": "Yes, we assist students from Singapore Polytechnic, Ngee Ann Polytechnic, and others with both academic and project-based assignments."},
        {"q": "Can you help with CAP score improvement?", "a": "Absolutely. We help you understand how each module grade contributes to your Cumulative Average Point and focus support on your weakest areas for maximum impact."},
    ],
    ("assignment-help", "germany"): [
        {"q": "Can you help with Hausarbeit and Seminararbeit?", "a": "Yes, we specialize in the structured academic writing formats used in German universities, including Hausarbeiten, Seminararbeiten, and Abschlussarbeiten."},
        {"q": "Are you familiar with Wissenschaftliches Arbeiten standards?", "a": "Absolutely. Our advisors understand the rigorous standards of German academic writing, including proper Quellenangabe and the use of Fußnoten."},
        {"q": "Do you support ECTS credit-based assignments?", "a": "Yes, we understand the Bologna Process and ECTS framework used across German universities, aligning our support with the expected workload per credit."},
        {"q": "Can you help international students studying in English-taught programmes?", "a": "Yes, many German universities offer English-taught master's programmes. We help international students meet the academic writing standards expected in these courses."},
        {"q": "Which citation styles are common in German universities?", "a": "German universities typically use Chicago, APA, or institution-specific footnote styles. We adapt to whatever your Lehrstuhl requires."},
    ],

    # ── ESSAY HELP ────────────────────────────────────────────────────────────
    ("essay-help", "uk"): [
        {"q": "How do you ensure essays meet Russell Group standards?", "a": "Our writers hold postgraduate degrees from Russell Group universities and understand the critical analysis depth expected at institutions like UCL, Manchester, and Edinburgh."},
        {"q": "Can you help with A-Level and undergraduate essays?", "a": "Yes, we support both A-Level students preparing for university and undergraduate students across all year groups."},
        {"q": "Do you follow UK-specific essay structures?", "a": "Absolutely. We understand the introduction-body-conclusion conventions with heavy emphasis on critical evaluation that UK markers expect."},
        {"q": "Can you help with discursive and argumentative essays?", "a": "Yes, we specialise in both essay types and can guide you through building balanced arguments or strong one-sided positions as required."},
        {"q": "What turnaround times do you offer?", "a": "We offer flexible deadlines from 14 days down to 12 hours for urgent essay support."},
    ],
    ("essay-help", "usa"): [
        {"q": "Do you support college application essays?", "a": "Yes, we help students craft compelling personal statements and supplemental essays for college admissions across Common App and Coalition platforms."},
        {"q": "Can you help with AP and honors-level essays?", "a": "Absolutely. Our writers understand the analytical rigour expected in AP English, AP History, and honors-level coursework."},
        {"q": "How do you handle thesis-driven essays for US colleges?", "a": "American essays require a clear, arguable thesis in the introduction. We coach you through crafting a strong thesis and supporting it with evidence across body paragraphs."},
        {"q": "Do you support MLA and APA formatting?", "a": "Yes, we are experts in MLA 9th Edition, APA 7th Edition, and Chicago/Turabian — the three most common styles at US institutions."},
        {"q": "Can you help with timed essay exam preparation?", "a": "Yes, we offer coaching on essay planning under time pressure, helping you develop outlines quickly and write coherent arguments within exam constraints."},
    ],
    ("essay-help", "australia"): [
        {"q": "Do you understand Australian essay marking rubrics?", "a": "Yes, our writers are familiar with the HD/D/C/P/F grading criteria used across Go8 and metropolitan Australian universities."},
        {"q": "Can you help with reflective essays?", "a": "Absolutely. Australian universities frequently assign reflective essays using Gibbs' or Kolb's reflective cycles. We guide you through structuring authentic reflections."},
        {"q": "Do you support IELTS essay preparation?", "a": "Yes, we help international students preparing for IELTS Academic Writing Task 2 with structure, vocabulary, and coherence coaching."},
        {"q": "Which Australian English conventions do you follow?", "a": "We use Australian English spelling, grammar, and academic conventions as standard for all Australian university submissions."},
        {"q": "Can you help with group essay contributions?", "a": "Yes, we help you structure your individual contribution to group essays, ensuring it integrates seamlessly with the overall argument."},
    ],
    ("essay-help", "canada"): [
        {"q": "Do you handle essays for both anglophone and francophone universities?", "a": "We primarily support English-language essay writing. For bilingual universities like Ottawa and McGill, we ensure your English essays meet their specific standards."},
        {"q": "Can you help with comparative essays common in Canadian programmes?", "a": "Yes, Canadian courses frequently assign comparative analysis essays. We help you structure balanced comparisons with clear analytical frameworks."},
        {"q": "Are you familiar with Canadian academic conventions?", "a": "Absolutely. We follow Canadian English spelling and the specific citation formats required by universities like U of T, UBC, and Dalhousie."},
        {"q": "Do you support graduate-level essay writing?", "a": "Yes, we assist master's and doctoral students with scholarly essays, literature reviews, and critical response papers."},
        {"q": "What is your revision policy for Canadian students?", "a": "We offer unlimited free revisions until your essay meets your university's specific requirements and your personal satisfaction."},
    ],
    ("essay-help", "india"): [
        {"q": "Can you help with competitive exam essay preparation?", "a": "Yes, we support essay preparation for UPSC, CAT, and other competitive examinations that require structured analytical writing."},
        {"q": "Do you understand the essay formats used at Indian universities?", "a": "Absolutely. We are familiar with the descriptive, analytical, and critical essay formats expected at institutions like JNU, Delhi University, and Ashoka."},
        {"q": "Can you help with English proficiency improvement?", "a": "Yes, our editing and coaching services help Indian students strengthen their academic English, including vocabulary, sentence structure, and formal tone."},
        {"q": "Do you support law school essay formats?", "a": "Yes, we understand the case analysis and legal reasoning essay structures used at NLUs and top Indian law schools."},
        {"q": "What subjects do you cover for essay writing?", "a": "We cover humanities, social sciences, business, law, engineering, and sciences — essentially all disciplines taught at Indian universities."},
    ],
    ("essay-help", "ireland"): [
        {"q": "Do you understand Irish university essay expectations?", "a": "Yes, Irish universities emphasize independent critical thinking and evidence-based arguments. Our advisors are trained in these specific expectations."},
        {"q": "Can you help with Level 8 Honours Degree essays?", "a": "Absolutely. We support essays at NFQ Level 8 and above, ensuring the critical depth and referencing accuracy expected at honours degree level."},
        {"q": "Do you follow Cite Them Right Harvard for Irish essays?", "a": "Yes, most Irish universities use Cite Them Right Harvard. Our editors are fully trained in this referencing standard."},
        {"q": "Can you help with essays for Springboard+ courses?", "a": "Yes, we support students on government-funded Springboard+ programmes who need academic writing assistance for their course assessments."},
        {"q": "What turnaround times do you offer for Irish students?", "a": "We offer deadlines from 14 days to 12 hours. Most Irish students choose 3–7 day turnarounds for optimal quality."},
    ],
    ("essay-help", "singapore"): [
        {"q": "How do you handle the analytical depth expected at NUS?", "a": "NUS essays demand exceptional analytical depth. We focus on helping you move beyond description into critical evaluation and synthesis of multiple perspectives."},
        {"q": "Can you help with General Education module essays?", "a": "Yes, we support the interdisciplinary essay requirements of general education modules across NUS, NTU, and SMU."},
        {"q": "Do you support Business case study essays?", "a": "Absolutely. We help SMU and NTU business students craft compelling case analyses with clear frameworks like SWOT, Porter's Five Forces, and PESTEL."},
        {"q": "What makes Singaporean essay expectations different?", "a": "Singaporean universities expect extremely high-quality analytical writing with diverse source integration. We help you meet these exacting standards."},
        {"q": "Can you help with honours thesis essays?", "a": "Yes, we support honours year students with their thesis research essays, helping with literature synthesis and argument construction."},
    ],
    ("essay-help", "germany"): [
        {"q": "Can you help with English-taught programme essays in Germany?", "a": "Yes, many German universities offer English-taught master's programmes. We help you meet the academic writing standards expected in these courses."},
        {"q": "Do you understand the difference between Hausarbeit and Essay?", "a": "Absolutely. A Hausarbeit is more formal and research-intensive than a typical Anglo-American essay. We guide you through the specific structural requirements."},
        {"q": "Can you help with Exposé writing?", "a": "Yes, we support students writing research exposés (proposals) for their Abschlussarbeit, including problem statement, methodology, and timeline planning."},
        {"q": "Which academic conventions do German universities expect?", "a": "German universities emphasize thoroughness, proper Quellenarbeit, and formal academic tone. We ensure your writing meets these high standards."},
        {"q": "Do you support essays in the humanities and social sciences?", "a": "Yes, we cover Germanistik, Politikwissenschaft, Soziologie, Philosophie, and all other humanities and social science disciplines."},
    ],

    # ── DISSERTATION HELP ─────────────────────────────────────────────────────
    ("dissertation-help", "uk"): [
        {"q": "Can you help me prepare for my viva voce?", "a": "Yes, we offer dedicated viva preparation coaching where we conduct mock examinations and help you anticipate likely questions from your external examiner."},
        {"q": "Do you support PhD dissertations?", "a": "Absolutely. Our advisors include PhD holders from Russell Group universities who understand the depth and originality required at doctoral level."},
        {"q": "Can you help with ethical approval applications?", "a": "Yes, we guide you through preparing ethics committee applications, including participant information sheets and consent forms."},
        {"q": "What chapters do you help with?", "a": "We support all dissertation chapters: introduction, literature review, methodology, findings/results, discussion, and conclusion."},
        {"q": "Do you help with quantitative and qualitative dissertations?", "a": "Yes, we have specialists in both quantitative (SPSS, R, Stata) and qualitative (NVivo, thematic analysis) research methodologies."},
    ],
    ("dissertation-help", "usa"): [
        {"q": "Do you support doctoral dissertation committees?", "a": "We help you prepare for committee reviews by ensuring your proposal and chapters meet the rigorous standards expected by US doctoral committees."},
        {"q": "Can you help with IRB applications?", "a": "Yes, we guide students through Institutional Review Board applications, helping you prepare protocols and consent documents that meet federal requirements."},
        {"q": "Do you support EdD dissertations?", "a": "Absolutely. We support both PhD and EdD dissertations, understanding the practice-focused approach typically required in Doctor of Education programmes."},
        {"q": "What statistical software do your advisors use?", "a": "Our quantitative advisors are proficient in SPSS, R, SAS, and Stata for dissertation-level statistical analysis."},
        {"q": "Can you help with the prospectus and proposal stage?", "a": "Yes, we provide comprehensive support from the initial prospectus through the full proposal, ensuring your research design is methodologically sound."},
    ],
    ("dissertation-help", "australia"): [
        {"q": "Do you understand the Australian doctoral examination process?", "a": "Yes, Australian PhD theses are typically examined by external reviewers without a viva. We ensure your thesis is self-contained and clearly argued for this format."},
        {"q": "Can you help with Honours dissertations?", "a": "Absolutely. We support Australian Honours year students with their 10,000–15,000 word research projects across all disciplines."},
        {"q": "Do you support dissertations at Go8 universities?", "a": "Yes, our advisors are familiar with the research standards at Melbourne, Sydney, ANU, Monash, and other Group of Eight institutions."},
        {"q": "Can you help with systematic literature reviews?", "a": "Yes, we guide you through PRISMA-compliant systematic reviews, from search strategy development to data extraction and synthesis."},
        {"q": "What formatting standards do Australian dissertations require?", "a": "We follow each university's specific thesis formatting guide, including Harvard (AGPS), APA, and Vancouver citation styles."},
    ],
    ("dissertation-help", "canada"): [
        {"q": "Do you support master's and doctoral theses?", "a": "Yes, we provide comprehensive support for both master's theses and doctoral dissertations across all Canadian universities."},
        {"q": "Can you help with the comprehensive exam preparation?", "a": "Yes, many Canadian doctoral programs include comprehensive exams. We help you prepare reading lists, synthesise key theories, and practice written responses."},
        {"q": "Do you understand Canadian research ethics boards?", "a": "Absolutely. We guide you through TCPS 2 (Tri-Council Policy Statement) requirements for human research ethics applications."},
        {"q": "Can you help with mixed-methods dissertations?", "a": "Yes, we support the design and execution of mixed-methods research, helping you integrate quantitative and qualitative strands effectively."},
        {"q": "What is your experience with Canadian thesis formatting?", "a": "We follow the specific formatting requirements of each Canadian university, including proper front matter, pagination, and reference list standards."},
    ],
    ("dissertation-help", "india"): [
        {"q": "Do you support PhD dissertations at Indian universities?", "a": "Yes, we support doctoral students at IITs, central universities, and state universities, ensuring compliance with UGC PhD regulations."},
        {"q": "Can you help with the synopsis submission?", "a": "Absolutely. We help you prepare the research synopsis required for PhD registration, including problem statement, objectives, and proposed methodology."},
        {"q": "Do you understand the Indian PhD examination system?", "a": "Yes, we are familiar with the open viva, pre-submission seminar, and external examiner system used at Indian universities."},
        {"q": "Can you help with Shodhganga submission requirements?", "a": "Yes, we ensure your thesis formatting meets the requirements for submission to the Shodhganga repository as mandated by UGC."},
        {"q": "What research tools do you support?", "a": "Our advisors are proficient in SPSS, R, MATLAB, NVivo, and Atlas.ti for quantitative and qualitative dissertation research."},
    ],
    ("dissertation-help", "ireland"): [
        {"q": "Do you support research master's dissertations?", "a": "Yes, we support both taught master's dissertations and research master's theses at Irish universities, understanding the different depth requirements."},
        {"q": "Can you help with structured PhD programmes?", "a": "Absolutely. We understand Ireland's structured PhD model with its combination of coursework, transferable skills modules, and research components."},
        {"q": "Do you help with NFQ Level 9 and 10 research?", "a": "Yes, we support research at NFQ Level 9 (master's) and Level 10 (doctoral), ensuring your work meets the Irish quality standards."},
        {"q": "Can you assist with funding body requirements?", "a": "Yes, we help you meet the reporting and output requirements of Irish funding bodies like IRC and SFI."},
        {"q": "What ethical approval processes do Irish universities use?", "a": "We guide you through your university's specific REC (Research Ethics Committee) application process, including participant consent and data protection considerations."},
    ],
    ("dissertation-help", "singapore"): [
        {"q": "Do you support NUS and NTU PhD dissertations?", "a": "Yes, our advisors understand the rigorous standards at NUS and NTU, including their qualifying examination and thesis submission requirements."},
        {"q": "Can you help with industry-sponsored dissertations?", "a": "Absolutely. We support students working on industry-collaborative research projects, helping balance commercial confidentiality with academic disclosure."},
        {"q": "Do you understand the Singaporean PhD timeline?", "a": "Yes, we are familiar with the candidacy milestones, including qualifying exams, thesis proposal defence, and final oral examination at Singaporean universities."},
        {"q": "Can you help with publication-based theses?", "a": "Yes, we support students pursuing thesis-by-publication, helping you structure your compilation and write the framing narrative."},
        {"q": "What disciplines do you cover?", "a": "We cover STEM, business, social sciences, humanities, and interdisciplinary research across all Singaporean universities."},
    ],
    ("dissertation-help", "germany"): [
        {"q": "Can you help with a Doktorarbeit?", "a": "Yes, we support doctoral students writing their Doktorarbeit, understanding the monograph tradition and the high standards of Wissenschaftlichkeit expected."},
        {"q": "Do you understand the cumulative dissertation format?", "a": "Absolutely. We help students pursuing a kumulative Dissertation structure their publication portfolio and write the overarching Rahmentext."},
        {"q": "Can you help with the Rigorosum preparation?", "a": "Yes, we provide coaching for both the Rigorosum and Disputation examination formats used across German universities."},
        {"q": "Do you support German-language dissertations?", "a": "We primarily support English-language dissertations. For German-language work, we can assist with structural planning, methodology, and English abstract writing."},
        {"q": "What is your experience with German doctoral programmes?", "a": "Our advisors understand both traditional individual doctorates and structured Graduiertenkolleg programmes."},
    ],

    # ── LITERATURE REVIEW ─────────────────────────────────────────────────────
    ("literature-review", "uk"): [
        {"q": "How many sources should a UK literature review include?", "a": "This varies by level: undergraduate reviews typically use 20-40 sources, master's 40-80, and PhDs 100+. We help you identify the right scope for your project."},
        {"q": "Do you use UK academic databases?", "a": "Yes, we guide you through database searches using JSTOR, Scopus, Web of Science, and your university's specific e-library resources."},
        {"q": "Can you help with a systematic review?", "a": "Absolutely. We support PRISMA-compliant systematic reviews with proper search protocol documentation and quality assessment."},
        {"q": "Do you help with critical analysis or just summarising?", "a": "We focus heavily on critical analysis — synthesising themes, identifying contradictions, and articulating the research gap, not just listing what authors said."},
        {"q": "What referencing styles do you support?", "a": "We support Cite Them Right Harvard, APA, OSCOLA, MHRA, Vancouver, and IEEE for UK university submissions."},
    ],
    ("literature-review", "usa"): [
        {"q": "How do you approach a US-style literature review?", "a": "American lit reviews emphasize theoretical framework construction. We help you build a conceptual foundation that directly supports your research questions."},
        {"q": "Can you help with an annotated bibliography?", "a": "Yes, we support annotated bibliographies in APA and MLA formats, helping you write concise, evaluative annotations for each source."},
        {"q": "Do you search grey literature and government reports?", "a": "Absolutely. For US-based research, we include relevant sources from federal agencies, think tanks, and policy organisations alongside peer-reviewed journals."},
        {"q": "Can you help identify the research gap?", "a": "Yes, gap identification is central to our process. We help you articulate exactly where existing research falls short and how your study fills that void."},
        {"q": "What databases do you use for US research?", "a": "We search PubMed, PsycINFO, ERIC, CINAHL, EBSCOhost, and discipline-specific databases relevant to your field."},
    ],
    ("literature-review", "australia"): [
        {"q": "Do you follow Australian university literature review guidelines?", "a": "Yes, we tailor our approach to match the specific guidelines provided by your Australian university, including word count, structure, and depth expectations."},
        {"q": "Can you help with scoping reviews?", "a": "Absolutely. We support scoping reviews following the Arksey and O'Malley framework, popular in Australian health and social science research."},
        {"q": "Do you cover Australian-specific research topics?", "a": "Yes, we include relevant Australian research, policy documents, and institutional reports alongside international peer-reviewed literature."},
        {"q": "Can you help with Indigenous research methodologies?", "a": "We acknowledge and support culturally responsive literature reviews that engage with Aboriginal and Torres Strait Islander research frameworks."},
        {"q": "How do you ensure currency of sources?", "a": "We prioritise literature published within the last 5-10 years while including foundational texts, following the recency expectations of Australian reviewers."},
    ],
    ("literature-review", "canada"): [
        {"q": "Do you include Canadian research in the review?", "a": "Yes, we ensure relevant Canadian studies, policy documents, and institutional research are included alongside international literature."},
        {"q": "Can you help with integrative literature reviews?", "a": "Absolutely. We support integrative reviews that synthesise both qualitative and quantitative research, a common format in Canadian graduate programmes."},
        {"q": "Do you follow Canadian ethical guidelines for research?", "a": "Yes, we ensure your literature review methodology aligns with TCPS 2 principles when reviewing studies involving human participants."},
        {"q": "Can you help with bilingual literature searches?", "a": "We primarily search English-language databases but can include relevant French-language Canadian studies when they are critical to your topic."},
        {"q": "What disciplines do you cover?", "a": "We support literature reviews across all disciplines, from health sciences and education to engineering and public policy."},
    ],
    ("literature-review", "india"): [
        {"q": "Do you support literature reviews for Indian PhD programmes?", "a": "Yes, we help doctoral students at Indian universities construct comprehensive literature reviews that meet UGC and institutional standards."},
        {"q": "Can you help with Scopus-indexed journal preparation?", "a": "Absolutely. We help you structure your literature review for publication in Scopus and UGC-CARE listed journals."},
        {"q": "Do you cover Indian research databases?", "a": "Yes, we search Shodhganga, Indian Citation Index, and J-Gate alongside international databases to ensure comprehensive coverage."},
        {"q": "Can you help identify research gaps in Indian contexts?", "a": "Yes, we specialize in identifying gaps where international research has not been adequately tested or applied in the Indian context."},
        {"q": "What citation formats do Indian universities prefer?", "a": "Most Indian universities use APA or IEEE. We adapt to your university's specific requirements."},
    ],
    ("literature-review", "ireland"): [
        {"q": "How do you approach literature reviews for Irish universities?", "a": "We follow the critical analysis approach expected at Irish universities, emphasizing thematic synthesis over chronological summaries."},
        {"q": "Can you help with healthcare literature reviews?", "a": "Yes, we support nursing and healthcare students with CINAHL and PubMed searches for evidence-based practice reviews at institutions like RCSI and UCD."},
        {"q": "Do you include Irish policy documents?", "a": "Absolutely. We incorporate relevant Irish government reports, HSE publications, and HEA documents when they contribute to your research context."},
        {"q": "Can you help with a narrative review?", "a": "Yes, we support narrative, systematic, scoping, and integrative review methodologies depending on your research requirements."},
        {"q": "What is the expected scope for an Irish master's review?", "a": "Irish master's dissertations typically require 40-60 peer-reviewed sources. We help you build a comprehensive yet focused selection."},
    ],
    ("literature-review", "singapore"): [
        {"q": "Do you understand NUS literature review requirements?", "a": "Yes, NUS expects exceptionally thorough literature reviews with diverse international sources. We ensure your review demonstrates comprehensive scholarly engagement."},
        {"q": "Can you help with technology and innovation reviews?", "a": "Absolutely. We support literature reviews in STEM, computing, and technology innovation — areas where Singaporean universities excel."},
        {"q": "Do you cover Southeast Asian research?", "a": "Yes, we include relevant ASEAN-region studies alongside global literature to provide the regional context valued by Singaporean reviewers."},
        {"q": "Can you help with cross-disciplinary reviews?", "a": "Yes, Singaporean universities often encourage interdisciplinary research. We help you synthesise literature across multiple fields coherently."},
        {"q": "What databases do you search?", "a": "We use Scopus, Web of Science, IEEE Xplore, PubMed, and discipline-specific databases relevant to your research area."},
    ],
    ("literature-review", "germany"): [
        {"q": "Do you understand the Forschungsstand section?", "a": "Yes, the Forschungsstand (state of research) is central to German academic writing. We help you construct a comprehensive and critical overview of existing scholarship."},
        {"q": "Can you help with German-language source integration?", "a": "We can help you reference and integrate German-language sources within an English-language literature review, ensuring proper citation."},
        {"q": "Do you support Fachliteratur searches?", "a": "Yes, we guide searches through both international databases and German-specific resources like GESIS, FIS Bildung, and the Deutsche Nationalbibliothek."},
        {"q": "Can you help with the Theorie chapter?", "a": "Absolutely. German theses often separate the theoretical framework (Theorie) from the empirical literature review. We support both chapters."},
        {"q": "What citation standards do German universities use?", "a": "We support Chicago footnote style, APA, and institution-specific Zitierweise as required by your Lehrstuhl."},
    ],

    # ── RESEARCH PAPER HELP ───────────────────────────────────────────────────
    ("research-paper-help", "uk"): [
        {"q": "Can you help with a research paper for a UK journal?", "a": "Yes, we help format your paper to meet the submission guidelines of UK-based and international academic journals."},
        {"q": "Do you support mixed-methods research papers?", "a": "Absolutely. We help you design and write up mixed-methods studies, integrating both quantitative and qualitative findings coherently."},
        {"q": "Can you help with conference paper submissions?", "a": "Yes, we support conference paper preparation including abstract writing, poster design guidance, and full paper formatting."},
        {"q": "What statistical analysis do you support?", "a": "Our advisors are proficient in SPSS, R, Stata, and Excel for statistical analysis, from basic descriptive statistics to advanced regression modelling."},
        {"q": "Do you help with the peer review revision process?", "a": "Yes, we help you address reviewer comments systematically, prepare point-by-point response letters, and revise your manuscript accordingly."},
    ],
    ("research-paper-help", "usa"): [
        {"q": "Can you help with NSF-funded research papers?", "a": "Yes, we help researchers format papers that acknowledge NSF and other federal funding bodies according to their specific requirements."},
        {"q": "Do you support undergraduate research papers?", "a": "Absolutely. We help undergraduates at US colleges develop their first research papers, from hypothesis formulation to results presentation."},
        {"q": "Can you help with IRB-compliant methodology sections?", "a": "Yes, we ensure your methodology section accurately describes procedures approved by your Institutional Review Board."},
        {"q": "Do you support STEM research papers?", "a": "Yes, we have advisors specializing in STEM disciplines who understand the specific conventions of scientific research writing."},
        {"q": "Can you help with literature-based research papers?", "a": "Yes, for humanities and social sciences, we support papers based on textual analysis, archival research, and theoretical argumentation."},
    ],
    ("research-paper-help", "australia"): [
        {"q": "Do you support ERA-ranked journal submissions?", "a": "Yes, we help format your paper for submission to journals ranked in the Excellence in Research for Australia framework."},
        {"q": "Can you help with health and medical research papers?", "a": "Absolutely. We support NHMRC-funded research papers with proper methodology reporting, including CONSORT and STROBE checklists."},
        {"q": "Do you follow Australian research ethics guidelines?", "a": "Yes, we ensure your methodology section reflects compliance with the National Statement on Ethical Conduct in Human Research."},
        {"q": "Can you help with environmental and sustainability research?", "a": "Yes, we support research papers in environmental science, sustainability, and climate studies — key strengths of Australian universities."},
        {"q": "What formatting standards do you follow?", "a": "We follow the specific author guidelines of your target journal, whether it requires APA, Vancouver, Harvard, or a custom format."},
    ],
    ("research-paper-help", "canada"): [
        {"q": "Can you help with SSHRC and NSERC research papers?", "a": "Yes, we help format papers acknowledging Canadian Tri-Agency funding and meeting their publication requirements."},
        {"q": "Do you support Indigenous research methodologies?", "a": "We support research papers that engage with Indigenous knowledge systems and follow the OCAP® principles for research involving First Nations communities."},
        {"q": "Can you help with policy research papers?", "a": "Absolutely. We support policy-oriented research papers common in Canadian public administration and social policy programmes."},
        {"q": "Do you cover Canadian healthcare research?", "a": "Yes, we support research papers in nursing, public health, and clinical research following Canadian healthcare research conventions."},
        {"q": "What databases do you use for Canadian research?", "a": "We search CINAHL, PubMed, ERIC, Scholars Portal, and Canadian-specific repositories to ensure comprehensive source coverage."},
    ],
    ("research-paper-help", "india"): [
        {"q": "Can you help publish in UGC-CARE listed journals?", "a": "Yes, we help format your paper to meet the submission guidelines of UGC-CARE listed and Scopus-indexed journals."},
        {"q": "Do you support technical research papers?", "a": "Absolutely. We help IIT and NIT students with technical paper writing, including IEEE and ACM conference paper formats."},
        {"q": "Can you help with interdisciplinary research?", "a": "Yes, we support cross-disciplinary research papers that combine engineering, social sciences, or management perspectives."},
        {"q": "Do you help with research paper presentations?", "a": "Yes, we help you prepare conference presentations, including slide design guidance and key talking points for your paper."},
        {"q": "What plagiarism detection tools do you use?", "a": "We check all work using Turnitin and iThenticate to ensure originality before submission to any journal."},
    ],
    ("research-paper-help", "ireland"): [
        {"q": "Can you help with IRC-funded research papers?", "a": "Yes, we help researchers format papers acknowledging Irish Research Council funding and meeting their output requirements."},
        {"q": "Do you support clinical research papers?", "a": "Absolutely. We support healthcare research papers following RCSI and HRB guidelines for clinical and health services research."},
        {"q": "Can you help with a conference paper for an Irish conference?", "a": "Yes, we support paper preparation for Irish academic conferences across all disciplines."},
        {"q": "Do you help with research ethics sections?", "a": "Yes, we ensure your methodology accurately reflects your REC approval and follows GDPR-compliant data handling procedures."},
        {"q": "What is your experience with Irish research standards?", "a": "Our advisors are familiar with the research quality expectations of HEA-funded Irish institutions and SFI-supported research programmes."},
    ],
    ("research-paper-help", "singapore"): [
        {"q": "Do you support A*STAR-affiliated research papers?", "a": "Yes, we help researchers at A*STAR institutes format papers for submission to high-impact international journals."},
        {"q": "Can you help with computational research papers?", "a": "Absolutely. We support computational and data science research papers, including methodology descriptions for machine learning and AI studies."},
        {"q": "Do you cover business and management research?", "a": "Yes, we support SMU and NTU business school research papers, including quantitative finance and organizational behaviour studies."},
        {"q": "Can you help with grant-funded research output?", "a": "Yes, we help you meet the publication requirements of MOE and NRF research grants."},
        {"q": "What impact factor journals do you target?", "a": "We help format papers for Q1 and Q2 journals across all major indexing services (Scopus, Web of Science, PubMed)."},
    ],
    ("research-paper-help", "germany"): [
        {"q": "Can you help with DFG-funded research papers?", "a": "Yes, we help format papers acknowledging Deutsche Forschungsgemeinschaft funding and meeting their open-access publication requirements."},
        {"q": "Do you understand the German publication tradition?", "a": "Absolutely. We understand both the monograph tradition in humanities and the journal article tradition in STEM, adapting our support accordingly."},
        {"q": "Can you help with Sammelband contributions?", "a": "Yes, we support the writing of book chapter contributions (Sammelbände) common in German humanities and social science publishing."},
        {"q": "Do you help with open-access compliance?", "a": "Yes, we help ensure your paper meets the open-access requirements of German research funders and institutional repositories."},
        {"q": "Can you help with conference proceedings papers?", "a": "Yes, we support paper formatting for both German and international conference proceedings, including IEEE, ACM, and Springer formats."},
    ],

    # ── EDITING & PROOFREADING ────────────────────────────────────────────────
    ("editing-proofreading", "uk"): [
        {"q": "Do you use British English spelling standards?", "a": "Yes, all our UK editing follows British English conventions, including spelling (organise, centre, colour), punctuation, and academic vocabulary."},
        {"q": "Can you edit my dissertation for submission?", "a": "Absolutely. We provide comprehensive dissertation editing covering grammar, structure, citation accuracy, and academic tone."},
        {"q": "Do you use Track Changes?", "a": "Yes, all edits are delivered using Microsoft Word Track Changes so you can review and learn from every correction."},
        {"q": "Can you check OSCOLA citations?", "a": "Yes, our legal editing team specializes in OSCOLA citation checking for UK law dissertations and essays."},
        {"q": "What turnaround do you offer for proofreading?", "a": "We offer proofreading turnarounds from 14 days to 12 hours depending on document length and urgency."},
    ],
    ("editing-proofreading", "usa"): [
        {"q": "Do you follow American English standards?", "a": "Yes, all US editing uses American English spelling, punctuation, and style conventions (organize, center, color)."},
        {"q": "Can you edit journal manuscripts?", "a": "Absolutely. We provide manuscript editing aligned with target journal guidelines, including APA, AMA, and discipline-specific formats."},
        {"q": "Do you offer substantive editing?", "a": "Yes, beyond proofreading, we offer developmental editing that addresses argument flow, paragraph structure, and overall coherence."},
        {"q": "Can you help with grant proposal editing?", "a": "Yes, we edit NIH, NSF, and other federal grant proposals, ensuring clarity, precision, and compliance with formatting requirements."},
        {"q": "Do you check for plagiarism?", "a": "Yes, we run all edited documents through Turnitin and provide a similarity report with the final delivery."},
    ],
    ("editing-proofreading", "australia"): [
        {"q": "Do you follow Australian English conventions?", "a": "Yes, we use Australian English spelling and style, including the Macquarie Dictionary standard used by Australian publishers and universities."},
        {"q": "Can you edit for TEQSA compliance?", "a": "We ensure your academic documents meet the quality standards expected by TEQSA-accredited institutions."},
        {"q": "Do you support Honours thesis editing?", "a": "Yes, we provide comprehensive editing for Honours theses, including structure, referencing, and academic tone refinement."},
        {"q": "Can you help with journal submission formatting?", "a": "Absolutely. We format your manuscript according to the author guidelines of your target Australian or international journal."},
        {"q": "What file formats do you accept?", "a": "We accept Word documents, PDFs, Google Docs, and LaTeX files. Track Changes are provided in Word format."},
    ],
    ("editing-proofreading", "canada"): [
        {"q": "Do you follow Canadian English standards?", "a": "Yes, we use Canadian English conventions, which blend British and American spelling (e.g., colour but analyze). We follow the Canadian Oxford Dictionary."},
        {"q": "Can you edit bilingual documents?", "a": "We primarily edit English-language documents. For bilingual English-French documents, we ensure the English portions are flawless."},
        {"q": "Do you provide formatting checks?", "a": "Yes, we verify formatting consistency including margins, headings, pagination, and citation style throughout your document."},
        {"q": "Can you edit graduate theses?", "a": "Absolutely. We provide comprehensive thesis editing aligned with your university's specific formatting and submission guidelines."},
        {"q": "Do you offer a certificate of editing?", "a": "Yes, upon request, we provide a certificate confirming your document has been professionally edited — useful for journal submissions."},
    ],
    ("editing-proofreading", "india"): [
        {"q": "Do you help with language improvement for ESL writers?", "a": "Yes, many Indian students write in English as a second language. We improve clarity, grammar, and academic tone while preserving your intended meaning."},
        {"q": "Can you edit for UGC-CARE journal submission?", "a": "Absolutely. We format and edit your manuscript to meet the specific requirements of UGC-CARE listed journals."},
        {"q": "Do you provide Turnitin reports?", "a": "Yes, we include a Turnitin similarity report with every edited document so you can submit with confidence."},
        {"q": "Can you edit technical and engineering papers?", "a": "Yes, our technical editors have backgrounds in engineering and computer science, understanding the specific conventions of IEEE and ACM papers."},
        {"q": "What is your turnaround time for Indian students?", "a": "We offer 14-day to 12-hour turnarounds. Most Indian students choose 3-7 day editing for optimal balance of speed and quality."},
    ],
    ("editing-proofreading", "ireland"): [
        {"q": "Do you follow Irish university formatting guidelines?", "a": "Yes, we adapt our editing to match the specific formatting and referencing requirements of Irish universities including TCD, UCD, and DCU."},
        {"q": "Can you edit for QQI-accredited submissions?", "a": "Absolutely. We understand the assessment standards for QQI-validated programmes and ensure your work meets these criteria."},
        {"q": "Do you support GDPR-compliant dissertation editing?", "a": "Yes, we handle all documents securely and in compliance with GDPR regulations, particularly important for dissertations containing personal data."},
        {"q": "Can you edit professional reports?", "a": "Yes, we edit academic and professional reports, including placement reports, work-based learning portfolios, and research reports."},
        {"q": "What referencing styles do you check?", "a": "We check Cite Them Right Harvard, APA, OSCOLA, Vancouver, and any institution-specific referencing guides."},
    ],
    ("editing-proofreading", "singapore"): [
        {"q": "Do you understand Singaporean academic writing standards?", "a": "Yes, Singaporean universities expect exceptionally polished academic English. Our editors ensure your work meets these high standards."},
        {"q": "Can you edit engineering and computing papers?", "a": "Absolutely. We have specialist editors for NTU and NUS computing and engineering submissions, familiar with IEEE and ACM conventions."},
        {"q": "Do you support thesis editing at graduate level?", "a": "Yes, we provide comprehensive editing for master's and PhD theses at Singaporean universities, including structure and argument review."},
        {"q": "Can you help with academic English for international students?", "a": "Yes, many students in Singapore are multilingual. We help ensure your academic English is clear, precise, and grammatically flawless."},
        {"q": "What is your quality assurance process?", "a": "Every document undergoes a two-stage edit: a primary editor corrects all issues, then a second reviewer performs a final quality check."},
    ],
    ("editing-proofreading", "germany"): [
        {"q": "Can you edit English-language papers by German-speaking authors?", "a": "Yes, we specialize in editing English academic writing by non-native speakers, addressing common German-to-English interference patterns."},
        {"q": "Do you help with academic English for German PhD students?", "a": "Absolutely. Many German doctoral students write in English for international publication. We ensure your writing is indistinguishable from native-level academic English."},
        {"q": "Can you edit for Springer and Elsevier journals?", "a": "Yes, we format and edit manuscripts according to Springer, Elsevier, and other major academic publisher guidelines."},
        {"q": "Do you support Lektorat-level editing?", "a": "Yes, our editing service covers both Korrektorat (proofreading) and Lektorat (substantive editing) levels of intervention."},
        {"q": "Can you check Fußnoten and bibliography consistency?", "a": "Yes, we verify that all footnotes, endnotes, and bibliography entries are consistent, complete, and correctly formatted."},
    ],

    # ── STUDY GUIDANCE ────────────────────────────────────────────────────────
    ("study-guidance", "uk"): [
        {"q": "Do you offer exam preparation coaching for UK students?", "a": "Yes, our study coaches help UK students develop effective revision strategies, past paper techniques, and exam time management skills."},
        {"q": "Can you help with independent study skills?", "a": "Absolutely. UK universities expect significant self-directed learning. We help you develop structured study routines and active learning habits."},
        {"q": "Do you support students with learning differences?", "a": "Yes, we adapt our coaching approaches for students with dyslexia, ADHD, and other learning differences, working alongside university disability services."},
        {"q": "Can you help manage dissertation alongside coursework?", "a": "Yes, we help you create a realistic timeline that balances your dissertation milestones with ongoing module assessments."},
        {"q": "What study techniques do you teach?", "a": "We teach active recall, spaced repetition, the Cornell note-taking method, Pomodoro technique, and deep reading strategies tailored to UK academic expectations."},
    ],
    ("study-guidance", "usa"): [
        {"q": "Can you help with GPA management strategies?", "a": "Yes, we help you understand how each course grade affects your cumulative GPA and develop strategic approaches to maximize your academic standing."},
        {"q": "Do you support pre-med and pre-law students?", "a": "Absolutely. We provide targeted study coaching for students preparing for MCAT, LSAT, and other graduate admissions exams alongside their coursework."},
        {"q": "Can you help with time management for student athletes?", "a": "Yes, we create tailored study schedules that accommodate athletic training, travel, and competition while maintaining academic performance."},
        {"q": "Do you offer test anxiety management?", "a": "Yes, our coaching includes evidence-based strategies for managing test anxiety, including relaxation techniques and cognitive reframing."},
        {"q": "Can you help with summer school planning?", "a": "Yes, we help you plan summer coursework strategically to lighten your fall/spring semester load or get ahead in your degree progress."},
    ],
    ("study-guidance", "australia"): [
        {"q": "Can you help international students adjust to Australian university?", "a": "Yes, we help international students adapt to the independent learning culture, assessment formats, and academic expectations of Australian universities."},
        {"q": "Do you support TAFE-to-university transition?", "a": "Absolutely. We help TAFE students develop the academic study skills needed to succeed when transitioning to university-level education."},
        {"q": "Can you help with assignment cluster management?", "a": "Yes, Australian semesters often have intense assignment deadlines clustered together. We help you plan and prioritise effectively."},
        {"q": "Do you offer exam preparation for Australian formats?", "a": "Yes, we coach students on Australian exam formats including short answer, essay-based, and multiple-choice examinations."},
        {"q": "Can you help with academic integrity understanding?", "a": "Yes, we help you understand what constitutes academic misconduct in Australian universities and develop ethical study and referencing practices."},
    ],
    ("study-guidance", "canada"): [
        {"q": "Can you help with French immersion academic challenges?", "a": "We help anglophone students in bilingual programmes manage the additional cognitive load of studying in their second language."},
        {"q": "Do you support first-generation university students?", "a": "Yes, we provide tailored coaching for students who are the first in their family to attend university, helping navigate unfamiliar academic expectations."},
        {"q": "Can you help with co-op term preparation?", "a": "Absolutely. We help Waterloo and other co-op students balance work term preparation with ongoing academic commitments."},
        {"q": "Do you offer study skills workshops?", "a": "Yes, we provide one-on-one coaching sessions covering note-taking, reading strategies, essay planning, and exam preparation."},
        {"q": "Can you help with graduate school preparation?", "a": "Yes, we help Canadian undergraduate students develop the advanced academic skills needed for success in master's and doctoral programmes."},
    ],
    ("study-guidance", "india"): [
        {"q": "Can you help with competitive exam preparation alongside university?", "a": "Yes, we help Indian students balance university coursework with preparation for competitive exams like GATE, CAT, UPSC, and NET."},
        {"q": "Do you offer coaching for semester exam preparation?", "a": "Absolutely. We help you create structured revision plans that cover extensive syllabi efficiently, using active recall and past paper analysis."},
        {"q": "Can you help with technical subject study strategies?", "a": "Yes, we provide specialized study coaching for engineering, mathematics, and science subjects common at IITs and NITs."},
        {"q": "Do you support distance learning students?", "a": "Yes, we help IGNOU and other distance learning students develop self-discipline and study routines for independent learning success."},
        {"q": "Can you help with English medium study challenges?", "a": "Yes, we support students transitioning from regional language schooling to English-medium university education, building academic English skills."},
    ],
    ("study-guidance", "ireland"): [
        {"q": "Do you support Leaving Cert to university transition?", "a": "Yes, we help Irish students bridge the gap between Leaving Certificate study habits and the independent learning demanded at university level."},
        {"q": "Can you help with CAO points maximisation?", "a": "We help Leaving Cert students develop effective study strategies to maximise their CAO points and secure their preferred course offers."},
        {"q": "Do you support mature students returning to education?", "a": "Absolutely. We provide tailored coaching for mature students re-entering education through Access programmes or Springboard+ courses."},
        {"q": "Can you help with continuous assessment strategies?", "a": "Yes, Irish universities increasingly use continuous assessment. We help you manage ongoing deadlines and maintain consistent quality throughout the semester."},
        {"q": "Do you offer exam technique coaching?", "a": "Yes, we teach specific exam techniques for different assessment types including open-book, closed-book, and take-home examinations."},
    ],
    ("study-guidance", "singapore"): [
        {"q": "Can you help with bell-curve grading strategies?", "a": "Yes, we help you understand how bell-curve grading works at NUS and NTU, and develop strategies to perform above the cohort median."},
        {"q": "Do you support polytechnic-to-university transition?", "a": "Absolutely. We help polytechnic graduates adapt to the significantly more rigorous academic expectations at Singapore's universities."},
        {"q": "Can you help with cross-faculty module selection?", "a": "Yes, we help you strategically select modules that balance your workload and GPA impact, including unrestricted electives."},
        {"q": "Do you offer stress management coaching?", "a": "Yes, we address the intense academic pressure in Singaporean institutions with evidence-based stress management and wellbeing strategies."},
        {"q": "Can you help with honours year preparation?", "a": "Yes, we help final-year students prepare for the increased research and writing demands of honours-level coursework and thesis work."},
    ],
    ("study-guidance", "germany"): [
        {"q": "Can you help with the Selbststudium culture?", "a": "Yes, German universities expect significant self-study. We help you develop the self-regulation and independent learning skills required for success."},
        {"q": "Do you support international students in Germany?", "a": "Absolutely. We help international students navigate the German academic system, including understanding Studienordnung and Prüfungsordnung."},
        {"q": "Can you help with Klausur preparation?", "a": "Yes, we provide targeted coaching for German university examinations, including strategies for oral exams (mündliche Prüfungen) and written exams (Klausuren)."},
        {"q": "Do you support Studienkolleg students?", "a": "Yes, we help Studienkolleg students prepare for the Feststellungsprüfung and develop the academic skills needed for university entry."},
        {"q": "Can you help with academic German alongside English studies?", "a": "We primarily coach in English but help students manage the dual challenge of studying in both German and English-taught programmes."},
    ],
}

# ─── UNIQUE META TITLES AND DESCRIPTIONS ──────────────────────────────────────
UNIQUE_META = {
    ("assignment-help", "uk"): ("Assignment Help UK — Expert Writers | From £8/page | Academic Wizard", "Get expert assignment help in the UK from PhD-qualified writers. Aligned with Russell Group standards, Cite Them Right Harvard, HNC/HND support. From £8/page."),
    ("assignment-help", "usa"): ("Assignment Help USA — College & University Support | From $6/page", "Professional assignment help for US college students. APA 7th, MLA 9th, GPA-focused guidance from subject-matter experts. From $6/page."),
    ("assignment-help", "australia"): ("Assignment Help Australia — HD-Grade Support | From AUD $15 | Academic Wizard", "Expert assignment help for Australian university students. HD/D/C grading, AQF-aligned, Go8 experience. From AUD $15/page."),
    ("assignment-help", "canada"): ("Assignment Help Canada — University Support | From CAD $14/page", "Professional assignment guidance for Canadian university students. APA, MLA, Chicago formatting. Tri-Agency integrity compliant. From CAD $14/page."),
    ("assignment-help", "india"): ("Assignment Help India — Expert Guidance | From ₹600/page", "Top-rated assignment help for Indian university students. UGC-aligned, IIT/IIM expertise, CGPA-focused support. From ₹600/page."),
    ("assignment-help", "ireland"): ("Assignment Help Ireland — NFQ-Aligned Support | From €9/page", "Expert assignment help for Irish university students. NFQ framework, Cite Them Right Harvard, TCD/UCD expertise. From €9/page."),
    ("assignment-help", "singapore"): ("Assignment Help Singapore — NUS & NTU Experts | From SGD $14/page", "Professional assignment support for Singapore university students. NUS, NTU, SMU expertise. Bell-curve aware guidance. From SGD $14/page."),
    ("assignment-help", "germany"): ("Assignment Help Germany — Hausarbeit & Academic Support | From €9/page", "Expert assignment guidance for German university students. Wissenschaftliches Arbeiten, ECTS-aligned, Bologna Process compliant. From €9/page."),

    ("essay-help", "uk"): ("Essay Help UK — Critical Analysis Experts | From £8/page", "Professional essay writing guidance for UK university students. Russell Group standards, MHRA/Harvard referencing, A-Level to PhD support."),
    ("essay-help", "usa"): ("Essay Help USA — Thesis-Driven Writing Support | From $6/page", "Expert essay guidance for American college students. AP, honors, and graduate-level support. APA/MLA formatting. From $6/page."),
    ("essay-help", "australia"): ("Essay Help Australia — HD-Level Writing Support | From AUD $15/page", "Professional essay guidance for Australian university students. HD-grade targeting, reflective essays, Go8 experience. From AUD $15."),
    ("essay-help", "canada"): ("Essay Help Canada — University Writing Guidance | From CAD $14/page", "Expert essay support for Canadian university students. Comparative analysis, Canadian English, bilingual formatting. From CAD $14."),
    ("essay-help", "india"): ("Essay Help India — Academic Writing Excellence | From ₹600/page", "Professional essay guidance for Indian university and competitive exam students. JNU, DU, NLU expertise. From ₹600/page."),
    ("essay-help", "ireland"): ("Essay Help Ireland — NFQ Level 8 Support | From €9/page", "Expert essay writing guidance for Irish university students. TCD, UCD, DCU standards. Cite Them Right Harvard. From €9/page."),
    ("essay-help", "singapore"): ("Essay Help Singapore — Analytical Writing Experts | From SGD $14/page", "Professional essay guidance for Singapore university students. NUS, NTU, SMU analytical depth standards. From SGD $14/page."),
    ("essay-help", "germany"): ("Essay Help Germany — Hausarbeit & Academic Essays | From €9/page", "Expert essay guidance for German university students. Wissenschaftliches Arbeiten, Exposé support, ECTS-aligned. From €9/page."),

    ("dissertation-help", "uk"): ("Dissertation Help UK — PhD & Master's Support | From £8/page", "Expert dissertation guidance for UK students. Viva preparation, ethics applications, SPSS/NVivo support. Russell Group expertise."),
    ("dissertation-help", "usa"): ("Dissertation Help USA — Doctoral & Master's Guidance | From $6/page", "Professional dissertation support for US doctoral students. IRB applications, committee prep, EdD/PhD expertise. From $6/page."),
    ("dissertation-help", "australia"): ("Dissertation Help Australia — Honours & PhD Support | From AUD $15/page", "Expert dissertation guidance for Australian students. Honours to PhD, Go8 experience, systematic review support. From AUD $15."),
    ("dissertation-help", "canada"): ("Dissertation Help Canada — Thesis & Research Support | From CAD $14/page", "Professional dissertation support for Canadian students. TCPS 2 ethics, comprehensive exam prep, mixed-methods expertise."),
    ("dissertation-help", "india"): ("Dissertation Help India — PhD & M.Phil Guidance | From ₹600/page", "Expert dissertation support for Indian university students. UGC compliant, Shodhganga formatting, synopsis preparation. From ₹600."),
    ("dissertation-help", "ireland"): ("Dissertation Help Ireland — Research Master's & PhD | From €9/page", "Professional dissertation guidance for Irish university students. Structured PhD support, NFQ Level 9-10, IRC/SFI compliance."),
    ("dissertation-help", "singapore"): ("Dissertation Help Singapore — NUS & NTU PhD Support | From SGD $14/page", "Expert dissertation guidance for Singapore university students. Qualifying exam prep, publication-based thesis support."),
    ("dissertation-help", "germany"): ("Dissertation Help Germany — Doktorarbeit & Abschlussarbeit | From €9/page", "Expert dissertation support for German university students. Doktorarbeit, kumulative Dissertation, Rigorosum preparation."),

    ("literature-review", "uk"): ("Literature Review Help UK — Systematic & Thematic Reviews | From £8/page", "Expert literature review support for UK students. PRISMA-compliant systematic reviews, thematic synthesis, gap identification."),
    ("literature-review", "usa"): ("Literature Review Help USA — Comprehensive Research Support | From $6/page", "Professional literature review guidance for US students. Theoretical frameworks, annotated bibliographies, gap analysis."),
    ("literature-review", "australia"): ("Literature Review Help Australia — Evidence-Based Reviews | From AUD $15/page", "Expert literature review support for Australian students. Scoping reviews, Indigenous methodologies, Go8 standards."),
    ("literature-review", "canada"): ("Literature Review Help Canada — Integrative & Systematic | From CAD $14/page", "Professional literature review guidance for Canadian students. Integrative reviews, TCPS 2 aligned, bilingual searches."),
    ("literature-review", "india"): ("Literature Review Help India — Scopus & UGC-CARE Prep | From ₹600/page", "Expert literature review support for Indian PhD students. Shodhganga, Indian Citation Index, journal publication prep."),
    ("literature-review", "ireland"): ("Literature Review Help Ireland — Critical Synthesis | From €9/page", "Professional literature review guidance for Irish students. RCSI/UCD healthcare reviews, HSE policy integration."),
    ("literature-review", "singapore"): ("Literature Review Help Singapore — Comprehensive & Rigorous | From SGD $14/page", "Expert literature review support for Singapore students. NUS/NTU standards, cross-disciplinary reviews, ASEAN research."),
    ("literature-review", "germany"): ("Literature Review Help Germany — Forschungsstand & Theorie | From €9/page", "Expert literature review support for German students. Forschungsstand, Fachliteratur searches, Deutsche Nationalbibliothek."),

    ("research-paper-help", "uk"): ("Research Paper Help UK — Journal & Conference Support | From £8/page", "Expert research paper guidance for UK academics. Mixed-methods, peer review response, conference paper preparation."),
    ("research-paper-help", "usa"): ("Research Paper Help USA — NSF & Academic Publishing | From $6/page", "Professional research paper support for US students and researchers. IRB-compliant methodology, STEM and humanities expertise."),
    ("research-paper-help", "australia"): ("Research Paper Help Australia — ERA-Ranked Journals | From AUD $15/page", "Expert research paper guidance for Australian academics. NHMRC compliance, CONSORT/STROBE checklists, environmental research."),
    ("research-paper-help", "canada"): ("Research Paper Help Canada — Tri-Agency Publishing | From CAD $14/page", "Professional research paper support for Canadian researchers. SSHRC/NSERC compliance, Indigenous methodologies, policy research."),
    ("research-paper-help", "india"): ("Research Paper Help India — UGC-CARE & Scopus | From ₹600/page", "Expert research paper guidance for Indian academics. IEEE/ACM formats, UGC-CARE journal submission, conference presentations."),
    ("research-paper-help", "ireland"): ("Research Paper Help Ireland — IRC & SFI Compliance | From €9/page", "Professional research paper support for Irish researchers. IRC-funded outputs, GDPR-compliant methodology, clinical research."),
    ("research-paper-help", "singapore"): ("Research Paper Help Singapore — High-Impact Journals | From SGD $14/page", "Expert research paper guidance for Singapore researchers. A*STAR, MOE/NRF grant compliance, Q1/Q2 journal targeting."),
    ("research-paper-help", "germany"): ("Research Paper Help Germany — DFG & Open Access | From €9/page", "Expert research paper support for German researchers. DFG compliance, Sammelband contributions, open-access publishing."),

    ("editing-proofreading", "uk"): ("Editing & Proofreading UK — British English Experts | From £8/page", "Professional editing and proofreading for UK students. British English, OSCOLA, Track Changes, Turnitin reports included."),
    ("editing-proofreading", "usa"): ("Editing & Proofreading USA — American English Standards | From $6/page", "Expert editing and proofreading for US students. American English, journal manuscripts, grant proposals, APA/MLA."),
    ("editing-proofreading", "australia"): ("Editing & Proofreading Australia — Australian English | From AUD $15/page", "Professional editing for Australian students. Macquarie Dictionary standard, TEQSA compliance, Honours thesis editing."),
    ("editing-proofreading", "canada"): ("Editing & Proofreading Canada — Canadian English | From CAD $14/page", "Expert editing for Canadian students. Canadian Oxford standard, bilingual formatting, thesis editing, certificate provided."),
    ("editing-proofreading", "india"): ("Editing & Proofreading India — ESL Academic Support | From ₹600/page", "Professional editing for Indian students. ESL improvement, UGC-CARE journal formatting, Turnitin reports, IEEE/ACM."),
    ("editing-proofreading", "ireland"): ("Editing & Proofreading Ireland — GDPR-Compliant | From €9/page", "Expert editing for Irish students. QQI-accredited submissions, GDPR-compliant handling, Cite Them Right Harvard checks."),
    ("editing-proofreading", "singapore"): ("Editing & Proofreading Singapore — Academic Excellence | From SGD $14/page", "Professional editing for Singapore students. NUS/NTU standards, engineering papers, two-stage quality assurance process."),
    ("editing-proofreading", "germany"): ("Editing & Proofreading Germany — Native-Level English | From €9/page", "Expert English editing for German academics. German-to-English interference correction, Springer/Elsevier formatting, Lektorat."),

    ("study-guidance", "uk"): ("Study Guidance UK — Academic Coaching | From £8/session", "Expert study coaching for UK university students. Exam revision strategies, independent learning skills, learning difference support."),
    ("study-guidance", "usa"): ("Study Guidance USA — GPA & Exam Coaching | From $6/session", "Professional study coaching for US college students. GPA management, test anxiety, pre-med/pre-law preparation strategies."),
    ("study-guidance", "australia"): ("Study Guidance Australia — University Coaching | From AUD $15/session", "Expert study coaching for Australian students. TAFE-to-uni transition, assignment cluster management, international student support."),
    ("study-guidance", "canada"): ("Study Guidance Canada — Academic Success Coaching | From CAD $14/session", "Professional study coaching for Canadian students. Co-op preparation, first-generation student support, bilingual strategies."),
    ("study-guidance", "india"): ("Study Guidance India — Exam & Competitive Prep | From ₹600/session", "Expert study coaching for Indian students. Competitive exam balance, semester preparation, IGNOU support, technical subjects."),
    ("study-guidance", "ireland"): ("Study Guidance Ireland — Leaving Cert to University | From €9/session", "Professional study coaching for Irish students. Leaving Cert transition, CAO points, mature student support, Springboard+."),
    ("study-guidance", "singapore"): ("Study Guidance Singapore — Bell-Curve Strategies | From SGD $14/session", "Expert study coaching for Singapore students. Bell-curve grading strategies, poly-to-uni transition, stress management."),
    ("study-guidance", "germany"): ("Study Guidance Germany — Selbststudium Coaching | From €9/session", "Professional study coaching for German university students. Selbststudium, Klausur preparation, Studienkolleg support."),
}


def main():
    with open(FILE_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    changes_made = 0

    # For each service+country combo, find the faqs block and replace it
    for (service, country), faqs in UNIQUE_FAQS.items():
        # Build the new FAQ string
        faq_entries = []
        for faq in faqs:
            q_escaped = faq['q'].replace('"', '\\"')
            a_escaped = faq['a'].replace('"', '\\"')
            faq_entries.append(f'                    {{ question: "{q_escaped}", answer: "{a_escaped}" }}')
        new_faqs_str = ",\n".join(faq_entries)
        new_faqs_block = f"faqs: [\n{new_faqs_str}\n                ]"

        # Find the country entry by looking for slug pattern
        # We need to find the faqs block for this specific country within this specific service
        # Strategy: find the service section, then within it find the country slug, then find its faqs block
        
        # Find the service block start
        service_pattern = rf"slug:\s*'{service}'"
        service_matches = list(re.finditer(service_pattern, content))
        
        if not service_matches:
            print(f"  ⚠️ Service '{service}' not found")
            continue
        
        # The first match is the top-level service slug
        service_start = service_matches[0].start()
        
        # Find the country slug within this service's countries array
        country_pattern = rf"slug:\s*'{country}'"
        country_matches = list(re.finditer(country_pattern, content[service_start:]))
        
        country_found = False
        for cm in country_matches:
            country_pos = service_start + cm.start()
            
            # Make sure this is within the correct service (not another service's country)
            # Find if there's another top-level service slug between service_start and country_pos
            between_text = content[service_start + len(service):country_pos]
            
            # Check this is the right service by verifying no other top-level service slug appears
            # Top-level service slugs are at the beginning of a block
            # Simple heuristic: the country slug we found should be within the same service block
            
            # Find the faqs block for this country
            # Look forward from country_pos for the faqs: [ ... ] block
            remaining = content[country_pos:]
            
            # Find the faqs block - it starts with 'faqs: [' and ends with matching ']'
            faqs_match = re.search(r'faqs:\s*\[', remaining)
            if not faqs_match:
                continue
            
            faqs_start = country_pos + faqs_match.start()
            
            # Find the matching closing bracket
            bracket_count = 0
            faqs_content_start = faqs_start + faqs_match.end() - faqs_match.start()
            i = faqs_content_start
            # We need to count from the opening bracket
            open_pos = content.index('[', faqs_start)
            bracket_count = 1
            i = open_pos + 1
            while i < len(content) and bracket_count > 0:
                if content[i] == '[':
                    bracket_count += 1
                elif content[i] == ']':
                    bracket_count -= 1
                i += 1
            
            faqs_end = i  # position after the closing ]
            
            # Replace the faqs block
            old_faqs = content[faqs_start:faqs_end]
            content = content[:faqs_start] + new_faqs_block + content[faqs_end:]
            changes_made += 1
            country_found = True
            break
        
        if not country_found:
            print(f"  ⚠️ Country '{country}' not found in service '{service}'")

    # Now inject unique metaTitle and metaDescription for each country
    for (service, country), (meta_title, meta_desc) in UNIQUE_META.items():
        # Find the country entry
        service_pattern = rf"slug:\s*'{service}'"
        service_matches = list(re.finditer(service_pattern, content))
        
        if not service_matches:
            continue
        
        service_start = service_matches[0].start()
        
        country_pattern = rf"slug:\s*'{country}'"
        country_matches = list(re.finditer(country_pattern, content[service_start:]))
        
        for cm in country_matches:
            country_pos = service_start + cm.start()
            
            # Check if metaTitle already exists for this country
            # Look at the next ~200 chars after the slug
            snippet = content[country_pos:country_pos + 500]
            
            if 'metaTitle:' in snippet:
                # Replace existing metaTitle
                mt_match = re.search(r'metaTitle:\s*"[^"]*"', snippet)
                if mt_match:
                    old_mt = snippet[mt_match.start():mt_match.end()]
                    new_mt = f'metaTitle: "{meta_title}"'
                    abs_start = country_pos + mt_match.start()
                    abs_end = country_pos + mt_match.end()
                    content = content[:abs_start] + new_mt + content[abs_end:]
                    changes_made += 1
            else:
                # Insert metaTitle after the flag emoji
                flag_match = re.search(r'flag:\s*"[^"]*",?\s*', snippet)
                if flag_match:
                    insert_pos = country_pos + flag_match.end()
                    insert_text = f'metaTitle: "{meta_title}", metaDescription: "{meta_desc}", '
                    content = content[:insert_pos] + insert_text + content[insert_pos:]
                    changes_made += 1
                    continue
            
            # Check if metaDescription exists
            snippet = content[country_pos:country_pos + 800]
            if 'metaDescription:' in snippet:
                md_match = re.search(r'metaDescription:\s*"[^"]*"', snippet)
                if md_match:
                    old_md = snippet[md_match.start():md_match.end()]
                    new_md = f'metaDescription: "{meta_desc}"'
                    abs_start = country_pos + md_match.start()
                    abs_end = country_pos + md_match.end()
                    content = content[:abs_start] + new_md + content[abs_end:]
                    changes_made += 1
            
            break

    with open(FILE_PATH, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✅ Made {changes_made} replacements in services.js")
    print("   - Unique FAQs for each country variant")
    print("   - Unique metaTitle and metaDescription for each country variant")


if __name__ == "__main__":
    main()
