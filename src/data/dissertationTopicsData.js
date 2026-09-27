/**
 * Academic Wizard - Curated 2026/2027 Dissertation & Thesis Topics Database
 * Covers 10 core academic disciplines with publication-grade research topics,
 * aims, research questions, methodologies, and degree levels.
 */

export const dissertationTopicsData = {
    'nursing-topics': [
        {
            id: 'nurs-1',
            title: 'Evaluating the Efficacy of Nurse-Led Digital Remote Monitoring in Managing Type 2 Diabetes in Post-Pandemic Primary Care',
            aim: 'To assess clinical glycemic outcomes, patient adherence, and nurse workload when implementing synchronous digital continuous glucose monitoring in community clinics.',
            researchQuestions: [
                'How does nurse-led remote telehealth monitoring influence HbA1c levels compared to traditional quarterly face-to-face consultations?',
                'What are the primary barriers to technology adoption among geriatric patients managed by district nurses?',
                'What structural training and staffing ratios are required to prevent burnout among telehealth nurse practitioners?'
            ],
            methodology: 'Mixed Methods (Retrospective Cohort Study + Qualitative Nurse Interviews)',
            level: "Master's / MSc",
            tags: ['Chronic Disease', 'Telehealth', 'Primary Care']
        },
        {
            id: 'nurs-2',
            title: 'The Impact of 12-Hour Critical Care Shift Patterns on Registered Nurse Cognitive Fatigue, Compassion Fatigue, and Medication Error Rates',
            aim: 'To investigate the neuro-cognitive fatigue thresholds of ICU and emergency department nurses across consecutive rotational night shifts and their correlation with near-miss medication incidents.',
            researchQuestions: [
                'Is there a statistically significant correlation between the 3rd consecutive 12-hour shift and reported clinical errors in acute trauma units?',
                'How do diurnal disruption and circadian misalignment impact subjective feelings of depersonalization and compassion fatigue?',
                'What institutional micro-break and handover strategies have proven most protective in mitigating clinical vigilance decrement?'
            ],
            methodology: 'Quantitative Cross-Sectional Survey + Incident Log Analysis',
            level: "Master's / MSc",
            tags: ['ICU Nursing', 'Patient Safety', 'Workplace Well-being']
        },
        {
            id: 'nurs-3',
            title: 'Perceptions of Culturally Competent Palliative Care Delivery Among Ethnic Minority Cancer Patients: A Phenomenological Exploration',
            aim: 'To explore how cultural beliefs, spiritual values, and institutional language barriers shape end-of-life care expectations and hospice utilization among minority populations.',
            researchQuestions: [
                'How do diverse religious doctrines surrounding suffering and natural death influence patient and family willingness to accept opioid pain regimens?',
                'What specific communicative competencies do hospice nurses identify as essential when delivering bad news across language barriers?',
                'How can healthcare institutions co-design palliative protocols with local multicultural community leaders?'
            ],
            methodology: 'Qualitative Phenomenological Study (Semi-Structured Patient & Family Interviews)',
            level: 'PhD',
            tags: ['Palliative Care', 'Cultural Competence', 'Oncology']
        },
        {
            id: 'nurs-4',
            title: 'Transition Shock Among Newly Qualified Registered Nurses in Acute Surgical Wards: Evaluating Preceptorship Program Interventions',
            aim: 'To examine the psychological trajectory of new nursing graduates during their initial six months of ward placement and identify high-impact retention frameworks.',
            researchQuestions: [
                'What factors contribute most significantly to acute anxiety and clinical self-doubt during the transition from student to staff nurse?',
                'How does formal one-to-one mentorship differ in 12-month retention rates compared to ad-hoc shadowing models?',
                'What role do structured debriefing circles play in reducing emotional exhaustion in early-career surgical nursing?'
            ],
            methodology: 'Longitudinal Mixed Methods Study',
            level: 'Undergraduate / BSN',
            tags: ['Nurse Retention', 'Education & Preceptorship', 'Surgical Care']
        },
        {
            id: 'nurs-5',
            title: 'Integrating Generative AI and Clinical Decision Support Systems in Emergency Triage: A Human-in-the-Loop Nursing Perspective',
            aim: 'To evaluate how algorithmic risk-scoring recommendations affect nurse diagnostic decision-making, overtriage, and undertriage rates in busy trauma centres.',
            researchQuestions: [
                'To what extent do emergency nurses demonstrate automation bias or algorithmic aversion when AI triage scores conflict with clinical intuition?',
                'How does AI decision support impact triage dwell times and door-to-needle metrics for acute coronary syndrome?',
                'What ethical and medico-legal concerns do nursing leadership express regarding automated acuity stratification?'
            ],
            methodology: 'Experimental Simulation Study + Focus Groups',
            level: 'PhD',
            tags: ['AI in Healthcare', 'Emergency Nursing', 'Clinical Decision Support']
        },
        {
            id: 'nurs-6',
            title: 'Effectiveness of Non-Pharmacological Interventions in Reducing Delirium Incidence in Elderly Patients Within Intensive Care Units',
            aim: 'To compare the efficacy of multi-component delirium bundles (early mobility, cognitive stimulation, sleep hygiene) against standard protocolized sedation.',
            researchQuestions: [
                'Does the consistent implementation of the ABCDEF bundle reduce ICU delirium duration in mechanically ventilated geriatric patients?',
                'What nursing compliance barriers inhibit regular circadian light-dark cycle management in emergency wards?',
                'What is the long-term cognitive outcome at 90-day discharge for patients who avoided delirium episodes?'
            ],
            methodology: 'Systematic Review & Meta-Analysis / Quasi-Experimental Study',
            level: "Master's / MSc",
            tags: ['Geriatric Nursing', 'Critical Care', 'Delirium Prevention']
        },
        {
            id: 'nurs-7',
            title: 'Assessing Mental Health Literacy and Stigma Among General Practice Pediatric Nurses Managing Adolescent Self-Harm Presentations',
            aim: 'To identify clinical readiness, diagnostic confidence, and systemic referral bottlenecks encountered by non-psychiatric pediatric nurses.',
            researchQuestions: [
                'How confident are acute pediatric nurses in conducting primary suicide risk triage without immediate CAMHS support?',
                'What implicit biases exist among medical ward staff regarding adolescent borderline personality and self-harm behavior?',
                'How does trauma-informed clinical simulation training alter subsequent patient therapeutic engagement?'
            ],
            methodology: 'Mixed Methods (Pre-and-Post Training Intervention Assessment)',
            level: "Master's / MSc",
            tags: ['Pediatric Nursing', 'Mental Health', 'Adolescent Care']
        },
        {
            id: 'nurs-8',
            title: 'Evaluating Antimicrobial Stewardship Knowledge, Attitude, and Practice (KAP) Among Community Health Nurse Prescribers',
            aim: 'To quantify adherence to antibiotic stewardship protocols and explore non-clinical pressures influencing inappropriate prescribing decisions.',
            researchQuestions: [
                'What proportion of independent nurse prescribers in urgent care clinics adhere strictly to NICE or CDC respiratory tract guidelines?',
                'How do patient expectation and satisfaction metrics influence prescription issuance in low-acuity presentations?',
                'What educational interventions produce sustained reductions in broad-spectrum antibiotic over-utilization?'
            ],
            methodology: 'Quantitative Cross-Sectional Survey + Prescription Audit',
            level: 'Undergraduate / BSN',
            tags: ['Infection Control', 'Antimicrobial Stewardship', 'Community Nursing']
        },
        {
            id: 'nurs-9',
            title: 'The Role of Advanced Clinical Practitioners in Alleviating Elective Surgery Backlogs: An Institutional Case Study',
            aim: 'To measure patient throughput, clinical complication rates, and cost-effectiveness of nurse-led pre-operative assessment and minor surgical clinics.',
            researchQuestions: [
                'How do complication and cancellation rates in nurse-led day-case units compare with junior surgical trainee clinics?',
                'What are patient satisfaction scores concerning communication clarity and holistic care when treated by ACPs?',
                'What legal, scope-of-practice, and governance boundaries challenge advanced nursing autonomy?'
            ],
            methodology: 'Comparative Institutional Case Study & Healthcare Economics Analysis',
            level: 'PhD',
            tags: ['Advanced Practice', 'Healthcare Management', 'Surgical Throughput']
        },
        {
            id: 'nurs-10',
            title: 'Postpartum Depression Screening Protocols in Postnatal Home Visits: Overcoming Racial Disparities in Maternal Care',
            aim: 'To examine whether standardized Edinburgh Postnatal Depression Scale (EPDS) administration exhibits diagnostic sensitivity variations across culturally diverse mothers.',
            researchQuestions: [
                'How do language nuances and somatic symptom expression affect maternal depression identification in immigrant mothers?',
                'What barriers do community health visitors identify when initiating conversations about maternal bonding difficulties?',
                'What community-based peer support models have proven most effective in bridging follow-up care gaps?'
            ],
            methodology: 'Qualitative Semi-Structured In-Depth Interviews',
            level: "Master's / MSc",
            tags: ['Maternal Health', 'Health Equity', 'Community Nursing']
        }
    ],

    'business-topics': [
        {
            id: 'bus-1',
            title: 'The Impact of Hybrid Workplace Models on Organizational Innovation, Tacit Knowledge Sharing, and Employee Engagement in Tech Firms',
            aim: 'To investigate whether long-term decentralized working arrangements diminish informal creative collisions and tacit knowledge transfer in R&D organizations.',
            researchQuestions: [
                'How does asynchronous collaboration affect cross-departmental product innovation in enterprise software teams?',
                'What organizational mechanisms effectively preserve company culture and psychological safety in fully remote workforces?',
                'Does employee turnover intent vary significantly between forced return-to-office mandates and structured hybrid agreements?'
            ],
            methodology: 'Quantitative Structural Equation Modeling (PLS-SEM) + Qualitative Case Studies',
            level: "Master's / MBA",
            tags: ['Hybrid Work', 'Knowledge Management', 'Innovation']
        },
        {
            id: 'bus-2',
            title: 'ESG Decoupling and Corporate Greenwashing: Assessing the Valuation Disconnect in European and UK Listed Corporations',
            aim: 'To analyze whether non-financial ESG score disclosures correlate with tangible carbon emission abatements or merely serve as reputational hedge mechanisms.',
            researchQuestions: [
                'Do firms exhibiting high ESG disclosures consistently demonstrate lower cost of capital, or does the market penalize greenwashing risk?',
                'How will the EU Corporate Sustainability Due Diligence Directive (CSDDD) reshape supply chain accountability for multinational retailers?',
                'What is the empirical relationship between board diversity quotas and environmental sustainability audit compliance?'
            ],
            methodology: 'Panel Data Econometric Regression (Stata / R)',
            level: 'PhD',
            tags: ['ESG', 'Corporate Governance', 'Financial Valuation']
        },
        {
            id: 'bus-3',
            title: 'Building Resilient Global Supply Chains Post-Geopolitical Disruptions: Nearshoring vs. Dual-Sourcing Strategies in Manufacturing',
            aim: 'To examine the financial and operational trade-offs of transitioning from lean, single-origin Asian manufacturing toward diversified nearshoring architectures.',
            researchQuestions: [
                'How do total cost of ownership models shift when accounting for geopolitical tariffs, freight volatility, and lead-time insurance?',
                'What role do predictive AI inventory modeling systems play in preventing the bullwhip effect during unexpected supply disruptions?',
                'What are the primary operational bottlenecks European manufacturers face when attempting nearshoring to Eastern Europe or North Africa?'
            ],
            methodology: 'Multi-Case Comparative Analysis & Value-Stream Mapping',
            level: "Master's / MBA",
            tags: ['Supply Chain', 'Operations Management', 'Nearshoring']
        },
        {
            id: 'bus-4',
            title: 'Strategic Implementation of Generative AI in Customer Relationship Management (CRM): Balancing Automation with Brand Trust',
            aim: 'To evaluate customer sentiment, churn rates, and operational efficiency when automating omnichannel customer support using LLM-powered autonomous agents.',
            researchQuestions: [
                'At what point does customer awareness of AI interaction negatively impact brand loyalty and Net Promoter Score (NPS)?',
                'What escalation protocols best preserve high-value client retention when automated chatbots fail complex problem-resolution?',
                'What organizational change management hurdles impede front-line sales teams from adopting AI-driven lead scoring systems?'
            ],
            methodology: 'Mixed Methods (A/B Sentiment Testing + Executive Interviews)',
            level: "Master's / MBA",
            tags: ['Digital Transformation', 'Customer Experience', 'AI in Business']
        },
        {
            id: 'bus-5',
            title: 'The Determinants of Unicorn Startup Survival: Assessing Capital Efficiency vs. Growth-At-All-Costs in High-Interest Rate Macroenvironments',
            aim: 'To model the survivability and IPO valuation trajectories of venture-backed technology companies during global monetary tightening cycles.',
            researchQuestions: [
                'Which operational metrics (Rule of 40, burn multiple, customer acquisition cost payback) best predict 3-year survival during funding downturns?',
                'How do founder-led corporate governance structures influence capital allocation discipline compared to independent board-governed firms?',
                'What exit strategies (secondary sales, strategic acquisitions, down-rounds) deliver optimal recovery for late-stage venture funds?'
            ],
            methodology: 'Survival Analysis (Cox Proportional Hazards Model) on Crunchbase Data',
            level: 'PhD',
            tags: ['Venture Capital', 'Entrepreneurship', 'Corporate Finance']
        },
        {
            id: 'bus-6',
            title: 'Corporate Turnaround Strategies in Distressed Retail: Omnichannel Integration as a Catalyst for Brick-and-Mortar Survival',
            aim: 'To explore how legacy departmental stores restructure their physical footprint into experiential fulfillment hubs to compete with pure-play e-commerce.',
            researchQuestions: [
                'How does in-store click-and-collect fulfillment influence basket size and return merchandise logistics?',
                'What financial restructuring frameworks (debt-for-equity swaps, sale-and-leaseback) yield sustainable long-term cash flow stabilization?',
                'How can legacy retail brands reposition their brand identity to capture Gen-Z purchasing intent without alienating existing core demographics?'
            ],
            methodology: 'Qualitative Embedded Case Study Method',
            level: 'Undergraduate / BBA',
            tags: ['Retail Strategy', 'Omnichannel', 'Turnaround Management']
        }
    ],

    'law-topics': [
        {
            id: 'law-1',
            title: 'Copyright Infringement, Fair Use, and Algorithmic Authorship: Regulating Generative Artificial Intelligence Under UK and EU Law',
            aim: 'To critically evaluate whether existing intellectual property doctrines of substantial taking and transformative use adequately address large-scale model pre-training on copyrighted datasets.',
            researchQuestions: [
                'Can training an artificial neural network on unlicensed creative works constitute infringement under the CDPA 1988 or the EU DSM Directive?',
                'Does the human prompter satisfy legal requirements for authorship when directing sophisticated iterative generative pipelines?',
                'How will statutory collective licensing schemes balance technological innovation with creator remuneration?'
            ],
            methodology: 'Doctrinal Legal Research & Comparative Jurisprudential Analysis',
            level: 'PhD',
            tags: ['Intellectual Property', 'AI & Technology Law', 'Copyright']
        },
        {
            id: 'law-2',
            title: 'Algorithmic Discrimination in Criminal Justice: Re-evaluating Due Process and Judicial Transparency in Predictive Policing and Bail Scoring',
            aim: 'To investigate the constitutional and human rights implications of proprietary automated risk-assessment instruments under Article 6 of the ECHR and US 14th Amendment jurisprudence.',
            researchQuestions: [
                'How does the trade-secret protection of algorithmic weights conflict with a defendant’s fundamental right to contest adverse evidence?',
                'What empirical evidence demonstrates racial disparities embedded in recidivism prediction algorithms like COMPAS?',
                'What statutory transparency standards should be mandated prior to deploying predictive policing in public surveillance?'
            ],
            methodology: 'Socio-Legal Empirical Analysis + Doctrinal Constitutional Review',
            level: "Master's / LLM",
            tags: ['Criminal Law', 'Human Rights', 'Algorithmic Justice']
        },
        {
            id: 'law-3',
            title: 'Corporate Liability for Transnational Environmental Degradation: Piercing the Corporate Veil in Climate Tort Litigation',
            aim: 'To analyze how common law jurisdictions are evolving parent-company duty of care doctrines following pivotal rulings such as Vedanta and Okpabi in English tort law.',
            researchQuestions: [
                'Under what circumstances does parent-company group policy create an enforceable direct duty of care toward overseas host communities?',
                'How do forum non conveniens doctrines continue to obstruct access to justice for victims of environmental disasters in the Global South?',
                'Can international ecocide frameworks be incorporated into customary international law to hold corporate executives criminally accountable?'
            ],
            methodology: 'Comparative Case Law Analysis (UK, EU, Commonwealth)',
            level: "Master's / LLM",
            tags: ['Environmental Law', 'Corporate Tort', 'International Human Rights']
        },
        {
            id: 'law-4',
            title: 'The Legal Status of Central Bank Digital Currencies (CBDCs): Monetary Sovereignty, Privacy Rights, and Cross-Border Interoperability',
            aim: 'To examine the financial regulatory restructuring required to establish retail CBDCs while safeguarding citizen privacy under GDPR and AML/CFT regimes.',
            researchQuestions: [
                'Does programmable digital legal tender infringe upon privacy rights under Article 8 of the ECHR?',
                'How will cross-border wholesale CBDC transactions resolve conflicting conflict-of-laws and jurisdiction dilemmas?',
                'What systemic changes to commercial banking depositor protection laws are necessary if retail deposits migrate directly to central banks?'
            ],
            methodology: 'Doctrinal Banking & Financial Regulation Analysis',
            level: "Master's / LLM",
            tags: ['Banking Law', 'Fintech & Cryptocurrency', 'Privacy']
        },
        {
            id: 'law-5',
            title: 'Autonomous Weapons Systems and the Principle of Proportionality Under International Humanitarian Law (IHL)',
            aim: 'To evaluate whether fully lethal autonomous weapon systems (LAWS) can satisfy the Rome Statute and Geneva Conventions regarding command responsibility and distinction.',
            researchQuestions: [
                'Can an autonomous algorithmic targeting system make genuine contextual determinations of military necessity versus collateral harm?',
                'Where does criminal culpability rest when an autonomous weapon commits a war crime: software engineer, military commander, or head of state?',
                'Is a comprehensive multilateral preemptive treaty prohibiting LAWS legally and politically achievable?'
            ],
            methodology: 'Public International Law & IHL Treaty Analysis',
            level: 'PhD',
            tags: ['International Humanitarian Law', 'Armed Conflict', 'Autonomous Systems']
        },
        {
            id: 'law-6',
            title: 'Modernizing Consumer Protection in the Gig Economy: Platform Worker Employment Classification in English Common Law',
            aim: 'To evaluate the post-Uber BV v Aslam trajectory of worker status adjudication and its implications for minimum wage, holiday pay, and collective bargaining rights.',
            researchQuestions: [
                'How effectively have tribunals detected disguised employment relationships within algorithmic dispatch and rating systems?',
                'Does creating an intermediate "dependent contractor" tier provide adequate protection, or does it entrench legal vulnerability?',
                'What reforms to statutory dispute resolution are needed to prevent platforms from circumventing tribunal judgments?'
            ],
            methodology: 'Doctrinal Employment Law Research',
            level: 'Undergraduate / LLB',
            tags: ['Employment Law', 'Gig Economy', 'Contract Law']
        }
    ],

    'psychology-topics': [
        {
            id: 'psych-1',
            title: 'Algorithmic Personalization and Adolescent Body Dysmorphia: The Mediating Role of Social Comparison and Doomscrolling on Short-Form Video Platforms',
            aim: 'To investigate whether exposure to beauty-filter modified short-form videos (TikTok, Instagram Reels) exacerbates body dissatisfaction and eating disorder symptoms in teenagers.',
            researchQuestions: [
                'What is the directional relationship between daily hours spent on algorithmically curated video feeds and validated body dissatisfaction scale scores?',
                'Does upward social comparison mediate the association between viewing fitness-influencer content and subclinical bulimic behaviors?',
                'Can targeted media-literacy psychoeducation inoculate adolescents against algorithmic beauty-norm internalizations?'
            ],
            methodology: 'Quantitative Longitudinal Survey + Structural Equation Modeling (SEM)',
            level: "Master's / MSc",
            tags: ['Clinical Psychology', 'Media Psychology', 'Adolescent Mental Health']
        },
        {
            id: 'psych-2',
            title: 'Virtual Reality Exposure Therapy (VRET) vs. Traditional In Vivo Exposure in Treating Complex Post-Traumatic Stress Disorder (CPTSD)',
            aim: 'To evaluate the therapeutic efficacy, drop-out rates, and autonomic nervous system regulation of immersive multi-sensory virtual reality protocols in combat and interpersonal trauma survivors.',
            researchQuestions: [
                'How does physiological arousal (measured via Galvanic Skin Response and HRV) during VRET sessions correlate with long-term CAPS-5 symptom score reductions?',
                'Are treatment attrition rates significantly lower in VRET cohorts compared to imaginal or in vivo exposure therapies?',
                'What patient-specific factors (e.g. dissociation severity, sensory processing sensitivity) contraindicate VR immersion?'
            ],
            methodology: 'Randomized Controlled Trial (RCT) / Meta-Analytic Synthesis',
            level: 'PhD',
            tags: ['Cognitive Behavioral Therapy', 'VR Therapy', 'Trauma & PTSD']
        },
        {
            id: 'psych-3',
            title: 'Neurodiversity in the Modern Corporate Environment: Overcoming Diagnostic Masking, Sensory Overload, and Executive Dysfunction in Adult ADHD and Autism',
            aim: 'To explore the lived workplace experiences of late-diagnosed neurodivergent professionals and quantify the mental health toll of constant behavioral masking.',
            researchQuestions: [
                'What specific physical office environments (open-plan layouts, fluorescent lighting) contribute most severely to sensory meltdown and burnout in autistic employees?',
                'How does prolonged diagnostic masking correlate with comorbid clinical depression and generalized anxiety scores?',
                'Which organizational workplace accommodations (asynchronous meetings, quiet rooms, job-crafting) produce measurable improvements in productivity and tenure?'
            ],
            methodology: 'Mixed Methods (Thematic Analysis of Qualitative Interviews + Psychometric Assessment)',
            level: "Master's / MSc",
            tags: ['Neurodiversity', 'Occupational Psychology', 'Adult ADHD']
        },
        {
            id: 'psych-4',
            title: 'Cognitive Offloading in the Age of Generative AI: Assessing the Impact of Automated LLM Summaries on Human Long-Term Memory and Critical Reasoning',
            aim: 'To experimentally investigate whether relying on automated AI writing and information synthesis tools induces deep cognitive offloading and impairs conceptual recall.',
            researchQuestions: [
                'Do students who generate summaries via conversational AI perform significantly worse on unannounced 7-day conceptual retention exams than active-reading cohorts?',
                'How does cognitive offloading alter eye-tracking fixation durations and reading depth during complex scholarly text evaluation?',
                'Can metacognitive prompting strategies prevent learners from accepting superficial or hallucinated machine outputs as factual?'
            ],
            methodology: 'Laboratory Experimental Design (Between-Subjects RCT)',
            level: 'PhD',
            tags: ['Cognitive Psychology', 'Memory & Learning', 'AI Interaction']
        },
        {
            id: 'psych-5',
            title: 'Evaluating the Psychological Impact of Eco-Anxiety on Reproductive Decision-Making Among Generation Z Young Adults',
            aim: 'To identify how existential dread concerning climate instability influences life satisfaction, career trajectories, and voluntary childlessness.',
            researchQuestions: [
                'What psychological mechanisms distinguish constructive environmental grief from clinically paralyzing eco-paralysis?',
                'How strongly does perception of governmental climate inaction predict depressive symptoms in young adults aged 18–25?',
                'What active coping interventions (nature therapy, community activism) foster psychological resilience against ecological fatalism?'
            ],
            methodology: 'Quantitative Psychometric Survey + Grounded Theory Qualitative Interviews',
            level: 'Undergraduate / BSc',
            tags: ['Eco-Anxiety', 'Existential Psychology', 'Generation Z']
        },
        {
            id: 'psych-6',
            title: 'Attachment Styles, Fear of Missing Out (FOMO), and Compulsive Smartphone Checking: A Cross-Generational Behavioral Study',
            aim: 'To examine how anxious and avoidant attachment patterns predispose individuals toward compulsive digital notifications checking and sleep disruption.',
            researchQuestions: [
                'Does anxious attachment correlate significantly with high scores on the Fear of Missing Out scale and nightly screen time?',
                'How does nocturnal blue-light exposure mediate the relationship between smartphone addiction and subjective insomnia severity?',
                'Can a 14-day digital detox intervention produce sustained baseline neurochemical dopamine stabilization and reduced anxiety?'
            ],
            methodology: 'Quantitative Correlational & Intervention Study',
            level: 'Undergraduate / BSc',
            tags: ['Attachment Theory', 'Behavioral Addiction', 'Sleep Hygiene']
        }
    ],

    'computer-science-topics': [
        {
            id: 'cs-1',
            title: 'Mitigating Hallucination and Knowledge Drift in Large Language Models via Dynamic Graph-Augmented Retrieval Architectures (GraphRAG)',
            aim: 'To design and benchmark a dynamic knowledge-graph retrieval augmented generation pipeline that enforces factual consistency and verifiable provenance in medical and legal domains.',
            researchQuestions: [
                'How does GraphRAG compare to traditional vector-similarity embeddings in reducing entity-relation hallucination in long-form question answering?',
                'What latency and compute trade-offs are incurred when traversing multi-hop knowledge subgraphs during live inference?',
                'Can continuous real-time graph updates resolve the parametric memory staleness problem without requiring catastrophic retraining?'
            ],
            methodology: 'System Architecture Design & Empirical Benchmarking (Python / PyTorch / Neo4j / LangChain)',
            level: 'PhD',
            tags: ['Artificial Intelligence', 'LLMs', 'Retrieval-Augmented Generation']
        },
        {
            id: 'cs-2',
            title: 'Zero-Trust Cloud Microservice Security: Automated Anomaly Detection and Lateral Movement Prevention Using eBPF Telemetry and Deep Autoencoders',
            aim: 'To implement real-time Linux kernel-level packet and syscall inspection via eBPF to detect zero-day exploit payloads within Kubernetes clusters before container breakout occurs.',
            researchQuestions: [
                'How effectively can deep semi-supervised autoencoders classify malicious lateral movement from high-throughput syscall telemetry with sub-1% false positive rates?',
                'What is the CPU and memory performance overhead of compiling in-kernel eBPF security filters on high-load microservice nodes?',
                'How does kernel-level tracing mitigate container escape vulnerabilities compared to traditional user-space sidecar proxies?'
            ],
            methodology: 'Applied Systems Security Engineering & Benchmarking (Go / C / eBPF / Kubernetes)',
            level: "Master's / MSc",
            tags: ['Cybersecurity', 'Cloud Computing', 'eBPF']
        },
        {
            id: 'cs-3',
            title: 'Privacy-Preserving Federated Learning for Distributed Healthcare Datasets: Addressing Differential Privacy and Poisoning Attacks',
            aim: 'To formulate an adaptive differential privacy noise-injection mechanism that guarantees patient confidentiality while defending against malicious Byzantine gradient attacks.',
            researchQuestions: [
                'What is the optimal epsilon-delta privacy budget that guarantees GDPR compliance without critically degrading multi-center MRI image classification accuracy?',
                'How can federated aggregation algorithms (such as FedAvg or Krum) automatically isolate and discard poisoned model weight updates from compromised hospital edge nodes?',
                'How does non-IID (non-independent and identically distributed) patient data distribution impact global convergence rates across heterogeneous medical centers?'
            ],
            methodology: 'Algorithmic Optimization & Simulated Distributed Network Evaluation',
            level: 'PhD',
            tags: ['Federated Learning', 'Differential Privacy', 'Healthcare AI']
        },
        {
            id: 'cs-4',
            title: 'Quantum Key Distribution (QKD) Protocols vs. Post-Quantum Lattice-Based Cryptography: Energy Efficiency and Latency on Edge IoT Devices',
            aim: 'To compare the hardware performance, handshake latency, and memory footprint of NIST-standardized Kyber/ML-KEM algorithms against hardware-assisted quantum cryptographic channels on low-power microcontrollers.',
            researchQuestions: [
                'Can resource-constrained ARM Cortex-M microcontrollers execute CRYSTALS-Kyber key encapsulation within acceptable battery-life budgets for smart utility sensors?',
                'What vulnerability vectors exist when implementing post-quantum lattice primitives against physical side-channel power-analysis attacks?',
                'What hybrid classical-quantum handshake architecture provides optimal defense against "Harvest Now, Decrypt Later" threat actors?'
            ],
            methodology: 'Embedded Systems Hardware Benchmarking (C / Rust / ARM Testbed)',
            level: "Master's / MSc",
            tags: ['Quantum Computing', 'Cryptography', 'Internet of Things']
        },
        {
            id: 'cs-5',
            title: 'Energy-Efficient Neuromorphic Computing: Spiking Neural Networks (SNNs) for Ultra-Low Power Edge Vision Processing',
            aim: 'To implement and benchmark event-based asynchronous vision pipelines using Spiking Neural Networks on neuromorphic chips compared to conventional Convolutional Neural Networks (CNNs).',
            researchQuestions: [
                'What magnitude of energy consumption reduction is achieved when processing event-camera temporal streams on neuromorphic hardware (e.g. Intel Loihi or SynSense)?',
                'How can surrogate gradient learning algorithms overcome the non-differentiable nature of discrete biological neuron action potentials during training?',
                'What is the classification accuracy trade-off when deploying SNNs for real-time autonomous robotic obstacle avoidance?'
            ],
            methodology: 'Simulation & Hardware Experimentation (Python / snnTorch / Neuromorphic Hardware)',
            level: 'PhD',
            tags: ['Neuromorphic Computing', 'Spiking Neural Networks', 'Edge AI']
        },
        {
            id: 'cs-6',
            title: 'Automated Code Vulnerability Detection via Fine-Tuned Transformer Ensembles and Abstract Syntax Tree (AST) Feature Encodings',
            aim: 'To develop an automated static analysis system combining source-code semantic graph representations with lightweight language models to detect CWE top 25 software security flaws.',
            researchQuestions: [
                'Does augmenting token embeddings with structural AST graph representations reduce false alarms in identifying buffer overflows and SQL injections in C/C++ and JavaScript codebases?',
                'How well do code LLMs generalize to novel, zero-day syntax variations that were absent from their pre-training corpora?',
                'Can automated repair pipelines generate functionally sound patches without introducing secondary architectural regressions?'
            ],
            methodology: 'Machine Learning Model Development & Benchmark Testing against CVE Datasets',
            level: 'Undergraduate / BSc',
            tags: ['Software Engineering', 'Static Analysis', 'AI in Security']
        }
    ],

    'accounting-topics': [
        {
            id: 'acc-1',
            title: 'The Impact of Mandatory Corporate Sustainability Reporting Directives (CSRD) on Earnings Management and Audit Quality in European Listed Entities',
            aim: 'To investigate whether rigorous non-financial ESG compliance requirements restrict real-activity earnings management or incentivize new forms of green narrative manipulation.',
            researchQuestions: [
                'Does compliance with the EU CSRD correlate with higher statutory audit fees and extended audit reporting lag?',
                'Are corporations with high carbon footprints more likely to engage in discretionary accruals management to offset sustainability compliance penalties?',
                'How do the Big Four audit firms maintain audit independence and technical competence when verifying complex scope 3 greenhouse gas calculations?'
            ],
            methodology: 'Quantitative Panel Data Econometrics (EViews / Stata)',
            level: 'PhD',
            tags: ['Audit Quality', 'CSRD & ESG', 'Earnings Management']
        },
        {
            id: 'acc-2',
            title: 'Automating Statutory Financial Audits: The Integration of Generative AI and Process Mining in Continuous Risk Assessment',
            aim: 'To evaluate how Big Four audit practices are transforming traditional periodic sample testing into 100% full-population continuous ledger audits using automated machine learning anomaly detectors.',
            researchQuestions: [
                'How does automated process mining of ERP journals improve the detection of fraudulent revenue recognition patterns compared to random statistical sampling?',
                'What liabilities and legal risks do external auditors face when relying on autonomous AI ledger verification algorithms under ISA (UK) 315 standards?',
                'What new digital audit skills and certifications are required to prevent cognitive deference to algorithmic risk assessments?'
            ],
            methodology: 'Qualitative Semi-Structured Senior Auditor Interviews + Quantitative Simulation Audit',
            level: "Master's / MSc",
            tags: ['Digital Audit', 'Process Mining', 'Fraud Detection']
        },
        {
            id: 'acc-3',
            title: 'Cryptocurrency Taxation and Fair Value Accounting Under IFRS and US GAAP: Evaluating Regulatory Inconsistencies and Tax Evasion Vulnerabilities',
            aim: 'To critically assess how IAS 38 (Intangible Assets) and recent FASB fair-value updates handle digital asset volatility, staking rewards, and DeFi yield transactions.',
            researchQuestions: [
                'Does treating cryptocurrency as indefinite-lived intangible assets under historical IFRS rules distort balance sheet reality for corporate treasury holders?',
                'What systemic reporting loopholes exist for cross-border decentralized finance (DeFi) liquidity pools under current HMRC and IRS reporting frameworks?',
                'How do institutional fund managers calculate and audit impairment testing for tokenized physical assets?'
            ],
            methodology: 'Doctrinal Accounting Standards Analysis & Comparative Financial Case Studies',
            level: "Master's / MSc",
            tags: ['Crypto Accounting', 'IFRS vs GAAP', 'Tax Regulation']
        },
        {
            id: 'acc-4',
            title: 'The Value Relevance of Green Bonds: Do Sovereign and Corporate Green Bond Premiums (Greenium) Lower Long-Term Capital Costs?',
            aim: 'To empirically test whether secondary debt markets price green bonds at a yield discount compared to conventional vanilla bonds of identical issuer credit ratings.',
            researchQuestions: [
                'Is there statistically significant evidence of a persistent greenium in European debt markets after controlling for liquidity and macroeconomic volatility?',
                'Do green bond proceeds consistently match promised capital expenditure on carbon-neutral infrastructure, or do post-issuance reporting gaps obscure outcomes?',
                'How do credit rating agencies incorporate sustainability-linked debt covenant breaches into default probability models?'
            ],
            methodology: 'Quantitative Fixed-Income Econometric Regression (Bloomberg Terminal Data)',
            level: 'PhD',
            tags: ['Green Bonds', 'Fixed Income', 'Corporate Finance']
        },
        {
            id: 'acc-5',
            title: 'Evaluating the Effectiveness of Internal Audit Controls in Mitigating Supply Chain Cyber-Attacks and Business Interruption Losses',
            aim: 'To examine how enterprise risk management frameworks (COSO / ISO 31000) incorporate third-party vendor digital security audits into financial risk registers.',
            researchQuestions: [
                'What is the correlation between internal audit involvement in IT procurement and subsequent ransomware incident frequency?',
                'How effectively do internal audit committees calculate potential financial exposure and contingent liabilities arising from cyber disruptions?',
                'What governance structures facilitate seamless coordination between Chief Information Security Officers (CISOs) and Chief Audit Executives (CAEs)?'
            ],
            methodology: 'Mixed Methods (Survey of Internal Audit Directors + Case Study Analysis)',
            level: 'Undergraduate / BSc',
            tags: ['Internal Audit', 'Cyber Risk', 'Risk Management']
        }
    ],

    'education-topics': [
        {
            id: 'edu-1',
            title: 'The Pedagogical Integration of Generative Artificial Intelligence in Higher Education: Redesigning Authentic Assessment to Prevent Academic Misconduct',
            aim: 'To explore how universities are transitioning away from traditional take-home essays toward oral examinations, synoptic vivas, and process-oriented portfolios in response to LLM capabilities.',
            researchQuestions: [
                'How do university academic integrity boards distinguish legitimate AI-assisted ideation from illicit generative ghostwriting?',
                'What assessment modalities best evaluate critical thinking and metacognition without relying on error-prone AI detection algorithms?',
                'How do student perceptions of academic fairness shift when AI writing tutors are formally integrated into assessment grading rubrics?'
            ],
            methodology: 'Mixed Methods (Faculty Survey + Delphi Expert Consensus Study)',
            level: 'PhD',
            tags: ['Higher Education', 'AI in Pedagogy', 'Assessment Design']
        },
        {
            id: 'edu-2',
            title: 'Closing the Socio-Economic Attainment Gap in Post-16 STEM Education: Evaluating Targeted Peer Tutoring and Digital Access Interventions',
            aim: 'To measure the academic outcomes and university matriculation rates of disadvantaged secondary school pupils receiving subsidized online STEM mentoring.',
            researchQuestions: [
                'Does structured near-peer tutoring yield statistically significant grade improvements in GCSE and A-Level Mathematics for pupils receiving Pupil Premium?',
                'What non-academic factors (belonging, STEM identity, parental academic capital) mediate subject continuation into undergraduate engineering and computing degrees?',
                'How can public education policy optimize funding allocations to overcome regional disparities in high-quality science laboratory resources?'
            ],
            methodology: 'Quasi-Experimental Difference-in-Differences Analysis + Longitudinal Student Tracking',
            level: "Master's / MEd",
            tags: ['Educational Inequality', 'STEM Education', 'Social Mobility']
        },
        {
            id: 'edu-3',
            title: 'Teacher Retention and Burnout in Special Educational Needs and Disabilities (SEND) Settings: A Phenomenological Exploration of Systemic Underfunding',
            aim: 'To examine the emotional labor, administrative compliance burdens, and attrition drivers among educators in specialized and inclusive SEND classrooms.',
            researchQuestions: [
                'What specific institutional stressors contribute most severely to early-career teacher departure from specialized autism and behavioral schools?',
                'How do delays in securing Education, Health and Care Plans (EHCPs) affect teacher mental health and classroom learning environments?',
                'What restorative leadership and professional development models effectively protect SEND staff from secondary traumatic stress?'
            ],
            methodology: 'Qualitative Interpretative Phenomenological Analysis (IPA)',
            level: "Master's / MEd",
            tags: ['Special Education', 'Teacher Burnout', 'SEND Policy']
        },
        {
            id: 'edu-4',
            title: 'Gamified Micro-Learning vs. Traditional Asynchronous Modules in Corporate and Adult Education: A Comparative Cognitive Engagement Study',
            aim: 'To evaluate knowledge retention, module completion rates, and behavioral transfer among working professionals using mobile gamified learning platforms.',
            researchQuestions: [
                'Do game mechanics (leaderboards, streak counters, badges) produce sustained learning habit formation or merely superficial short-term gamified engagement?',
                'How does spacing and interleaving in micro-learning apps affect long-term procedural recall after 30 and 60 days?',
                'What are the instructional design best practices for adapting complex compliance and cybersecurity curricula into 5-minute interactive modules?'
            ],
            methodology: 'Experimental A/B Testing + Post-Intervention Focus Groups',
            level: 'Undergraduate / BA',
            tags: ['Instructional Design', 'EdTech', 'Gamification']
        }
    ],

    'marketing-topics': [
        {
            id: 'mkt-1',
            title: 'Consumer Trust, Perceived Authenticity, and Purchasing Intent in Influencer Marketing: Virtual AI Avatars vs. Human Micro-Influencers',
            aim: 'To compare how Gen-Z and Millennial consumers evaluate sponsorship transparency, empathy, and product recommendations from synthetic virtual influencers (e.g. Lil Miquela) compared to human creators.',
            researchQuestions: [
                'Does the uncanny valley effect negatively impact brand attitude when a virtual influencer promotes beauty and wellness products?',
                'How does explicit sponsorship disclosure affect consumer skepticism across synthetic versus human content creators?',
                'What psychological factors drive parasocial relationship formation with entirely digital, computer-generated personas?'
            ],
            methodology: 'Quantitative Between-Subjects Factorial Experiment (2x2 Design) + Eye-Tracking Analysis',
            level: "Master's / MSc",
            tags: ['Influencer Marketing', 'Virtual Influencers', 'Consumer Psychology']
        },
        {
            id: 'mkt-2',
            title: 'The Post-Third-Party Cookie Era: First-Party and Zero-Party Data Strategies in Omnichannel E-Commerce Personalization',
            aim: 'To explore how consumer-facing retail brands capture voluntary consumer preference data while maintaining privacy trust following global browser privacy updates.',
            researchQuestions: [
                'What incentive structures (gamification, loyalty points, tailored discounts) maximize consumer willingness to share zero-party lifestyle preferences?',
                'How does customer lifetime value (CLV) perform in brands relying on contextual advertising compared to hyper-targeted algorithmic tracking?',
                'What regulatory compliance challenges arise under GDPR Article 6 when reconciling AI customer prediction models with consent requirements?'
            ],
            methodology: 'Multi-Case E-Commerce Performance Analysis + Consumer Behavioral Survey',
            level: "Master's / MSc",
            tags: ['Digital Marketing', 'Data Privacy', 'E-Commerce Strategy']
        },
        {
            id: 'mkt-3',
            title: 'Neuromarketing and Emotional Priming: Assessing Subconscious Neurological Responses to Sustainable Eco-Packaging in Supermarket Purchasing',
            aim: 'To measure subconscious visual attention and emotional arousal toward biodegradable and minimalist product packaging using mobile EEG and facial coding technology.',
            researchQuestions: [
                'Do consumers who self-report strong pro-environmental values demonstrate congruent neurological arousal when viewing sustainable packaging in retail environments?',
                'How does color psychology (kraft brown versus virgin white or green) bias subconscious perceptions of product quality and organic authenticity?',
                'At what premium price point does visual emotional preference for eco-packaging collapse in favor of cheaper conventional alternatives?'
            ],
            methodology: 'Experimental Neuromarketing Lab Study (EEG + Galvanic Skin Response + Choice Modeling)',
            level: 'PhD',
            tags: ['Neuromarketing', 'Sustainable Packaging', 'Consumer Behavior']
        },
        {
            id: 'mkt-4',
            title: 'Live-Stream E-Commerce and Social Selling: The Mechanics of Scarcity Cues and Real-Time Peer Validation in Driving Impulse Purchases',
            aim: 'To evaluate the psychological drivers that transform passive social media viewers into impulse buyers during TikTok Shop and Instagram Live flash-sale events.',
            researchQuestions: [
                'How do countdown timers, limited stock alerts, and real-time pinned purchase notifications trigger fear of missing out (FOMO) and impulsive checkout?',
                'What is the return and buyer-remorse rate for products acquired through high-pressure live-stream sales events compared to standard e-commerce storefronts?',
                'How can brands safeguard customer satisfaction and reduce high return logistics costs associated with live-stream social selling?'
            ],
            methodology: 'Quantitative Structural Equation Modeling (SEM) + Netnographic Content Analysis',
            level: 'Undergraduate / BA',
            tags: ['Social Commerce', 'Impulse Buying', 'Live-Streaming']
        }
    ],

    'sociology-topics': [
        {
            id: 'soc-1',
            title: 'Precarity and Algorithmic Surveillance in the Platform Economy: An Ethnographic Study of Food Delivery Workers in Urban Metropolises',
            aim: 'To examine how algorithmic dispatch, customer tipping ratings, and dynamic surge pricing shape the daily lived realities and resistance strategies of gig economy couriers.',
            researchQuestions: [
                'How do delivery workers navigate algorithmic invisibility, sudden account deactivations, and wage fluctuations?',
                'What informal mutual-aid networks and WhatsApp/Telegram collectives emerge among migrant workers to counter platform isolation?',
                'How does the constant pressure of delivery speed algorithms influence physical road safety and long-term musculoskeletal health?'
            ],
            methodology: 'Ethnographic Participant Observation + In-Depth Narrative Interviews',
            level: 'PhD',
            tags: ['Gig Economy', 'Labor Sociology', 'Urban Precarity']
        },
        {
            id: 'soc-2',
            title: 'Algorithmic Gentrification and the Transformation of Urban Public Spaces: Short-Term Holiday Rentals, Specialty Cafes, and Community Dislocation',
            aim: 'To investigate how geo-spatial recommendation algorithms (Instagram, Google Maps, Airbnb) accelerate neighborhood demographic turnover and displace historical working-class residents.',
            researchQuestions: [
                'How do digital tourism maps curate aestheticized neighborhood enclaves while erasing long-standing community services and social hubs?',
                'What is the correlation between Airbnb density and the escalation of private tenant eviction notices across inner-city districts?',
                'How do grassroots housing advocacy groups mobilize digital media to resist developer-led urban regeneration schemes?'
            ],
            methodology: 'Spatial Mixed Methods (GIS Mapping + Resident Focus Groups)',
            level: "Master's / MSc",
            tags: ['Urban Sociology', 'Gentrification', 'Housing Inequality']
        },
        {
            id: 'soc-3',
            title: 'Digital Privacy as a Class Privilege: Surveillance Capitalism and the Socio-Economic Stratification of Personal Data Protection',
            aim: 'To explore how high-income citizens can purchase hardware privacy, ad-free walled gardens, and legal anonymity, while low-income communities are subjected to mandatory public data extraction.',
            researchQuestions: [
                'How do welfare surveillance technologies and biometric monitoring disproportionately impact public housing residents and social benefit claimants?',
                'In what ways has ad-supported, privacy-invasive software become an unavoidable tax on economically disadvantaged consumers?',
                'What public policy and digital rights frameworks are required to establish privacy as a non-negotiable human right rather than a commercial luxury good?'
            ],
            methodology: 'Critical Theoretical Inquiry + Socio-Economic Survey Analysis',
            level: "Master's / MSc",
            tags: ['Surveillance Capitalism', 'Social Stratification', 'Digital Rights']
        },
        {
            id: 'soc-4',
            title: 'Echo Chambers, Affective Polarization, and the Fracture of Civic Discourse in Online Hyper-Partisan Communities',
            aim: 'To analyze how algorithmic recommender systems incentivize out-group animosity and moral outrage to maximize platform ad engagement time.',
            researchQuestions: [
                'What structural linguistic features characterize viral posts that successfully polarize political debate across Reddit and X?',
                'How do insular online epistemologies undermine trust in scientific consensus, public health guidance, and democratic electoral institutions?',
                'Can deliberative democratic polling and algorithmic depolarization interventions bridge ideological divides in online spaces?'
            ],
            methodology: 'Computational Social Science (Natural Language Processing of Social Media Corpora) + Thematic Content Analysis',
            level: 'Undergraduate / BA',
            tags: ['Political Sociology', 'Social Media', 'Polarization']
        }
    ],

    'history-topics': [
        {
            id: 'hist-1',
            title: 'Decolonizing the Colonial Archive: Restitution, Provenance Research, and the Re-Evaluation of Imperial Loot in European Museums',
            aim: 'To examine the historical debates and diplomatic tensions surrounding the repatriation of cultural artifacts (e.g. the Benin Bronzes, Parthenon Marbles) to their originating nations.',
            researchQuestions: [
                'How have historical provenance research methodologies evolved in response to post-colonial legal and moral claims?',
                'What archival silences and biases were deliberately codified by colonial administrators to justify imperial acquisitions during the late 19th century?',
                'How are contemporary universal museums redefining their ethical stewardship obligations in the 21st century?'
            ],
            methodology: 'Archival Research & Historiographical Analysis of Parliamentary and Museum Records',
            level: 'PhD',
            tags: ['Imperial History', 'Museum Studies', 'Decolonization']
        },
        {
            id: 'hist-2',
            title: 'The Spanish Flu vs. COVID-19: A Comparative Historiographical Analysis of Public Health Resistance, Quarantine Mandates, and Social Unrest',
            aim: 'To compare civic reactions, mask protests, and political polarization during the 1918–1919 Influenza Pandemic against the recent COVID-19 emergency.',
            researchQuestions: [
                'What historical factors motivated the creation of the Anti-Mask League of San Francisco in 1919, and how do they parallel modern pandemic skepticism?',
                'How did class and racial divisions influence infection fatality rates and municipal healthcare resource distribution in early 20th-century industrialized cities?',
                'What long-term labor market and welfare reforms emerged in the decade immediately following the 1918 pandemic?'
            ],
            methodology: 'Comparative Historical Analysis of Archival Newspapers, Municipal Health Minutes, and Oral Histories',
            level: "Master's / MA",
            tags: ['Medical History', 'Epidemics', 'Social History']
        },
        {
            id: 'hist-3',
            title: 'The Industrial Revolution and the Transformation of Childhood: Factory Legislation, Working-Class Family Budgets, and the Rise of Compulsory Schooling',
            aim: 'To investigate the socio-economic impact of the British Factory Acts of 1833 and 1847 on child labor practices in northern textile mills.',
            researchQuestions: [
                'How did working-class families financially adapt to the loss of child wages following parliamentary restrictions on juvenile factory employment?',
                'To what extent were early factory inspection regimes successfully enforced against non-compliant mill owners in Lancashire and Yorkshire?',
                'How did the cultural construct of childhood transition from economic asset to protected developmental stage during the mid-Victorian era?'
            ],
            methodology: 'Quantitative Analysis of Historical Census Data, Factory Inspection Reports, and Parliamentary Blue Books',
            level: "Master's / MA",
            tags: ['Victorian Britain', 'Economic History', 'Childhood & Labor']
        },
        {
            id: 'hist-4',
            title: 'Propaganda, Censorship, and Morale on the Home Front: Radio Broadcasting and Film During the Second World War in Britain and Germany',
            aim: 'To critically evaluate the psychological strategies employed by the British Ministry of Information and the German Reich Ministry of Public Enlightenment and Propaganda.',
            researchQuestions: [
                'How did BBC wartime broadcasting balance objective battlefield reporting with the necessity to maintain civilian resilience during the Blitz?',
                'What specific rhetorical tropes were utilized in German newsreels (Die Deutsche Wochenschau) to conceal the military collapse following the Battle of Stalingrad?',
                'How effective were clandestine Allied radio transmissions in eroding civilian confidence inside Axis-occupied territories?'
            ],
            methodology: 'Historiographical Analysis of Broadcast Transcripts, Mass Observation Diaries, and Government Intelligence Summaries',
            level: 'Undergraduate / BA',
            tags: ['Modern Warfare', 'Propaganda & Media', 'WWII']
        }
    ]
};
