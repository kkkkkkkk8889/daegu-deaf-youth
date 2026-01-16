const menuToggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('main-nav');
const header = document.querySelector('.site-header');
const backToTop = document.querySelector('.back-to-top');
let currentUser = null;
let baseNewsItems = [];
let newsItems = [];
const newsStorageKey = 'userNewsItems';
const adminEmails = []; // 관리자 이메일을 추가하세요 (예: ['admin@example.com'])
const blacklistEmails = []; // 차단 이메일을 추가하세요

const contactForm = document.getElementById('contact-form');
let targetEmail = 'dgdeaf04@gmail.com';
const galleryGrid = document.getElementById('gallery-grid');
const eventsGrid = document.getElementById('events-grid');
const newsCards = document.getElementById('news-cards');
const newsTable = document.getElementById('news-list');
const eventCalendarList = document.getElementById('event-calendar-list');
const newsForm = document.getElementById('news-form');
const contactBoard = document.getElementById('contact-board');
const contactBoardForm = document.getElementById('contact-board-form');
const contactCount = document.getElementById('contact-count');
const contactAdminList = document.getElementById('contact-admin-list');
const authToggle = document.getElementById('auth-toggle');
const authToggleButtons = document.querySelectorAll('[data-auth-toggle]');
const authStatus = document.getElementById('auth-status');
const authModal = document.getElementById('auth-modal');
const authModalClose = document.getElementById('auth-modal-close');
const authModalProceed = document.getElementById('auth-modal-proceed');
const galleryLightbox = document.getElementById('gallery-lightbox');
const galleryLightboxImage = document.getElementById('gallery-lightbox-image');
const galleryLightboxClose = document.getElementById('gallery-lightbox-close');
const highlightShots = document.querySelectorAll('.highlight-shot');
const highlightImages = document.querySelectorAll('.highlight-image');
const supportImages = document.querySelectorAll('.support-image');
const revealSections = document.querySelectorAll('.reveal');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

window.addEventListener('load', () => {
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.classList.add('is-animated');
  }
});

window.addEventListener('scroll', () => {
  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 8);
  }
  if (backToTop) {
    backToTop.classList.toggle('show', window.scrollY > 300);
  }
});

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = contactForm.querySelector('#name').value.trim();
    const email = contactForm.querySelector('#email').value.trim();
    const message = contactForm.querySelector('#message').value.trim();

    const subject = encodeURIComponent('[대구농아청년회 문의]');
    const body = encodeURIComponent(`이름: ${name}\n이메일: ${email}\n내용:\n${message}`);
    window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
  });
}

const toggleButtons = document.querySelectorAll('[data-toggle]');

toggleButtons.forEach((button) => {
  if (!button.hasAttribute('type')) {
    button.setAttribute('type', 'button');
  }

  button.addEventListener('click', () => {
    const target = button.dataset.toggle;

    if (target === 'gallery') {
      document.querySelectorAll('.gallery-card.gallery-extra').forEach((card) => {
        card.classList.toggle('is-hidden');
      });
      const opened = !document.querySelector('.gallery-card.gallery-extra.is-hidden');
      button.textContent = opened ? '갤러리 접기 -' : '갤러리 더보기 +';
    }

    if (target === 'calendar') {
      const cal = document.getElementById('event-calendar');
      if (cal) {
        cal.classList.toggle('is-hidden');
        const opened = !cal.classList.contains('is-hidden');
        button.textContent = opened ? '캘린더 접기 -' : '캘린더로 보기 +';
      }
    }

    if (target === 'news-list') {
      const newsList = document.getElementById('news-list');
      if (newsList) {
        newsList.classList.toggle('is-hidden');
        const opened = !newsList.classList.contains('is-hidden');
        button.textContent = opened ? '소식 접기 -' : '소식 더보기 +';
      }
    }
  });
});

function updateAuthUI() {
  if (!authStatus) return;
  if (currentUser) {
    authStatus.textContent = `${currentUser.email} 로그인됨. 본인 글만 삭제 가능합니다.`;
    authToggleButtons.forEach((btn) => {
      btn.textContent = '로그아웃';
    });
    if (authToggle) authToggle.textContent = '로그아웃';
  } else {
    authStatus.textContent = '비회원 상태입니다. 로그인하면 본인이 올린 후기만 삭제할 수 있습니다.';
    authToggleButtons.forEach((btn) => {
      btn.textContent = '로그인';
    });
    if (authToggle) authToggle.textContent = '로그인';
  }
}

function openAuthModal() {
  if (!authModal) return;
  authModal.classList.remove('is-hidden');
}

function closeAuthModal() {
  if (!authModal) return;
  authModal.classList.add('is-hidden');
}

function openLightbox(src, altText) {
  if (!galleryLightbox || !galleryLightboxImage) return;
  galleryLightboxImage.src = src;
  galleryLightboxImage.alt = altText || '';
  galleryLightbox.classList.remove('is-hidden');
}

function closeLightbox() {
  if (!galleryLightbox || !galleryLightboxImage) return;
  galleryLightbox.classList.add('is-hidden');
  galleryLightboxImage.src = '';
  galleryLightboxImage.alt = '';
}

if (newsForm) {
  newsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = newsForm.querySelector('#news-title').value.trim();
    const author = newsForm.querySelector('#news-author').value.trim();
    const imageInput = newsForm.querySelector('#news-image');
    const body = newsForm.querySelector('#news-body').value.trim();
    if (!title || !author || !body) return;

    const email = currentUser?.email || '';
    if (email && blacklistEmails.includes(email)) {
      alert('차단된 계정입니다. 입력할 수 없습니다.');
      return;
    }

    const file = imageInput?.files?.[0];
    const today = new Date().toISOString().slice(0, 10);

    const saveNewsItem = (imageData) => {
      const newItem = {
        title,
        author,
        date: today,
        summary: body,
        type: '후기',
        pinned: false,
        authorEmail: email,
        image: imageData || '',
      };
      const saved = JSON.parse(localStorage.getItem(newsStorageKey) || '[]');
      saved.unshift(newItem);
      localStorage.setItem(newsStorageKey, JSON.stringify(saved));
      newsItems = mergeNews(baseNewsItems, saved);
      renderNews(newsItems);
      newsForm.reset();
    };

    if (file) {
      const reader = new FileReader();
      reader.onload = () => saveNewsItem(reader.result);
      reader.onerror = () => {
        alert('사진을 불러오는 중 오류가 발생했습니다.');
      };
      reader.readAsDataURL(file);
    } else {
      saveNewsItem('');
    }
  });
}

async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`fetch failed: ${path}`);
  return res.json();
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (!el || text === undefined || text === null) return;
  el.textContent = text;
}

function renderSimpleList(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container || !Array.isArray(items)) return;
  container.innerHTML = '';
  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item.text || item;
    container.appendChild(li);
  });
}

function renderPrograms(items) {
  const container = document.getElementById('programs-grid');
  if (!container || !Array.isArray(items)) return;
  container.innerHTML = '';
  items.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'card program';
    card.innerHTML = `
      <div class="badge">${item.badge || ''}</div>
      <h3>${item.title || ''}</h3>
      <p>${item.body || ''}</p>
    `;
    container.appendChild(card);
  });
}

function renderJoin(items) {
  const container = document.getElementById('join-grid');
  if (!container || container.dataset.static === 'true' || !Array.isArray(items)) return;
  container.innerHTML = '';
  items.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'card';
    const bullets = Array.isArray(item.bullets) ? item.bullets : [];
    card.innerHTML = `
      <h3>${item.title || ''}</h3>
      <p>${item.body || ''}</p>
      ${bullets.length ? `<ul class="icon-list">${bullets
        .map((b) => `<li>${b.text || b}</li>`)
        .join('')}</ul>` : ''}
    `;
    container.appendChild(card);
  });
}

function renderFaq(items) {
  const container = document.getElementById('faq-list');
  if (!container || !Array.isArray(items)) return;
  container.innerHTML = '';
  items.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'faq-item';
    card.innerHTML = `
      <h3>${item.question || ''}</h3>
      <p>${item.answer || ''}</p>
    `;
    container.appendChild(card);
  });
}

function renderSiteContent(site) {
  if (!site) return;
  if (site.hero) {
    setText('hero-title', site.hero.title);
    setText('hero-lead', site.hero.lead);
    setText('hero-cta-primary', site.hero.primaryCta);
    setText('hero-cta-secondary', site.hero.secondaryCta);
  }
  if (site.about) {
    setText('about-title', site.about.heading);
    setText('about-body', site.about.body);
  }
  if (site.vision) {
    setText('vision-title', site.vision.title);
    setText('vision-body', site.vision.body);
    renderSimpleList('vision-list', site.vision.items);
  }
  if (site.work) {
    setText('work-title', site.work.title);
    setText('work-body', site.work.body);
    renderSimpleList('work-list', site.work.items);
  }
  if (site.programs) {
    setText('programs-title', site.programs.heading);
    setText('programs-body', site.programs.body);
    renderPrograms(site.programs.items);
  }
  if (site.gallery) {
    setText('gallery-title', site.gallery.heading);
    setText('gallery-body', site.gallery.body);
    setText('gallery-note', site.gallery.ctaNote);
    setText('gallery-button', site.gallery.ctaButton);
  }
  if (site.events) {
    setText('events-title', site.events.heading);
    setText('events-body', site.events.body);
    setText('events-note', site.events.ctaNote);
    setText('events-contact-button', site.events.contactButton);
    setText('events-calendar-button', site.events.calendarButton);
  }
  if (site.join) {
    setText('join-title', site.join.heading);
    setText('join-body', site.join.body);
    setText('join-note', site.join.ctaNote);
    setText('join-button', site.join.ctaButton);
    renderJoin(site.join.items);
  }
  if (site.news) {
    setText('news-title', site.news.heading);
    setText('news-body', site.news.body);
    setText('news-note', site.news.ctaNote);
    setText('news-button', site.news.ctaButton);
    setText('news-form-title', site.news.formTitle);
    setText('news-form-intro', site.news.formIntro);
    setText('news-form-help', site.news.formHelp);
  }
  if (site.faq) {
    setText('faq-title', site.faq.heading);
    renderFaq(site.faq.items);
  }
  if (site.contact) {
    setText('contact-title', site.contact.heading);
    setText('contact-body', site.contact.body);
    const email = site.contact.email;
    const phone = site.contact.phone;
    const address = site.contact.address;
    const emailEl = document.getElementById('contact-email');
    const phoneEl = document.getElementById('contact-phone');
    const addressEl = document.getElementById('contact-address');
    if (emailEl && email) {
      emailEl.textContent = email;
      emailEl.href = `mailto:${email}`;
      targetEmail = email;
    }
    if (phoneEl && phone) {
      phoneEl.textContent = phone;
      phoneEl.href = `tel:${phone.replace(/[^0-9+]/g, '')}`;
    }
    if (addressEl && address) {
      addressEl.textContent = address;
    }
    setText('contact-map-button', site.contact.mapButton);
    setText('contact-form-title', site.contact.formTitle);
    setText('contact-form-help', site.contact.formHelp);
  }
}

function renderGallery(items) {
  if (!galleryGrid) return;
  const showAll = galleryGrid.dataset.showAll === 'true';
  galleryGrid.innerHTML = '';
  items.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'gallery-card';
    if (!showAll && idx >= 3) {
      card.classList.add('gallery-extra', 'is-hidden');
    }
    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}" loading="lazy">
      <p class="gallery-caption">${item.title}${item.caption ? ` - ${item.caption}` : ''}</p>
    `;
    const image = card.querySelector('img');
    if (image) {
      image.addEventListener('click', () => {
        openLightbox(item.image, item.title);
      });
    }
    galleryGrid.appendChild(card);
  });
}

function renderEvents(items) {
  if (!eventsGrid) return;
  eventsGrid.innerHTML = '';
  items.slice(0, 2).forEach((item) => {
    const card = document.createElement('div');
    card.className = 'card event';
    card.innerHTML = `
      <div class="badge accent">${item.category || '행사'}</div>
      <h3>${item.title}</h3>
      <p>${item.datetime}</p>
      <p class="meta">장소: ${item.location}</p>
    `;
    eventsGrid.appendChild(card);
  });
}

function getEventTimestamp(item) {
  const date = new Date(item.datetime);
  if (Number.isNaN(date.getTime())) return Number.POSITIVE_INFINITY;
  return date.getTime();
}

function renderEventCalendar(items) {
  if (!eventCalendarList) return;
  eventCalendarList.innerHTML = '';
  if (!items.length) {
    eventCalendarList.textContent = '등록된 행사가 없습니다.';
    return;
  }
  const list = document.createElement('div');
  list.className = 'event-calendar-list';
  items.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'event-calendar-row';
    row.innerHTML = `
      <div class="event-calendar-title">${item.title}</div>
      <div class="event-calendar-meta">${item.datetime} · ${item.location}</div>
      <div class="event-calendar-tag">${item.category || '행사'}</div>
    `;
    list.appendChild(row);
  });
  eventCalendarList.appendChild(list);
}

function renderNews(items) {
  const sorted = [...(items || [])].sort(
    (a, b) => Number(b.pinned || false) - Number(a.pinned || false)
  );

  if (newsCards) {
    newsCards.innerHTML = '';
    sorted.slice(0, 2).forEach((item) => {
      const typeLabel = item.pinned ? `📌 ${item.type || '소식'}` : item.type || '소식';
      const card = document.createElement('div');
      card.className = 'card news';
      card.innerHTML = `
        <div class="badge ${item.pinned ? 'pin' : ''}">${typeLabel}</div>
        <h3>${item.title}</h3>
        ${item.image ? `<img class="news-image" src="${item.image}" alt="${item.title}">` : ''}
        <p>${item.summary || ''}</p>
        <p class="meta">게시: ${item.date} · ${item.author || ''}</p>
      `;
      newsCards.appendChild(card);
    });
  }

  if (newsTable) {
    const rows = newsTable.querySelectorAll('.news-row.data');
    rows.forEach((r) => r.remove());
    sorted.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = 'news-row data';
      if (item.pinned) row.classList.add('pinned');
      const typeLabel = item.type || '소식';
      const numberLabel = `${idx + 1}`;
      const canDelete =
        currentUser &&
        (adminEmails.includes(currentUser.email) ||
          (item.authorEmail && item.authorEmail === currentUser.email));
      row.innerHTML = `
        <div>${item.pinned ? '📌 ' : ''}${typeLabel} ${numberLabel}</div>
        <div>${item.title}</div>
        <div>${item.author || ''}</div>
        <div>${item.date || ''}</div>
        ${canDelete ? '<button class="news-delete" type="button" aria-label="소식 삭제">삭제</button>' : ''}
      `;
      newsTable.appendChild(row);
    });

    newsTable.querySelectorAll('.news-row.data').forEach((row, i) => {
      row.setAttribute('tabindex', '0');
      row.dataset.summary = sorted[i]?.summary || '';
      row.dataset.image = sorted[i]?.image || '';
      row.addEventListener('click', () => toggleNewsSummary(row));
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleNewsSummary(row);
        }
      });
      const delBtn = row.querySelector('.news-delete');
      if (delBtn) {
        delBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          removeNewsItem(sorted[i]);
        });
      }
    });
  }
}

const contactBoardStorageKey = 'contactBoardItems';
const contactBoardSeed = [
  {
    id: 3,
    title: '주소는 어디인가요',
    author: '관리자',
    date: '2026-01-12',
    status: '답변완료',
    questionBody: '대구농아청년회 주소가 궁금합니다.',
    answer: '대구 중구 농아인회관 3층입니다. 오시는 길은 카카오맵에서 확인하세요.',
    link: 'https://place.map.kakao.com/20265618',
  },
  {
    id: 2,
    title: '대구농아청년회는 어떤 곳인가요?',
    author: '관리자',
    date: '2026-01-03',
    status: '답변완료',
    questionBody: '어떤 활동을 하는지 알려주세요.',
    answer: '청각장애 청년을 위한 교육, 문화, 권익 활동을 함께하는 청년 커뮤니티입니다.',
  },
  {
    id: 1,
    title: '연락 문의는 어디로 하면 되나요?',
    author: '관리자',
    date: '2026-01-02',
    status: '답변완료',
    questionBody: '문의 방법이 궁금합니다.',
    answer: '카카오톡 채널로 문의해 주시면 가장 빠르게 답변드립니다.',
    link: 'https://pf.kakao.com/_YbyhM',
  },
];

function loadContactBoardItems() {
  const saved = JSON.parse(localStorage.getItem(contactBoardStorageKey) || '[]');
  if (Array.isArray(saved) && saved.length) {
    return saved;
  }
  return contactBoardSeed;
}

function saveContactBoardItems(items) {
  localStorage.setItem(contactBoardStorageKey, JSON.stringify(items));
}

function renderContactBoard(items) {
  if (!contactBoard) return;
  const list = [...(items || [])].sort((a, b) => (b.id || 0) - (a.id || 0));
  contactBoard.innerHTML = '';
  if (contactCount) contactCount.textContent = String(list.length);

  list.forEach((item) => {
    const details = document.createElement('details');
    details.className = 'contact-row';
    const statusText = item.status || '답변대기';
    const statusClass = statusText === '답변대기' ? 'pending' : '';
    const questionText = item.questionBody || '';
    const answerText = item.answer || '';
    const linkMarkup = item.link
      ? ` <a href="${item.link}" target="_blank" rel="noopener">바로가기</a>`
      : '';

    details.innerHTML = `
      <summary>
        <span class="contact-number">${item.id || ''}</span>
        <span class="contact-title">${item.title || ''}</span>
        <span class="contact-meta">${(item.date || '').replace(/-/g, '.')} · ${item.author || ''}</span>
        <span class="contact-status ${statusClass}">${statusText}</span>
      </summary>
      <div class="contact-answer">
        ${questionText ? `<strong>문의 내용:</strong> ${questionText}<br>` : ''}
        <strong>답변:</strong> ${answerText || '답변 준비중입니다.'}${linkMarkup}
      </div>
    `;
    contactBoard.appendChild(details);
  });
}

function renderContactAdmin(items) {
  if (!contactAdminList) return;
  const list = [...(items || [])].sort((a, b) => (b.id || 0) - (a.id || 0));
  contactAdminList.innerHTML = '';

  list.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'card';
    const statusText = item.status || '답변대기';
    card.innerHTML = `
      <h3>#${item.id || ''} ${item.title || ''}</h3>
      <p class="meta">${(item.date || '').replace(/-/g, '.')} · ${item.author || ''}</p>
      <p><strong>문의 내용:</strong> ${item.questionBody || ''}</p>
      <label for="answer-${item.id}">답변</label>
      <textarea id="answer-${item.id}" rows="3">${item.answer || ''}</textarea>
      <label for="status-${item.id}">상태</label>
      <select id="status-${item.id}">
        <option value="답변대기"${statusText === '답변대기' ? ' selected' : ''}>답변대기</option>
        <option value="답변완료"${statusText === '답변완료' ? ' selected' : ''}>답변완료</option>
      </select>
      <div class="contact-admin-actions">
        <button type="button" class="btn primary" data-contact-save="${item.id}">저장</button>
        <button type="button" class="btn ghost" data-contact-delete="${item.id}">삭제</button>
      </div>
    `;
    contactAdminList.appendChild(card);
  });

  contactAdminList.querySelectorAll('[data-contact-save]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.contactSave || 0);
      const answer = contactAdminList.querySelector(`#answer-${id}`)?.value.trim();
      const status = contactAdminList.querySelector(`#status-${id}`)?.value;
      const updated = list.map((item) =>
        item.id === id ? { ...item, answer, status } : item
      );
      saveContactBoardItems(updated);
      renderContactAdmin(updated);
      renderContactBoard(updated);
    });
  });

  contactAdminList.querySelectorAll('[data-contact-delete]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.contactDelete || 0);
      if (!window.confirm('해당 문의를 삭제할까요?')) return;
      const updated = list.filter((item) => item.id !== id);
      saveContactBoardItems(updated);
      renderContactAdmin(updated);
      renderContactBoard(updated);
    });
  });
}

async function initData() {
  try {
    const [galleryData, eventsData, newsData, siteData] = await Promise.all([
      loadJSON('assets/data/gallery.json'),
      loadJSON('assets/data/events.json'),
      loadJSON('assets/data/news.json'),
      loadJSON('assets/data/site.json').catch(() => null),
    ]);
    const galleryItems = galleryData.items || [];
    const eventItems = eventsData.items || [];
    const sortedEvents = [...eventItems].sort(
      (a, b) => getEventTimestamp(a) - getEventTimestamp(b)
    );
    renderGallery(galleryItems);
    renderEvents(sortedEvents);
    renderEventCalendar(sortedEvents);
    const saved = JSON.parse(localStorage.getItem(newsStorageKey) || '[]');
    baseNewsItems = newsData.items || [];
    newsItems = mergeNews(baseNewsItems, saved);
    renderNews(newsItems);
    renderSiteContent(siteData);
  } catch (err) {
    console.error('데이터 불러오기 실패', err);
  }
}

initData();

function initContactBoard() {
  if (!contactBoard) return;
  let items = loadContactBoardItems();
  renderContactBoard(items);

  if (contactBoardForm) {
    contactBoardForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const title = contactBoardForm.querySelector('#contact-title').value.trim();
      const author = contactBoardForm.querySelector('#contact-author').value.trim();
      const body = contactBoardForm.querySelector('#contact-body').value.trim();
      if (!title || !author || !body) return;

      const nextId =
        items.reduce((maxId, item) => Math.max(maxId, item.id || 0), 0) + 1;
      const today = new Date().toISOString().slice(0, 10);
      const newItem = {
        id: nextId,
        title,
        author,
        date: today,
        status: '답변대기',
        questionBody: body,
        answer: '',
      };

      items = [newItem, ...items];
      saveContactBoardItems(items);
      renderContactBoard(items);
      contactBoardForm.reset();
    });
  }
}

initContactBoard();

function initContactAdmin() {
  if (!contactAdminList) return;
  const items = loadContactBoardItems();
  renderContactAdmin(items);
}

initContactAdmin();

function toggleNewsSummary(row) {
  const existing = row.nextElementSibling;
  if (existing && existing.classList.contains('news-summary')) {
    existing.remove();
    return;
  }
  const summary = row.dataset.summary;
  const image = row.dataset.image;
  if (!summary) return;
  const summaryRow = document.createElement('div');
  summaryRow.className = 'news-summary';
  summaryRow.innerHTML = `
    <div class="news-summary-body">${summary}</div>
    ${image ? `<img class="news-image" src="${image}" alt="후기 사진">` : ''}
  `;
  row.insertAdjacentElement('afterend', summaryRow);
}

function mergeNews(base, saved) {
  return [...(base || []), ...(saved || [])];
}

function removeNewsItem(item) {
  const saved = JSON.parse(localStorage.getItem(newsStorageKey) || '[]');
  const filtered = saved.filter((s) => !(s.title === item.title && s.date === item.date));
  localStorage.setItem(newsStorageKey, JSON.stringify(filtered));
  newsItems = mergeNews(baseNewsItems, filtered);
  renderNews(newsItems);
}

// Netlify Identity 로그인/로그아웃
function initIdentity() {
  if (!window.netlifyIdentity) return;
  window.netlifyIdentity.on('init', (user) => {
    currentUser = user;
    updateAuthUI();
    renderNews(newsItems);
  });
  window.netlifyIdentity.on('login', (user) => {
    currentUser = user;
    updateAuthUI();
    renderNews(newsItems);
  });
  window.netlifyIdentity.on('logout', () => {
    currentUser = null;
    updateAuthUI();
    renderNews(newsItems);
  });
  window.netlifyIdentity.init();
}

authToggleButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (currentUser) {
      if (window.netlifyIdentity) {
        window.netlifyIdentity.logout();
      }
      return;
    }
    openAuthModal();
  });
});

if (authModalClose) {
  authModalClose.addEventListener('click', closeAuthModal);
}

if (authModal && authModalProceed) {
  authModalProceed.addEventListener('click', () => {
    closeAuthModal();
    if (window.netlifyIdentity) {
      window.netlifyIdentity.open();
    } else {
      alert('Netlify Identity가 아직 설정되어 있지 않습니다. 배포 후 Identity를 활성화해 주세요.');
    }
  });
  authModal.addEventListener('click', (event) => {
    if (event.target === authModal) {
      closeAuthModal();
    }
  });
}

if (galleryLightboxClose) {
  galleryLightboxClose.addEventListener('click', closeLightbox);
}

if (galleryLightbox) {
  galleryLightbox.addEventListener('click', (event) => {
    if (event.target === galleryLightbox) {
      closeLightbox();
    }
  });
}

if (highlightShots.length) {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    highlightShots.forEach((shot) => observer.observe(shot));
  } else {
    highlightShots.forEach((shot) => shot.classList.add('is-visible'));
  }
}

if (highlightImages.length) {
  highlightImages.forEach((image) => {
    image.addEventListener('click', () => {
      openLightbox(image.src, image.alt || '');
    });
  });
}

if (supportImages.length) {
  supportImages.forEach((image) => {
    image.addEventListener('click', () => {
      openLightbox(image.src, image.alt || '');
    });
  });
}

if (revealSections.length) {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );
    revealSections.forEach((section) => observer.observe(section));
  } else {
    revealSections.forEach((section) => section.classList.add('is-visible'));
  }
}

const popTargets = document.querySelectorAll('.org-chart-pop');
if (popTargets.length) {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    popTargets.forEach((target) => observer.observe(target));
  } else {
    popTargets.forEach((target) => target.classList.add('is-visible'));
  }
}

initIdentity();
