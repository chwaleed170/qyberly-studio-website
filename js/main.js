/* QYBERLY / Interactions. Vanilla JavaScript, no dependencies. */
(() => {
  'use strict';
  document.documentElement.classList.add('js-ready');

  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.primary-nav');
  const closeNav = () => {
    if (!navToggle || !nav) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation');
    nav.classList.remove('is-open');
    document.body.classList.remove('nav-open');
  };
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = navToggle.getAttribute('aria-expanded') !== 'true';
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeNav(); });
    document.addEventListener('click', event => {
      if (nav.classList.contains('is-open') && !nav.contains(event.target) && !navToggle.contains(event.target)) closeNav();
    });
  }

  const progress = document.getElementById('reading-progress-bar');
  const backTop = document.querySelector('.back-top');
  const updateScrollUI = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    if (progress) progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
    if (backTop) backTop.classList.toggle('is-visible', window.scrollY > 620);
  };
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  updateScrollUI();
  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(el => observer.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add('is-visible'));
  }

  // Services: accessible tab switcher.
  const serviceTabs = [...document.querySelectorAll('[data-service-tab]')];
  const servicePanels = [...document.querySelectorAll('[data-service-panel]')];
  const activateService = key => {
    serviceTabs.forEach(tab => {
      const active = tab.dataset.serviceTab === key;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    servicePanels.forEach(panel => {
      const active = panel.dataset.servicePanel === key;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });
  };
  serviceTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateService(tab.dataset.serviceTab));
    tab.addEventListener('keydown', event => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % serviceTabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + serviceTabs.length) % serviceTabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = serviceTabs.length - 1;
      serviceTabs[next].focus();
      activateService(serviceTabs[next].dataset.serviceTab);
    });
  });

  const initialServiceHash = window.location.hash.slice(1);
  if (serviceTabs.some(tab => tab.dataset.serviceTab === initialServiceHash)) activateService(initialServiceHash);

  // FAQ accordions: one open at a time per list.
  document.querySelectorAll('.faq-trigger').forEach(button => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      const answer = button.nextElementSibling;
      const list = button.closest('.faq-list');
      list?.querySelectorAll('.faq-trigger').forEach(other => {
        other.setAttribute('aria-expanded', 'false');
        const panel = other.nextElementSibling;
        if (panel) panel.hidden = true;
      });
      if (!expanded) {
        button.setAttribute('aria-expanded', 'true');
        if (answer) answer.hidden = false;
      }
    });
  });

  // Portfolio filtering and accessible case-study dialog.
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const portfolioCards = [...document.querySelectorAll('.portfolio-card[data-category]')];
  const count = document.getElementById('visible-project-count');
  filterButtons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    let visible = 0;
    portfolioCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.hidden = !show;
      if (show) visible++;
    });
    if (count) count.textContent = String(visible).padStart(2, '0');
  }));

  const cases = {
    nova: {
      category: 'WEB / COMMERCE EXPERIENCE', title: 'NOVA. A storefront with a point of view.',
      summary: 'A self-initiated concept exploring how a focused product story, calm hierarchy and considered product discovery could come together in a small commerce experience.',
      challenge: 'Make a product-led storefront feel distinctive without overwhelming the visitor with competing promotions, dense navigation or visual noise.',
      direction: 'Use a clear editorial rhythm, intentional product framing, concise copy and a straightforward path from discovery to action.',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1100&q=85', alt: 'Design workspace used as visual reference for a commerce concept'
    },
    form: {
      category: 'IDENTITY / VISUAL SYSTEM', title: 'FORM. Recognition through restraint.',
      summary: 'A self-initiated identity direction built around a clear typographic voice, flexible graphic elements and a visual system that can extend across digital touchpoints.',
      challenge: 'Create a recognisable visual language that stays consistent across formats while leaving room for different campaigns and messages.',
      direction: 'Pair a strong typographic foundation with a restrained palette, modular layouts and repeatable social and presentation assets.',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1100&q=85', alt: 'Abstract design photograph used as reference for identity exploration'
    },
    frame: {
      category: 'MOTION / CAMPAIGN DIRECTION', title: 'FRAME. Make the first second count.',
      summary: 'A self-initiated motion direction exploring how an opening frame, pacing, captions and visual contrast can help a short-form message land quickly.',
      challenge: 'Keep a short promotional edit engaging while making the core message understandable with or without sound.',
      direction: 'Lead with the strongest visual, keep the message focused, use readable captions and build a clear rhythm from opening hook to final action.',
      image: 'https://images.unsplash.com/photo-1781127445140-969397fa151c?auto=format&fit=crop&w=1100&q=85', alt: 'Professional film crew photograph used as visual reference for motion direction'
    },
    qyberly: {
      category: 'STUDIO / BRAND SYSTEM', title: 'QYBERLY. A connected studio identity.',
      summary: 'The studio’s own identity system: a geometric Q monogram, a precise wordmark, a restrained palette and a consistent voice across the website and business communications.',
      challenge: 'Create a flexible identity that can represent web development, visual design and video production without becoming tied to a single service.',
      direction: 'Build around the Q monogram and a deep navy foundation, using electric violet as a controlled brand accent and clear typographic hierarchy.',
      image: '', alt: ''
    }
  };
  const dialog = document.getElementById('case-dialog');
  const closeDialog = dialog?.querySelector('.dialog-close');
  document.querySelectorAll('[data-case]').forEach(button => button.addEventListener('click', () => {
    const item = cases[button.dataset.case];
    if (!item || !dialog) return;
    document.getElementById('case-category').textContent = item.category;
    document.getElementById('case-title').textContent = item.title;
    document.getElementById('case-summary').textContent = item.summary;
    document.getElementById('case-challenge').textContent = item.challenge;
    document.getElementById('case-direction').textContent = item.direction;
    const visual = document.getElementById('case-visual');
    visual.innerHTML = item.image ? `<img src="${item.image}" alt="${item.alt}">` : '<div class="modal-brand-symbol" aria-label="QYBERLY geometric monogram">Q</div>';
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    closeDialog?.focus();
  }));
  closeDialog?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });


  // Portfolio live search works together with the category filters.
  const portfolioSearch = document.getElementById('portfolio-search');
  if (portfolioSearch) {
    const cards = [...document.querySelectorAll('.portfolio-card[data-category]')];
    const activeFilter = () => document.querySelector('[data-filter].is-active')?.dataset.filter || 'all';
    const updatePortfolioSearch = () => {
      const term = portfolioSearch.value.trim().toLowerCase();
      let visible = 0;
      cards.forEach(card => {
        const matchesFilter = activeFilter() === 'all' || card.dataset.category === activeFilter();
        const matchesText = !term || card.textContent.toLowerCase().includes(term);
        card.hidden = !(matchesFilter && matchesText);
        if (!card.hidden) visible++;
      });
      const countEl = document.getElementById('visible-project-count');
      if (countEl) countEl.textContent = String(visible).padStart(2, '0');
    };
    portfolioSearch.addEventListener('input', updatePortfolioSearch);
    filterButtons.forEach(button => button.addEventListener('click', updatePortfolioSearch));
  }

  // Interactive service scope finder. Recommendations are guidance, never automated quotes.
  const scopeFinder = document.querySelector('.scope-finder');
  if (scopeFinder) {
    let goal = '';
    let priority = '';
    let step = 1;
    const goalConfig = {
      launch: { title:'A focused digital launch', copy:'Start with a clear website foundation and a visual direction that makes the offer easy to understand.', service:'web', deliverables:['Responsive landing page or small business website','Core page structure and clear calls to action','Basic on-page SEO and mobile checks'] },
      refresh: { title:'A considered brand and website refresh', copy:'Improve clarity, consistency and usability without rebuilding everything that already works.', service:'web', deliverables:['Website and content review','Updated visual direction and key page layouts','Responsive refinements and handover notes'] },
      content: { title:'A repeatable content system', copy:'Create a practical short-form content workflow with clear formats and consistent visual treatment.', service:'motion', deliverables:['Short-form video editing direction','Caption, pacing and format templates','A batch-ready content delivery structure'] },
      identity: { title:'A recognisable visual identity', copy:'Establish the visual foundations your website, social content and customer touchpoints can share.', service:'brand', deliverables:['Logo and visual direction refinement','Colour and typography system','Core social and digital brand assets'] }
    };
    const priorityCopy = {
      speed:"We will keep the first phase focused on the essentials so you can move towards a launch sooner.",
      quality:"We will give more attention to visual detail, consistency and refinement during the first phase.",
      continuity:"We will shape the scope around repeatable assets and a workflow that can support ongoing work."
    };
    const showStep = next => {
      step = next;
      scopeFinder.querySelectorAll('[data-scope-panel]').forEach(panel => panel.hidden = Number(panel.dataset.scopePanel) !== step);
      scopeFinder.querySelectorAll('[data-scope-step]').forEach(item => item.classList.toggle('is-active', Number(item.dataset.scopeStep) === step));
    };
    scopeFinder.querySelectorAll('[data-goal]').forEach(button => button.addEventListener('click', () => {
      goal = button.dataset.goal;
      scopeFinder.querySelectorAll('[data-goal]').forEach(item => item.classList.toggle('is-selected', item === button));
      showStep(2);
    }));
    scopeFinder.querySelectorAll('[data-priority]').forEach(button => button.addEventListener('click', () => {
      priority = button.dataset.priority;
      const config = goalConfig[goal];
      if (!config) return;
      document.getElementById('scope-result-title').textContent = config.title;
      document.getElementById('scope-result-copy').textContent = `${config.copy} ${priorityCopy[priority] || ''}`;
      const list = document.getElementById('scope-result-list');
      list.replaceChildren(...config.deliverables.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
      const link = document.getElementById('scope-contact-link');
      const details = encodeURIComponent(`I'm interested in: ${config.title}. Priority: ${priority}. Please help me refine this suggested scope.`);
      link.href = `contact.html?service=${config.service}&goal=${encodeURIComponent(goal)}&priority=${encodeURIComponent(priority)}&details=${details}`;
      showStep(3);
    }));
    scopeFinder.querySelectorAll('[data-scope-back]').forEach(button => button.addEventListener('click', () => showStep(step === 3 ? 2 : 1)));
    scopeFinder.querySelector('[data-scope-reset]')?.addEventListener('click', () => {
      goal = ''; priority = '';
      scopeFinder.querySelectorAll('.scope-choice').forEach(item => item.classList.remove('is-selected'));
      showStep(1);
    });
    scopeFinder.querySelectorAll('[data-goal]').forEach(button => button.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); button.click(); }
    }));
  }

  // Keyboard-driven quick navigation, available on every page.
  const palette = document.getElementById('command-palette');
  const paletteInput = document.getElementById('command-search-input');
  const paletteLinks = [...(palette?.querySelectorAll('.command-results a') || [])];
  const openPalette = () => {
    if (!palette) return;
    if (typeof palette.showModal === 'function') palette.showModal();
    else palette.setAttribute('open','');
    if (paletteInput) { paletteInput.value=''; paletteLinks.forEach(link => link.hidden=false); setTimeout(() => paletteInput.focus(), 20); }
  };
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openPalette(); }
    if (event.key === 'Escape' && palette?.open) palette.close();
  });
  paletteInput?.addEventListener('input', () => {
    const term = paletteInput.value.trim().toLowerCase();
    paletteLinks.forEach(link => link.hidden = !link.textContent.toLowerCase().includes(term));
  });
  palette?.addEventListener('click', event => { if (event.target === palette) palette.close(); });

  // Contact brief builder: local draft, copy and mailto handoff. No server falsely implied.
  const form = document.getElementById('brief-form');
  if (form) {
    const status = document.getElementById('form-status');
    const progressLabel = document.getElementById('form-progress-label');
    const progressFill = document.getElementById('form-progress-fill');
    const storageKey = 'qyberly_project_brief_v1';
    const fields = ['client-name', 'client-email', 'business-name', 'engagement', 'budget', 'timeline', 'project-details'];
    const serviceBoxes = [...form.querySelectorAll('input[name="service"]')];
    const setStatus = (message, kind='') => {
      status.textContent = message;
      status.classList.toggle('is-error', kind === 'error');
      status.classList.toggle('is-success', kind === 'success');
    };
    const values = () => {
      const val = id => document.getElementById(id)?.value.trim() || '';
      return {
        name: val('client-name'), email: val('client-email'), business: val('business-name'),
        services: serviceBoxes.filter(box => box.checked).map(box => box.value),
        engagement: val('engagement') || 'Not sure yet', budget: val('budget') || 'Not decided', timeline: val('timeline') || 'Flexible', details: val('project-details')
      };
    };
    const makeBrief = data => [
      'QYBERLY PROJECT ENQUIRY', '',
      `Name: ${data.name || 'Not provided'}`,
      `Email: ${data.email || 'Not provided'}`,
      `Business / brand: ${data.business || 'Not provided'}`,
      `Services: ${data.services.length ? data.services.join(', ') : 'Not selected'}`,
      `Engagement type: ${data.engagement}`,
      `Estimated budget: ${data.budget}`, 
      `Preferred timeline: ${data.timeline}`, '',
      'PROJECT DETAILS', data.details || 'Not provided', '',
      'Sent via the QYBERLY website project brief builder.'
    ].join('\n');
    const updateProgress = () => {
      const data = values();
      const checks = [!!data.name, !!data.email, !!data.services.length, !!data.details];
      const amount = Math.round(checks.filter(Boolean).length / checks.length * 100);
      progressLabel.textContent = `${amount}% complete`;
      progressFill.style.width = `${amount}%`;
      try { localStorage.setItem(storageKey, JSON.stringify(data)); } catch (error) { /* Storage may be disabled by the browser. */ }
    };
    fields.forEach(id => { const field = document.getElementById(id); field?.addEventListener('input', updateProgress); field?.addEventListener('change', updateProgress); });
    serviceBoxes.forEach(box => box.addEventListener('change', () => {
      if (box.value === 'Not sure yet' && box.checked) serviceBoxes.filter(other => other !== box).forEach(other => other.checked = false);
      if (box.value !== 'Not sure yet' && box.checked) serviceBoxes.find(other => other.value === 'Not sure yet').checked = false;
      updateProgress();
    }));
    const params = new URLSearchParams(window.location.search);
    const preferredService = params.get('service');
    const plannerDetails = params.get('details');
    if (plannerDetails && !document.getElementById('project-details').value) document.getElementById('project-details').value = plannerDetails;

    const serviceMap = { web: 'Web development', brand: 'Graphic design', motion: 'Video production' };
    if (serviceMap[preferredService]) {
      const input = serviceBoxes.find(box => box.value === serviceMap[preferredService]);
      if (input) input.checked = true;
    }
    const saved = (() => { try { return JSON.parse(localStorage.getItem(storageKey) || 'null'); } catch (error) { return null; } })();
    if (saved) {
      if (!document.getElementById('client-name').value) document.getElementById('client-name').value = saved.name || '';
      if (!document.getElementById('client-email').value) document.getElementById('client-email').value = saved.email || '';
      if (!document.getElementById('business-name').value) document.getElementById('business-name').value = saved.business || '';
      if (!document.getElementById('project-details').value) document.getElementById('project-details').value = saved.details || '';
      serviceBoxes.forEach(box => box.checked = (saved.services || []).includes(box.value));
      if (saved.engagement) document.getElementById('engagement').value = saved.engagement;
      if (saved.budget) document.getElementById('budget').value = saved.budget;
      if (saved.timeline) document.getElementById('timeline').value = saved.timeline;
    }
    const engagementMap = { project: 'Focused project', sprint: 'Creative sprint', ongoing: 'Ongoing support' };
    if (engagementMap[params.get('engagement')]) document.getElementById('engagement').value = engagementMap[params.get('engagement')];
    const packageMap = {
      'digital-launch': { services: ['Web development'], details: 'I am interested in the Digital Launch pathway. Please help me scope a responsive business website.' },
      'brand-presence': { services: ['Graphic design'], details: 'I am interested in the Brand Presence pathway. Please help me scope a visual identity and creative asset system.' },
      'qyberly-360': { services: ['Web development', 'Graphic design', 'Video production'], details: 'I am interested in QYBERLY 360°. Please help me scope a connected website, brand identity and promotional creative launch.' }
    };
    const selectedPackage = packageMap[params.get('package')];
    if (selectedPackage) {
      serviceBoxes.forEach(box => box.checked = selectedPackage.services.includes(box.value));
      const detailsField = document.getElementById('project-details');
      if (!detailsField.value.trim()) detailsField.value = selectedPackage.details;
    }
    if (serviceMap[preferredService]) serviceBoxes.forEach(box => { box.checked = box.value === serviceMap[preferredService]; });
    updateProgress();
    document.getElementById('copy-brief')?.addEventListener('click', async () => {
      const brief = makeBrief(values());
      try {
        await navigator.clipboard.writeText(brief);
        setStatus('Your project brief has been copied. Paste it into an email or document when ready.', 'success');
      } catch (error) {
        const helper = document.createElement('textarea'); helper.value = brief; helper.setAttribute('readonly',''); helper.style.position='fixed'; helper.style.opacity='0'; document.body.appendChild(helper); helper.select();
        const copied = document.execCommand('copy'); helper.remove();
        setStatus(copied ? 'Your project brief has been copied.' : 'Copy was blocked by the browser. Select and copy the brief manually.', copied ? 'success' : 'error');
      }
    });
    document.getElementById('clear-brief')?.addEventListener('click', () => {
      form.reset();
      try { localStorage.removeItem(storageKey); } catch (error) { /* Storage may be disabled. */ }
      updateProgress(); setStatus('Your brief has been cleared from this form and this browser.', 'success');
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      const data = values();
      if (!data.name || !data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || !data.services.length || !data.details) {
        setStatus('Please add your name, a valid email, at least one service and a short project description.', 'error');
        form.querySelector(':invalid')?.focus();
        return;
      }
      const subject = encodeURIComponent(`Project enquiry from ${data.name} | QYBERLY`);
      const body = encodeURIComponent(makeBrief(data));
      setStatus('Your email app should open with the project brief ready. Review it and press Send in your email app.', 'success');
      window.location.href = `mailto:qyberly.studio@gmail.com?subject=${subject}&body=${body}`;
    });
  }
})();
