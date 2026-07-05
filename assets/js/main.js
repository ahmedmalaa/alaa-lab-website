// ── Nav transparency on scroll ───────────────────
const nav = document.querySelector('nav');
if (nav) {
  const updateNav = () => nav.classList.toggle('nav-scrolled', window.scrollY > 50);
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
}

// ── Nav active link ──────────────────────────────
const path = window.location.pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href').replace(/\/$/, '').replace(/\.html$/, '');
  if (path === href || (path === '/index' && href === '') || (path.endsWith('/index') && href === '')) {
    a.classList.add('active');
  }
});

// ── Mobile nav toggle ────────────────────────────
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (toggle && navLinks) {
  toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
    }
  });
}

// ── Hero research terminal ───────────────────────
const heroTerminal = document.getElementById('heroTerminal');
if (heroTerminal) {
  const introEl   = document.getElementById('heroTerminalIntro');
  const contentEl = document.getElementById('heroTerminalContent');
  const asciiEl   = document.getElementById('heroAsciiArt');
  const hintEl    = document.getElementById('heroAsciiHint');
  const menuEl    = heroTerminal.querySelector('.terminal-menu');
  const cmdEl     = heroTerminal.querySelector('.terminal-cmd');
  const hintBarEl = heroTerminal.querySelector('.terminal-hint');

  const TREE = [
    { label: 'what we work on' },
    { label: 'flagship projects' },
  ];

  // PAPERS holds the known papers by key so individual leaves in RESEARCH_TREE
  // can reference a specific subset. PLACEHOLDER_PAPERS (all of them) is the
  // fallback shown for any leaf that doesn't specify its own `papers` array.
  const PAPERS = {
    drLlava: {
      title: 'Dr-LLaVA: Visual Instruction Tuning with Symbolic Clinical Grounding',
      meta: 'Shenghuan Sun, Greg M. Goldgof, Alexander Schubert, Z. Sun, Thomas Hartvigsen, Atul J. Butte, Ahmed Alaa · NeurIPS Workshop on Multimodal Algorithmic Reasoning · 2024',
      link: 'https://arxiv.org/abs/2405.19567',
    },
    testTimeHinting: {
      title: 'Test-Time Hinting for Black-Box Vision-Language Models',
      meta: 'Kaihua Hou, Abhijith Varma Mudunuri, Jiaxing Qiu, Roxana Daneshjou, Thomas Hartvigsen, Ahmed Alaa · arXiv preprint · 2026',
      link: 'https://arxiv.org/abs/2605.16410',
    },
    reasonEdit: {
      title: 'ReasonEdit: Editing Vision-Language Models using Human Reasoning',
      meta: 'Jiaxing Qiu, Kaihua Hou, Roxana Daneshjou, Ahmed Alaa, Thomas Hartvigsen · ICML · 2026',
      link: 'https://arxiv.org/abs/2602.02408',
    },
    aligningSynthetic: {
      title: 'Aligning Synthetic Medical Images with Clinical Knowledge using Human Feedback',
      meta: 'Shenghuan Sun, Greg Goldgof, Atul Butte, Ahmed M. Alaa · NeurIPS 2023 · Spotlight',
      link: 'https://proceedings.neurips.cc/paper_files/paper/2023/file/2b1d1e5affe5fdb70372cd90dd8afd49-Paper-Conference.pdf',
    },
    medReal2Sim: {
      title: 'Med-Real2Sim: Non-Invasive Medical Digital Twins using Physics-Informed Self-Supervised Learning',
      meta: 'Keying Kuang, Frances Dean, Jack B. Jedlicki, David Ouyang, Anthony Philippakis†, David Sontag†, Ahmed Alaa† (†Co-senior authors) · NeurIPS · 2024',
      link: 'https://proceedings.neurips.cc/paper_files/paper/2024/file/0b081a44ed0b8c0c4aa6bd886a60bea4-Paper-Conference.pdf',
    },
    stateSpaceModeling: {
      title: 'State-Space Modeling in Natural Language',
      meta: 'Nikita Mehandru, Marie-Laure Charpignon, Kaihua Hou, David Bamman, Ahmed Alaa · ICLR Workshop on Time Series in the Age of Large Models · 2026',
      link: 'https://openreview.net/forum?id=HY9c8l9kbS',
    },
    conformalMetaLearners: {
      title: 'Conformal Meta-Learners for Predictive Inference of Individual Treatment Effects',
      meta: 'Ahmed Alaa, Zaid Ahmad, Mark van der Laan · NeurIPS 2023 · Oral Presentation',
      link: 'https://proceedings.neurips.cc/paper_files/paper/2023/file/94ab02a30b0e4a692a42ccd0b4c55399-Paper-Conference.pdf',
    },
    predictionPoweredCausal: {
      title: 'Prediction-Powered Generalization of Causal Inferences',
      meta: 'Ilker Demirel, Ahmed Alaa, Anthony Philippakis, David Sontag · ICML · 2024',
      link: 'https://openreview.net/forum?id=QKnWXX3aVm',
    },
    causalEffectLearnedInstruments: {
      title: 'Causal Effect Estimation with Learned Instrument Representations',
      meta: 'Frances Dean*, Jenna Fields*, R. Bhalerao, Marie-Laure Charpignon, Ahmed Alaa (*Co-first authors) · arXiv preprint · 2026',
      link: 'https://arxiv.org/abs/2602.10370',
    },
    hybridMetaLearners: {
      title: 'Hybrid Meta-learners for Estimating Heterogeneous Treatment Effects',
      meta: 'Zhongyuan Liang, Lars van der Laan, Ahmed Alaa · arXiv preprint · 2025',
      link: 'https://arxiv.org/abs/2506.13680',
    },
    aiCopilotsCausalEvidence: {
      title: 'Artificial Intelligence–Based Copilots to Generate Causal Evidence',
      meta: 'M. Petersen, Ahmed Alaa, E. Kıcıman, C. Holmes, M. van der Laan · NEJM AI · 2024',
      link: 'https://ai.nejm.org/doi/abs/10.1056/AIp2400727',
    },
    erReason: {
      title: 'ER-Reason: A Benchmark Dataset for LLM Clinical Reasoning in the Emergency Room',
      meta: 'Nikita Mehandru, Niloufar Golchini, Namrata Garg, Kathy LeSaint, Christopher Nash, Anu Ramachandran, Travis Zack, Liam McCoy, Adam Rodman, David Bamman, Melanie Molina†, Ahmed Alaa† (†Co-senior authors) · arXiv preprint · 2026',
      link: 'https://arxiv.org/abs/2505.22919',
    },
    chexthought: {
      title: 'CheXthought: A Global Multimodal Dataset of Clinical Chain-of-thought Reasoning and Visual Attention for Chest X-ray Interpretation',
      meta: 'Sonali Sharma, Jin Long, George Shih, Sarah Eid, Christian Bluethgen, Francine L. Jacobson, Emily B. Tsai, Ahmed M. Alaa, Curtis P. Langlotz, Global Radiology Consortium · arXiv preprint · 2026',
      link: 'https://arxiv.org/abs/2604.26288',
    },
    etab: {
      title: 'ETAB: A Benchmark Suite for Visual Representation Learning in Echocardiography',
      meta: 'Ahmed Alaa, Anthony Philippakis, David Sontag · NeurIPS · 2022',
      link: 'https://proceedings.neurips.cc/paper_files/paper/2022/file/796501434d0dc3a039d5b91261f7f889-Paper-Datasets_and_Benchmarks.pdf',
    },
    physicianVsLlmSummaries: {
      title: 'Physician-versus Large Language Model-Generated Summaries in the Emergency Department',
      meta: 'Niloufar Golchini, Nikita Mehandru, Ahmed Alaa†, Melanie Molina† (†Co-senior authors) · medRxiv · 2025',
      link: 'https://www.medrxiv.org/content/10.1101/2025.08.13.25333609v3',
    },
    machineTranslationLowResourced: {
      title: 'Viability of Machine Translation for Healthcare in Low-Resourced Languages',
      meta: 'H.H. Nigatu, Nikita Mehandru, N.H. Abadi, B. Gebremeskel, Ahmed Alaa, et al. · EMNLP · 2025',
      link: 'https://aclanthology.org/2025.emnlp-main.535/',
    },
    decliningMedicalSafetyMessaging: {
      title: 'A Longitudinal Analysis of Declining Medical Safety Messaging in Generative AI Models',
      meta: 'Sonali Sharma, Ahmed M. Alaa, Roxana Daneshjou · npj Digital Medicine · 2025',
      link: 'https://www.nature.com/articles/s41746-025-01943-1',
    },
    strategicFeatureSelection: {
      title: 'Strategic Feature Selection',
      meta: 'Jivat Kaur, Pratik Patil, Divya Shanmugam, Emma Pierson, Michael I. Jordan, Nika Haghtalab, Meena Jagadeesan†, Ahmed Alaa†, Serena Wang† (†Co-senior authors) · arXiv preprint · 2026',
      link: 'https://arxiv.org/abs/2606.18867',
    },
    dataReuseCostEfficientTrials: {
      title: 'Data Reuse Enables Cost-Efficient Randomized Trials of Medical AI Models',
      meta: 'M. Nercessian, W. Zhang, Alexander Schubert, D. Yang, M. Chung, Ahmed Alaa†, Adam Yala† (†Co-senior authors) · arXiv preprint · 2025',
      link: 'https://arxiv.org/abs/2511.08986',
    },
    constructValidityPosition: {
      title: 'Position: Medical Large Language Model Benchmarks Should Prioritize Construct Validity',
      meta: 'Ahmed Alaa, Thomas Hartvigsen, Niloufar Golchini, Shiladitya Dutta, Frances Dean, Inioluwa Deborah Raji, Travis Zack · ICML 2025 · Oral Presentation',
      link: 'https://openreview.net/pdf?id=YuMEUNNpeb',
    },
    aligningBenchmarksPairwisePreferences: {
      title: 'Aligning Language Model Benchmarks with Pairwise Preferences',
      meta: 'M. Gutierrez, X. Leng, H. Cyberey, J.R. Schwarz, Ahmed Alaa, Thomas Hartvigsen · arXiv preprint · 2026',
      link: 'https://arxiv.org/abs/2602.02898',
    },
    inflexibleReasoningLimitations: {
      title: 'Limitations of Large Language Models in Clinical Problem-Solving Arising from Inflexible Reasoning',
      meta: 'J. Kim, A. Podlasek, K. Shidara, F. Liu, Ahmed Alaa, D. Bernardo · Scientific Reports · 2025',
      link: 'https://www.nature.com/articles/s41598-025-22940-0',
    },
    llmAgentsInClinic: {
      title: 'Evaluating Large Language Models as Agents in the Clinic',
      meta: 'Nikita Mehandru, Brenda Miao, Eduardo Rodriguez Almaraz, Madhumita Sushil, Atul Butte, Ahmed Alaa · NPJ Digital Medicine · 2024',
      link: 'https://www.nature.com/articles/s41746-024-01083-y',
    },
    medEvalArena: {
      title: 'MedEvalArena: A Self-Generated, Peer-Judged Benchmark for Medical Reasoning',
      meta: 'P. Prem, K. Shidara, V. Kuppa, E. Wheeler, F. Liu, Ahmed Alaa, D. Bernardo · medRxiv · 2026',
      link: 'https://www.medrxiv.org/content/10.64898/2026.01.27.26344905v1',
    },
    instructCV: {
      title: 'InstructCV: Instruction-Tuned Text-to-Image Diffusion Models as Vision Generalists',
      meta: 'Yulu Gan, Sungwoo Park, Alexander Schubert, Anthony Philippakis, Ahmed M. Alaa · ICLR · 2024',
      link: 'https://openreview.net/forum?id=Nu9mOSq7eH',
    },
  };

  const RESEARCH_TREE = [
    {
      label: 'Building clinical reasoning AI',
      sub: [
        {
          label: 'Post-training and test-time scaling',
          sub: [
            { label: 'RL from clinician feedback', info: 'We develop methods to incorporate clinician feedback in model post-training by (1) designing verifiable rewards for clinical reasoning, and (2) developing methods that generate DPO preference data based on free-text feedback from clinicians.', img: 'assets/images/research%20popups/RL%20from%20clinician%20feedback.png', papers: [PAPERS.aligningSynthetic, PAPERS.drLlava], members: [
              { name: 'William', img: 'assets/images/cropped_face_images_transparent/William_cropped.png', href: 'pages/people/william.html' },
              { name: 'Zhongyuan', img: 'assets/images/cropped_face_images_transparent/Zhongyuan_cropped.png', href: 'pages/people/liang.html' },
            ]},
            { label: 'Multimodal alignment', info: 'Clinical decisions often require reasoning across modalities (e.g. a medical image and a clinical note). We develop post-training methods that align frontier models across these modalities in order to ground visual and textual signals in a single reasoning process.', img: 'assets/images/research%20popups/Multimodal%20alignment.png', papers: [PAPERS.reasonEdit, PAPERS.drLlava, PAPERS.instructCV], members: [
              { name: 'Alex', img: 'assets/images/cropped_face_images_transparent/Alex_cropped.png', href: 'pages/people/schubert.html' },
              { name: 'Zhongyuan', img: 'assets/images/cropped_face_images_transparent/Zhongyuan_cropped.png', href: 'pages/people/liang.html' },
              { name: 'AVM', img: 'assets/images/cropped_face_images_transparent/AVM_cropped.png', href: 'pages/people/mudunuri.html' },
            ]},
            { label: 'Test-time clinical reasoning', info: 'We study test-time methods that let frontier models reason more carefully about a patient case at inference. Because these methods are applied at inference time, they are compatible with black-box proprietary models without retraining or access to model weights.', img: 'assets/images/research%20popups/Test%20time%20hinting.png', papers: [PAPERS.testTimeHinting], members: [
              { name: 'William', img: 'assets/images/cropped_face_images_transparent/William_cropped.png', href: 'pages/people/william.html' },
              { name: 'AVM', img: 'assets/images/cropped_face_images_transparent/AVM_cropped.png', href: 'pages/people/mudunuri.html' },
            ]},
          ]
        },
        {
          label: 'Causal reasoning and world models',
          sub: [
            { label: 'Machine learning-based causal effect estimation', info: 'We develop models that estimate causal effects from observational clinical data when randomized trials are costly or infeasible, including methods that use AI predictions as surrogate endpoints when true outcomes are long-term or expensive to observe.', img: 'assets/images/research%20popups/AI%20causal%20effects.png', papers: [PAPERS.conformalMetaLearners, PAPERS.predictionPoweredCausal, PAPERS.causalEffectLearnedInstruments, PAPERS.hybridMetaLearners, PAPERS.aiCopilotsCausalEvidence], members: [
              { name: 'Ahmed', img: 'assets/images/cropped_face_images_transparent/Ahmed_cropped.png', href: 'pages/people/ahmed.html' },
              { name: 'Franny', img: 'assets/images/cropped_face_images_transparent/Franny_cropped.png', href: 'pages/people/dean.html' },
              { name: 'Zhongyuan', img: 'assets/images/cropped_face_images_transparent/Zhongyuan_cropped.png', href: 'pages/people/liang.html' },
            ]},
            { label: 'Medical world models and digital twins', info: 'We build patient-level digital twins and world models of clinical environments to simulate individual patient trajectories and support counterfactual reasoning for personalized decision-making.', img: 'assets/images/research%20popups/World%20Models%20and%20Digital%20Twins.png', papers: [PAPERS.medReal2Sim, PAPERS.stateSpaceModeling], members: [
              { name: 'Franny', img: 'assets/images/cropped_face_images_transparent/Franny_cropped.png', href: 'pages/people/dean.html' },
              { name: 'Nikita', img: 'assets/images/cropped_face_images_transparent/Nikita_cropped.png', href: 'pages/people/mehandru.html' },
            ]},
          ]
        }
      ]
    },
    {
      label: 'Evaluating clinical AI in use',
      sub: [
        {
          label: 'Human evaluation with clinicians',
          sub: [
            { label: 'Clinician-annotated benchmarks', info: 'To evaluate generative AI models, we curate and release clinician-annotated benchmark datasets, capturing data that is not normally recorded in routine care — such as the reasoning chains behind a decision — with a focus on ecological validity.', img: 'assets/images/research%20popups/Clinician-annotated%20benchmarks.png', papers: [PAPERS.erReason, PAPERS.chexthought, PAPERS.etab], members: [
              { name: 'Nilo', img: 'assets/images/cropped_face_images_transparent/Nilo_cropped.png', href: 'pages/people/golchini.html' },
              { name: 'Nikita', img: 'assets/images/cropped_face_images_transparent/Nikita_cropped.png', href: 'pages/people/mehandru.html' },
            ]},
            { label: 'Reader studies and rubric rating tasks', info: 'We conduct empirical reader studies and rubric rating tasks with clinicians to evaluate how frontier and commercial AI models perform on real clinical tasks, with the goal of identifying gaps between benchmark performance and bedside utility.', img: 'assets/images/research%20popups/Rubric%20rating%20tasks.png', papers: [PAPERS.physicianVsLlmSummaries, PAPERS.machineTranslationLowResourced, PAPERS.decliningMedicalSafetyMessaging], members: [
              { name: 'Ahmed', img: 'assets/images/cropped_face_images_transparent/Ahmed_cropped.png', href: 'pages/people/ahmed.html' },
              { name: 'Nilo', img: 'assets/images/cropped_face_images_transparent/Nilo_cropped.png', href: 'pages/people/golchini.html' },
              { name: 'Nikita', img: 'assets/images/cropped_face_images_transparent/Nikita_cropped.png', href: 'pages/people/mehandru.html' },
            ]},
            { label: 'Generating evidence on the clinical & billing impact of AI', info: 'We develop causal inference and game-theoretic methods to study the real-world impact of AI on clinical outcomes mediated by clinician decisions, and how AI reshapes the strategic interactions between health systems and insurers that determine billing.', img: 'assets/images/research%20popups/Evidence%20on%20clinical%20and%20billing.png', papers: [PAPERS.strategicFeatureSelection, PAPERS.dataReuseCostEfficientTrials], members: [
              { name: 'Ahmed', img: 'assets/images/cropped_face_images_transparent/Ahmed_cropped.png', href: 'pages/people/ahmed.html' },
              { name: 'Jivat', img: 'assets/images/cropped_face_images_transparent/Jivat_cropped.png', href: 'pages/people/kaur.html' },
            ]},
          ]
        },
        {
          label: 'Scalable automatic evaluation',
          sub: [
            { label: 'Construct validity and benchmark item design', info: 'Drawing on our reader studies and human evaluations, we design benchmark items that discriminate strong and weak models on real-world tasks, with the goal of improving the construct validity of benchmarks vendors and researchers use for model eval.', img: 'assets/images/research%20popups/Construct%20validity.png', papers: [PAPERS.constructValidityPosition, PAPERS.aligningBenchmarksPairwisePreferences, PAPERS.inflexibleReasoningLimitations], members: [
              { name: 'Ahmed', img: 'assets/images/cropped_face_images_transparent/Ahmed_cropped.png', href: 'pages/people/ahmed.html' },
              { name: 'Nilo', img: 'assets/images/cropped_face_images_transparent/Nilo_cropped.png', href: 'pages/people/golchini.html' },
            ]},
            { label: 'Validity of LLM as judge', info: 'One way to evaluate LLMs in unverifiable tasks in clinical contexts is to use other LLMs as automated judges. We study the statistical validity of these methods and the optimal approaches for combining costly human evals with scalable AI-based ones.', img: 'assets/images/research%20popups/LLM%20Judge.png', papers: [PAPERS.medEvalArena], members: [
              { name: 'Ahmed', img: 'assets/images/cropped_face_images_transparent/Ahmed_cropped.png', href: 'pages/people/ahmed.html' },
            ]},
            { label: 'Monitorability and scalable oversight', info: 'Deploying generative AI in a health system requires continuous monitoring. We study how monitorable deployed models are by quantifying the faithfulness of their chain-of-thought reasoning and designing interventions to correct errors as they surface.', img: 'assets/images/research%20popups/Monitorability.png', papers: [PAPERS.llmAgentsInClinic], members: [
              { name: 'Ahmed', img: 'assets/images/cropped_face_images_transparent/Ahmed_cropped.png', href: 'pages/people/ahmed.html' },
              { name: 'Nilo', img: 'assets/images/cropped_face_images_transparent/Nilo_cropped.png', href: 'pages/people/golchini.html' },
            ]},
          ]
        }
      ]
    }
  ];

  function buildSearchIndex() {
    const idx = [];
    RESEARCH_TREE.forEach((circle, cidx) => {
      idx.push({ label: circle.label, level: 1, cidx, bidx: 0, lidx: -1 });
      circle.sub.forEach((box, bidx) => {
        idx.push({ label: box.label, level: 2, cidx, bidx, lidx: -1 });
        box.sub.forEach((leaf, lidx) => {
          idx.push({ label: leaf.label, level: 3, cidx, bidx, lidx });
        });
      });
    });
    return idx;
  }
  const SEARCH_INDEX = buildSearchIndex();

  const modalEl    = document.getElementById('researchModal');
  const modalTitle = document.getElementById('researchModalTitle');
  const modalBody  = document.getElementById('researchModalBody');
  const modalTag   = document.getElementById('researchModalTag');
  const modalClose = document.getElementById('researchModalClose');

  const PLACEHOLDER_PAPERS = Object.values(PAPERS);

  const papersModalEl    = document.getElementById('papersModal');
  const papersModalList  = document.getElementById('papersModalList');
  const papersModalClose = document.getElementById('papersModalClose');

  function openPapersModal(papers) {
    papersModalList.innerHTML = papers.map(p =>
      `<div class="papers-modal-item">` +
      `<div class="papers-modal-item-title">${p.title}</div>` +
      `<div class="papers-modal-item-meta">${p.meta}</div>` +
      (p.link ? `<a href="${p.link}" target="_blank" class="papers-modal-item-link">Paper →</a>` : '') +
      `</div>`
    ).join('');
    papersModalEl.hidden = false;
    papersModalClose.focus();
  }

  function closePapersModal() {
    papersModalEl.hidden = true;
  }

  papersModalClose.addEventListener('click', closePapersModal);
  papersModalEl.addEventListener('click', e => { if (e.target === papersModalEl) closePapersModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !papersModalEl.hidden) closePapersModal();
  });

  let roState = { level: 0, circleIdx: 0, boxIdx: 0, leafIdx: -1 };

  function initResearchLayout() {
    const inner = modalEl.querySelector('.research-modal');
    inner.classList.remove('research-modal--wide');
    inner.classList.add('research-modal--research');
    modalTag.textContent = '';
    modalTitle.textContent = '';
    modalTitle.style.display = 'none';

    function branchHtml(cidx) {
      const b = RESEARCH_TREE[cidx];
      const leaves = (item, bidx) => item.sub.map((s, i) =>
        `<div class="ro-leaf" data-cidx="${cidx}" data-bidx="${bidx}" data-lidx="${i}">${s.label}</div>`
      ).join('');
      return (
        `<div class="ro-box-wrap">` +
          `<div class="ro-branch-box" data-cidx="${cidx}" data-bidx="0">${b.sub[0].label}</div>` +
          `<div class="ro-subs" data-cidx="${cidx}" data-bidx="0">${leaves(b.sub[0], 0)}</div>` +
        `</div>` +
        `<div class="ro-box-wrap">` +
          `<div class="ro-subs" data-cidx="${cidx}" data-bidx="1">${leaves(b.sub[1], 1)}</div>` +
          `<div class="ro-branch-box" data-cidx="${cidx}" data-bidx="1">${b.sub[1].label}</div>` +
        `</div>`
      );
    }

    modalBody.innerHTML =
      `<p class="research-modal-subtitle">Frontier AI models are increasingly capable of clinical tasks that once demanded purpose-built models and architectures. Our lab studies how to give frontier models the nuanced capabilities they need to operate in real clinical settings, and how to evaluate and monitor their clinical and financial impact in everyday clinical workflows.</p>` +
      `<button class="ro-back-btn ro-back-hidden" id="ro-back">← back</button>` +
      `<div class="ro-main" id="ro-main">` +
        `<div class="ro-branch" id="ro-branch-1">` +
          `<div class="ro-circle-desc" id="ro-circle-desc-0">Real-world clinical practice involves reasoning through evidence and interventions under uncertainty rather than simply recalling medical knowledge. We build these reasoning capabilities into frontier models through specialized post-training and test-time methods, and through causal and world-model approaches that let models reason about the consequences of clinical decisions.</div>` +
          branchHtml(1) +
        `</div>` +
        `<div class="ro-circles-pair">` +
          `<div class="ro-circle" data-cidx="0">${RESEARCH_TREE[0].label}</div>` +
          `<div class="ro-circle" data-cidx="1">Evaluating<br>clinical AI<br>in use</div>` +
        `</div>` +
        `<div class="ro-branch" id="ro-branch-0">` +
          `<div class="ro-circle-desc" id="ro-circle-desc-1">Generative AI is often used for unverifiable tasks in healthcare like ambient documentation, which lack automatically verifiable outputs and require expert human review. To evaluate these frontier and commercial tools, we conduct expert evaluation studies and apply psychometric validity principles to develop scalable, automated evaluation methods.</div>` +
          branchHtml(0) +
        `</div>` +
        `<div class="ro-info-panel ro-info-panel--left" id="ro-info-panel-1"></div>` +
        `<div class="ro-info-panel ro-info-panel--right" id="ro-info-panel-0"></div>` +
        `<svg class="ro-arrow-overlay" id="ro-arrows">` +
          `<defs>` +
          `<marker id="roArrowHead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">` +
          `<polygon points="0 0, 8 3, 0 6" fill="#222"/></marker>` +
          `<marker id="roArrowHeadSm" markerWidth="4" markerHeight="3" refX="3.5" refY="1.5" orient="auto">` +
          `<polygon points="0 0, 4 1.5, 0 3" fill="#222"/></marker>` +
          `</defs>` +
        `</svg>` +
      `</div>`;

    document.getElementById('ro-back').addEventListener('click', () => {
      if (roState.level > 0) { modalBody.querySelector('.research-modal-subtitle')?.classList.add('faded'); roState.level--; applyROState(); }
    });

    modalBody.querySelectorAll('.ro-circle').forEach(el =>
      el.addEventListener('click', () => {
        modalBody.querySelector('.research-modal-subtitle')?.classList.add('faded');
        const cidx = parseInt(el.dataset.cidx);
        if (roState.level === 0) {
          roState = { level: 1, circleIdx: cidx, boxIdx: 0 };
        } else if (!el.classList.contains('ro-faded')) {
          roState.level = 0;
        }
        applyROState();
      })
    );

    modalBody.querySelectorAll('.ro-branch-box').forEach(el =>
      el.addEventListener('click', () => {
        modalBody.querySelector('.research-modal-subtitle')?.classList.add('faded');
        if (!el.classList.contains('ro-visible') || el.classList.contains('ro-faded')) return;
        const cidx = parseInt(el.dataset.cidx);
        const bidx = parseInt(el.dataset.bidx);
        if (roState.level === 1) {
          roState = { level: 2, circleIdx: cidx, boxIdx: bidx, leafIdx: -1 };
          applyROState();
        } else if (roState.level >= 2 && el.classList.contains('ro-active')) {
          roState = { level: 1, circleIdx: cidx, boxIdx: bidx, leafIdx: -1 };
          applyROState();
        }
      })
    );

    modalBody.querySelectorAll('.ro-leaf').forEach(el =>
      el.addEventListener('click', () => {
        modalBody.querySelector('.research-modal-subtitle')?.classList.add('faded');
        const cidx = parseInt(el.dataset.cidx);
        const bidx = parseInt(el.dataset.bidx);
        const lidx = parseInt(el.dataset.lidx);
        if (roState.level >= 2 && cidx === roState.circleIdx && bidx === roState.boxIdx) {
          if (roState.level === 3 && roState.leafIdx === lidx) {
            roState = { level: 2, circleIdx: cidx, boxIdx: bidx, leafIdx: -1 };
          } else {
            roState = { level: 3, circleIdx: cidx, boxIdx: bidx, leafIdx: lidx };
          }
          applyROState();
        }
      })
    );

    applyROState();
  }

  function applyROState() {
    const { level, circleIdx, boxIdx, leafIdx } = roState;

    const back = document.getElementById('ro-back');
    if (back) back.classList.toggle('ro-back-hidden', level === 0);

    const subtitle = modalBody.querySelector('.research-modal-subtitle');
    if (subtitle) subtitle.classList.toggle('faded', level > 0);

    const circleDesc0 = document.getElementById('ro-circle-desc-0');
    const circleDesc1 = document.getElementById('ro-circle-desc-1');
    const descVisible = level >= 1;
    if (circleDesc0) circleDesc0.classList.toggle('ro-visible', level >= 1 && circleIdx === 0);
    if (circleDesc1) circleDesc1.classList.toggle('ro-visible', level >= 1 && circleIdx === 1);

    const modalLogo = modalEl.querySelector('.research-modal-logo');
    if (modalLogo) modalLogo.style.opacity = descVisible ? '0' : '';

    modalBody.querySelectorAll('.ro-circle').forEach(el => {
      const cidx = parseInt(el.dataset.cidx);
      el.classList.toggle('ro-faded', level > 0 && cidx !== circleIdx);
    });

    modalBody.querySelectorAll('.ro-branch-box').forEach(el => {
      const cidx = parseInt(el.dataset.cidx);
      const bidx = parseInt(el.dataset.bidx);
      el.classList.remove('ro-visible', 'ro-active', 'ro-faded');
      if (level >= 1 && cidx === circleIdx) {
        el.classList.add('ro-visible');
        if (level >= 2) {
          el.classList.add(bidx === boxIdx ? 'ro-active' : 'ro-faded');
        }
      }
    });

    modalBody.querySelectorAll('.ro-subs').forEach(el => {
      const cidx = parseInt(el.dataset.cidx);
      const bidx = parseInt(el.dataset.bidx);
      el.classList.toggle('ro-open', level >= 2 && cidx === circleIdx && bidx === boxIdx);
    });

    modalBody.querySelectorAll('.ro-leaf').forEach(el => {
      const cidx = parseInt(el.dataset.cidx);
      const bidx = parseInt(el.dataset.bidx);
      const lidx = parseInt(el.dataset.lidx);
      el.classList.toggle('ro-leaf-active', level >= 3 && cidx === circleIdx && bidx === boxIdx && lidx === leafIdx);
    });

    modalBody.querySelectorAll('.ro-info-panel').forEach(el => el.classList.remove('ro-info-visible'));
    if (level >= 3) {
      const panel = document.getElementById(`ro-info-panel-${1 - circleIdx}`);
      const leaf = RESEARCH_TREE[circleIdx]?.sub[boxIdx]?.sub[leafIdx];
      if (panel && leaf) {
        const memberCardsHtml = leaf.members
          ? leaf.members.map(m =>
              `<a href="${m.href}" class="ro-member-card">
                <img class="ro-member-img" src="${m.img}" alt="${m.name}" />
                <span class="ro-member-name">${m.name}</span>
              </a>`).join('')
          : '';

        const imgHtml = leaf.img
          ? `<div class="ro-info-img-wrap">` +
            `<img class="ro-info-img" src="${leaf.img}" alt="" />` +
            `<div class="ro-img-overlay"></div>` +
            `</div>`
          : '';

        const whoSectionHtml = leaf.members
          ? `<div class="ro-who-section">` +
            `<button class="ro-who-btn">Who's working on this?</button>` +
            `<div class="ro-who-members" hidden>${memberCardsHtml}</div>` +
            `</div>`
          : '';

        panel.innerHTML =
          `<div class="ro-info-title">${leaf.label}</div>` +
          `<div class="ro-info-body">${leaf.info}</div>` +
          imgHtml +
          `<div class="ro-panel-footer">` +
          `<button class="ro-papers-btn">Show relevant papers →</button>` +
          whoSectionHtml +
          `</div>`;

        panel.querySelector('.ro-papers-btn').addEventListener('click', () => {
          openPapersModal(leaf.papers || PLACEHOLDER_PAPERS);
        });

        const whoBtnEl = panel.querySelector('.ro-who-btn');
        const overlay   = panel.querySelector('.ro-img-overlay');
        if (whoBtnEl) {
          whoBtnEl.addEventListener('click', () => {
            whoBtnEl.hidden = true;
            panel.querySelector('.ro-who-members').hidden = false;
            if (overlay) requestAnimationFrame(() => overlay.classList.add('active'));
          });
          if (overlay) {
            overlay.addEventListener('click', () => {
              overlay.classList.remove('active');
              panel.querySelector('.ro-who-members').hidden = true;
              whoBtnEl.hidden = false;
            });
          }
        }
        panel.classList.add('ro-info-visible');
      }
    }

    clearTimeout(window._roArrowTimer);
    if (level === 2) {
      drawROArrows(false);
      requestAnimationFrame(() => drawROArrows(true));
    } else if (level < 2) {
      window._roArrowTimer = setTimeout(() => drawROArrows(true), 60);
    }
  }

  function drawROArrows(withSubs) {
    const svg = document.getElementById('ro-arrows');
    if (!svg) return;
    svg.querySelectorAll('path').forEach(el => el.remove());

    const { level, circleIdx, boxIdx } = roState;
    if (level === 0) return;

    const main = document.getElementById('ro-main');
    const cr   = main.getBoundingClientRect();
    const markerUrl = `url(${location.href.replace(/#.*/, '')}#roArrowHead)`;

    function rel(el) {
      const r = el.getBoundingClientRect();
      return { l: r.left-cr.left, r: r.right-cr.left, t: r.top-cr.top, b: r.bottom-cr.top,
               cx: r.left+r.width/2-cr.left, cy: r.top+r.height/2-cr.top };
    }
    function bezier(x1, y1, x2, y2, marker) {
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const mx = (x1+x2)/2;
      p.setAttribute('d', `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`);
      p.setAttribute('stroke', '#222'); p.setAttribute('stroke-width', '1.5');
      p.setAttribute('fill', 'none'); p.setAttribute('marker-end', marker || markerUrl);
      svg.appendChild(p);
    }

    const mirrored = circleIdx === 1;
    const circle   = modalBody.querySelector(`.ro-circle[data-cidx="${circleIdx}"]`);
    if (!circle) return;
    const c = rel(circle);

    if (level === 1) {
      modalBody.querySelectorAll(`.ro-branch-box[data-cidx="${circleIdx}"].ro-visible`).forEach(box => {
        const b = rel(box);
        mirrored ? bezier(c.l, c.cy, b.r, b.cy) : bezier(c.r, c.cy, b.l, b.cy);
      });
    } else {
      const pBox   = modalBody.querySelector(`.ro-branch-box[data-cidx="${circleIdx}"][data-bidx="${boxIdx}"]`);
      const subsEl = modalBody.querySelector(`.ro-subs[data-cidx="${circleIdx}"][data-bidx="${boxIdx}"]`);
      const leaves = subsEl ? Array.from(subsEl.querySelectorAll('.ro-leaf')) : [];
      if (!pBox) return;
      const p = rel(pBox);
      mirrored ? bezier(c.l, c.cy, p.r, p.cy) : bezier(c.r, c.cy, p.l, p.cy);
      if (withSubs && leaves.length) {
        const smUrl = `url(${location.href.replace(/#.*/, '')}#roArrowHeadSm)`;
        if (boxIdx === 0) {
          bezier(p.cx, p.b, p.cx, p.b + 10, smUrl);
        } else {
          bezier(p.cx, p.t, p.cx, p.t - 10, smUrl);
        }
      }
    }
  }

  function openItemModal(idx) {
    const inner = modalEl.querySelector('.research-modal');
    inner.classList.remove('research-modal--wide', 'research-modal--research');
    if (idx === 0) {
      roState = { level: 0, circleIdx: 0, boxIdx: 0 };
      modalTag.textContent = '';
      modalTag.style.display = 'none';
      initResearchLayout();
    } else {
      modalTag.style.display = '';
      modalTag.textContent   = 'research.sh';
      modalTitle.style.display = '';
      modalTitle.textContent = 'flagship projects';
      modalBody.innerHTML    = '<p class="research-modal-under-construction">Under construction</p>';
    }
    modalEl.hidden = false;
    modalClose.focus();
  }

  function closeModal() {
    modalEl.hidden = true;
    modalEl.querySelector('.research-modal').classList.remove('research-modal--research');
    heroTerminal.focus();
  }
  modalClose.addEventListener('click', closeModal);
  modalEl.addEventListener('click', e => { if (e.target === modalEl) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modalEl.hidden && papersModalEl.hidden) closeModal(); });

  let state = 'main', current = 0, parentIdx = 0;

  function opts() { return Array.from(menuEl.querySelectorAll('.terminal-option')); }

  function setActive(idx) {
    opts().forEach((el, i) => {
      const on = i === idx;
      el.classList.toggle('active', on);
      el.setAttribute('aria-selected', on);
    });
    current = idx;
  }

  function buildMain() {
    state = 'main';
    cmdEl.textContent = 'where would you like to start?';
    menuEl.innerHTML = TREE.map((item, i) =>
      `<div class="terminal-option" data-idx="${i}" role="option" aria-selected="false">` +
      `<span class="terminal-arrow">></span><span>${item.label}</span></div>`
    ).join('');
    hintBarEl.innerHTML = '<span class="t-key">↑</span><span class="t-key">↓</span> navigate &nbsp;<span class="t-key">↵</span> select &nbsp;<span class="t-key">↵</span> search';
    opts().forEach((el, i) => el.addEventListener('click', () => { setActive(i); openItemModal(i); heroTerminal.focus(); }));
    setActive(parentIdx);

    // Search row
    heroTerminal.querySelector('.terminal-search-section')?.remove();
    document.querySelector('.terminal-results-portal')?.remove();
    const searchSec = document.createElement('div');
    searchSec.className = 'terminal-search-section';
    searchSec.innerHTML =
      `<div class="terminal-search-row">` +
      `<span class="terminal-search-prefix">$ or search by keyword:</span></div>` +
      `<div class="terminal-search-input-row"><span class="terminal-search-prefix">&gt;</span>` +
      `<input class="terminal-input" autocomplete="off" spellcheck="false" /></div>`;
    hintBarEl.before(searchSec);

    const input   = searchSec.querySelector('input.terminal-input');

    // Portal results rendered outside the terminal so they can overflow
    const resultsPortal = document.createElement('div');
    resultsPortal.className = 'terminal-results-portal';
    document.body.appendChild(resultsPortal);

    function positionPortal() {
      const r = searchSec.getBoundingClientRect();
      resultsPortal.style.left  = r.left + 'px';
      resultsPortal.style.top   = (r.bottom + 4) + 'px';
      resultsPortal.style.width = r.width + 'px';
    }

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      resultsPortal.innerHTML = '';
      if (!q) { resultsPortal.hidden = true; return; }
      SEARCH_INDEX.forEach(match => {
        if (match.label.toLowerCase().includes(q)) {
          const el = document.createElement('div');
          el.className = 'terminal-result-item';
          el.innerHTML = `<span class="terminal-result-arrow">→</span><span>${match.label}</span>`;
          el.addEventListener('click', () => {
            openItemModal(0);
            roState = { level: match.level, circleIdx: match.cidx, boxIdx: match.bidx, leafIdx: match.lidx };
            applyROState();
            clearTimeout(window._roArrowTimer);
            drawROArrows(true);
            input.value = '';
            resultsPortal.innerHTML = '';
            resultsPortal.hidden = true;
          });
          resultsPortal.appendChild(el);
        }
      });
      if (resultsPortal.children.length) { resultsPortal.hidden = false; positionPortal(); }
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowUp') {
        e.preventDefault(); e.stopPropagation();
        searchSec.classList.remove('active');
        setActive(opts().length - 1);
        heroTerminal.focus();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault(); e.stopPropagation();
        searchSec.classList.remove('active');
        setActive(0);
        heroTerminal.focus();
      } else if (e.key === 'Enter') {
        e.preventDefault(); e.stopPropagation();
        const first = resultsPortal.querySelector('.terminal-result-item');
        if (first) first.click();
      }
    });
  }

  heroTerminal.addEventListener('keydown', e => {
    const o = opts();
    const searchSec = heroTerminal.querySelector('.terminal-search-section');
    const total = o.length + (searchSec ? 1 : 0);
    const searchIdx = o.length;

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = (current + (e.key === 'ArrowDown' ? 1 : -1) + total) % total;
      if (searchSec && next === searchIdx) {
        setActive(-1);
        searchSec.classList.add('active');
        searchSec.querySelector('input').focus();
        current = searchIdx;
      } else {
        searchSec?.classList.remove('active');
        setActive(next);
        heroTerminal.focus();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (current < searchIdx) openItemModal(current);
    }
  });

  function dismissIntro() {
    document.removeEventListener('keydown', dismissIntro);
    introEl.classList.add('hidden');
    setTimeout(() => { contentEl.classList.add('visible'); buildMain(); heroTerminal.focus(); }, 300);
  }

  const QUESTION = "What's cooking?";
  let charIdx = 0;
  const charTimer = setInterval(() => {
    charIdx++;
    asciiEl.innerHTML = QUESTION.slice(0, charIdx).replace('\n', '<br>') + '<span class="terminal-cursor">▌</span>';
    if (charIdx >= QUESTION.length) {
      clearInterval(charTimer);
      hintEl.classList.add('show');
      document.addEventListener('keydown', dismissIntro);
    }
  }, 45);
}

// ── News sidebar: auto-populate from news.html ──
const newsPanel = document.querySelector('.news-panel');
if (newsPanel) {
  fetch('pages/news.html')
    .then(r => r.text())
    .then(html => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const items = Array.from(doc.querySelectorAll('.news-item'));
      const blocks = items.slice(0, 4).map(item => {
        const date = item.querySelector('.news-date')?.textContent.trim() || '';
        const lis = Array.from(item.querySelectorAll('ul.news-text li')).map(li => {
          li.querySelectorAll('a[href]').forEach(a => {
            const href = a.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#')) {
              a.setAttribute('href', 'pages/' + href);
            }
          });
          return `<li>${li.innerHTML}</li>`;
        }).join('');
        if (!lis) return '';
        return `<div class="news-panel-item"><span class="news-panel-date">${date}</span><ul class="news-panel-text">${lis}</ul></div>`;
      }).filter(Boolean).join('');
      if (blocks) newsPanel.innerHTML = blocks;
    })
    .catch(() => {});
}

// ── Member page: paginate publications list ─────
const memberPubList = document.getElementById('member-pub-list');
if (memberPubList) {
  const PAGE_SIZE = 10;
  const items = Array.from(memberPubList.querySelectorAll(':scope > .pub-item'));
  const totalPages = Math.ceil(items.length / PAGE_SIZE);
  if (totalPages > 1) {
    let page = 0;
    const pager = document.createElement('div');
    pager.className = 'pub-pagination';
    pager.innerHTML =
      `<button class="pub-page-arrow" aria-label="Previous page">‹</button>` +
      `<span class="pub-page-indicator"></span>` +
      `<button class="pub-page-arrow" aria-label="Next page">›</button>`;
    memberPubList.after(pager);

    const [prevBtn, nextBtn] = pager.querySelectorAll('.pub-page-arrow');
    const indicator = pager.querySelector('.pub-page-indicator');

    function renderPage() {
      items.forEach((el, i) => {
        el.style.display = (i >= page * PAGE_SIZE && i < (page + 1) * PAGE_SIZE) ? '' : 'none';
      });
      indicator.textContent = `Page ${page + 1} of ${totalPages}`;
      prevBtn.disabled = page === 0;
      nextBtn.disabled = page === totalPages - 1;
    }
    prevBtn.addEventListener('click', () => { if (page > 0) { page--; renderPage(); pager.scrollIntoView({ block: 'nearest' }); } });
    nextBtn.addEventListener('click', () => { if (page < totalPages - 1) { page++; renderPage(); pager.scrollIntoView({ block: 'nearest' }); } });
    renderPage();
  }
}

// ── Publication / news year filters ─────────────
document.querySelectorAll('.filter-bar').forEach(bar => {
  bar.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      const listId = bar.dataset.target;
      document.querySelectorAll(`#${listId} [data-filter-val]`).forEach(item => {
        const match = filter === 'all' || item.dataset.filterVal === filter;
        item.style.display = match ? '' : 'none';
      });
    });
  });
});
