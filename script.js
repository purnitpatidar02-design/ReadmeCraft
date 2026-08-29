/* =================== ELEMENTS =================== */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const fields = {
  title: $('#projectTitle'),
  desc: $('#projectDesc'),
  author: $('#author'),
  github: $('#github'),
  repo: $('#repo'),
  license: $('#license'),
  install: $('#install'),
  usage: $('#usage'),
  features: $('#features-list'),
  version: $('#version'),
};

const renderedEl = $('#rendered');
const rawEl = $('#raw');

/* =================== LOCAL STORAGE =================== */
const STORAGE_KEY = 'readmeForgeData';

function saveState() {
  const state = {};
  Object.entries(fields).forEach(([k, el]) => state[k] = el.value);
  state.sections = {};

  $$('.section-toggle').forEach(cb => state.sections[cb.dataset.section] = cb.checked);
  state.badges = {};

  $$('.badge-toggle').forEach(cb => state.badges[cb.dataset.badge] = cb.checked);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const state = JSON.parse(raw);
    Object.entries(fields).forEach(([k, el]) => { if (state[k] !== undefined) el.value = state[k]; });
    if (state.sections) $$('.section-toggle').forEach(cb => {
      if (state.sections[cb.dataset.section] !== undefined) cb.checked = state.sections[cb.dataset.section];
    });
    if (state.badges) $$('.badge-toggle').forEach(cb => {
      if (state.badges[cb.dataset.badge] !== undefined) cb.checked = state.badges[cb.dataset.badge];
    });
  } catch (e) { console.warn('Failed to load saved state', e); }
}

/* =================== MARKDOWN GENERATION =================== */
function generateMarkdown() {
  const title = (fields.title.value || 'My Project').trim();
  const desc = fields.desc.value.trim();
  const author = fields.author.value.trim();
  const github = fields.github.value.trim() || 'username';
  const repo = fields.repo.value.trim() || 'repository';
  const license = fields.license.value;
  const install = fields.install.value.trim();
  const usage = fields.usage.value.trim();
  const version = fields.version.value.trim() || '1.0.0';
  const features = fields.features.value.split('\n').map(l => l.trim()).filter(Boolean);

  const sections = {};

  $$('.section-toggle').forEach(cb => sections[cb.dataset.section] = cb.checked);
  const badges = {};

  $$('.badge-toggle').forEach(cb => badges[cb.dataset.badge] = cb.checked);

  let md = '';

  // Title
  md += `# 🚀 ${title}\n\n`;

  // Badges
  const badgeLines = [];
  if (badges.license) badgeLines.push(`![License](https://img.shields.io/badge/license-${encodeURIComponent(license)}-blue.svg)`);
  if (badges.version) badgeLines.push(`![Version](https://img.shields.io/badge/version-${encodeURIComponent(version)}-brightgreen.svg)`);
  if (badges.stars) badgeLines.push(`![Stars](https://img.shields.io/github/stars/${github}/${repo}?style=social)`);
  if (badges.forks) badgeLines.push(`![Forks](https://img.shields.io/github/forks/${github}/${repo}?style=social)`);
  if (badges.issues) badgeLines.push(`![Issues](https://img.shields.io/github/issues/${github}/${repo}.svg)`);
  if (badges.prs) badgeLines.push(`![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)`);
  if (badges.build) badgeLines.push(`![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)`);
  if (badges.contributors) badgeLines.push(`![Contributors](https://img.shields.io/github/contributors/${github}/${repo}.svg)`);
  if (badgeLines.length) md += badgeLines.join(' ') + '\n\n';

  // Description
  if (desc) md += `> ${desc}\n\n`;

  // Table of contents
  const tocItems = [];
  if (sections.features) tocItems.push('[Features](#-features)');
  if (sections.installation) tocItems.push('[Installation](#-installation)');
  if (sections.usage) tocItems.push('[Usage](#-usage)');
  if (sections.screenshots) tocItems.push('[Screenshots](#-screenshots)');
  if (sections.api) tocItems.push('[API Reference](#-api-reference)');
  if (sections.contributing) tocItems.push('[Contributing](#-contributing)');
  if (sections.tests) tocItems.push('[Running Tests](#-running-tests)');
  if (sections.roadmap) tocItems.push('[Roadmap](#-roadmap)');
  if (sections.acknowledgments) tocItems.push('[Acknowledgments](#-acknowledgments)');
  if (sections.license) tocItems.push('[License](#-license)');

  if (tocItems.length > 1) {
    md += `## 📑 Table of Contents\n\n`;
    tocItems.forEach(t => md += `- ${t}\n`);
    md += `\n`;
  }

  // Features
  if (sections.features && features.length) {
    md += `## ✨ Features\n\n`;
    features.forEach(f => md += `- ${f}\n`);
    md += `\n`;
  }

  // Installation
  if (sections.installation) {
    md += `## 📦 Installation\n\nInstall ${title} with the following command:\n\n`;
    md += '```bash\n' + (install || `npm install ${repo}`) + '\n```\n\n';
  }

  // Usage
  if (sections.usage) {
    md += `## 🚀 Usage\n\nHere's a quick example to get you started:\n\n`;
    md += '```javascript\n' + (usage || `// usage example here`) + '\n```\n\n';
  }

  // Screenshots
  if (sections.screenshots) {
    md += `## 📸 Screenshots\n\n![App Screenshot](https://via.placeholder.com/800x400?text=${encodeURIComponent(title)})\n\n`;
  }

  // API
  if (sections.api) {
    md += `## 📚 API Reference\n\n#### Get all items\n\n`;
    md += '```http\n  GET /api/items\n```\n\n';
    md += `| Parameter | Type     | Description                |\n`;
    md += `| :-------- | :------- | :------------------------- |\n`;
    md += `| \`api_key\` | \`string\` | **Required**. Your API key |\n\n`;
  }

  // Contributing
  if (sections.contributing) {
    md += `## 🤝 Contributing\n\nContributions are always welcome!\n\n`;
    md += `1. Fork the project\n2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)\n3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)\n4. Push to the branch (\`git push origin feature/amazing-feature\`)\n5. Open a Pull Request\n\n`;
  }

  // Tests
  if (sections.tests) {
    md += `## 🧪 Running Tests\n\nTo run tests, run the following command:\n\n`;
    md += '```bash\n  npm run test\n```\n\n';
  }

  // Roadmap
  if (sections.roadmap) {
    md += `## 🗺️ Roadmap\n\n- [x] Initial release\n- [ ] Add dark mode\n- [ ] Add multi-language support\n- [ ] Performance improvements\n\n`;
  }

  // Acknowledgments
  if (sections.acknowledgments) {
    md += `## 🙏 Acknowledgments\n\n- [Awesome README](https://github.com/matiassingers/awesome-readme)\n- [Shields.io](https://shields.io/)\n- [Choose an Open Source License](https://choosealicense.com)\n\n`;
  }

  // License
  if (sections.license) {
    md += `## 📄 License\n\nThis project is licensed under the **${license} License** — see the [LICENSE](LICENSE) file for details.\n\n`;
  }

  // Author
  if (author) {
    md += `---\n\n`;
    md += `### 👤 Author\n\n**${author}**\n\n`;
    md += `- GitHub: [@${github}](https://github.com/${github})\n\n`;
    md += `Give a ⭐️ if this project helped you!\n`;
  }

  return md;
}

/* =================== TINY MARKDOWN -> HTML =================== */
function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function markdownToHtml(md) {
  // 1) Pull out fenced code blocks first
  const codeBlocks = [];
  md = md.replace(/```(\w+)?\n([\s\S]*?)```/g, (m, lang, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push(`<pre><code class="lang-${lang || ''}">${escapeHtml(code)}</code></pre>`);
    return `\u0000CODE${idx}\u0000`;
  });

  // 2) Escape rest
  md = escapeHtml(md);

  // 3) Headings
  md = md.replace(/^#### (.*)$/gm, '<h4>$1</h4>');
  md = md.replace(/^### (.*)$/gm, '<h3>$1</h3>');
  md = md.replace(/^## (.*)$/gm, '<h2>$1</h2>');
  md = md.replace(/^# (.*)$/gm, '<h1>$1</h1>');

  // 4) Horizontal rules
  md = md.replace(/^---$/gm, '<hr>');

  // 5) Images: ![alt](url)
  md = md.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

  // 6) Links: [text](url)
  md = md.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  // 7) Bold and italic
  md = md.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  md = md.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // 8) Inline code
  md = md.replace(/`([^`]+)`/g, '<code>$1</code>');

  // 9) Blockquotes
  md = md.replace(/^&gt; (.*)$/gm, '<blockquote>$1</blockquote>');

  // 10) Tables (basic)
  md = md.replace(/((?:^\|.*\|\s*$\n?)+)/gm, (block) => {
    const lines = block.trim().split('\n');
    if (lines.length < 2) return block;
    const headerCells = lines[0].split('|').slice(1, -1).map(c => c.trim());
    const bodyLines = lines.slice(2);
    let html = '<table><thead><tr>';
    headerCells.forEach(c => html += `<th>${c}</th>`);
    html += '</tr></thead><tbody>';
    bodyLines.forEach(line => {
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      html += '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
    });
    html += '</tbody></table>';
    return html;
  });

  // 11) Lists (consecutive lines starting with - or digits.)
  md = md.replace(/(?:^- .*(?:\n|$))+/gm, (block) => {
    const items = block.trim().split('\n').map(l => l.replace(/^- /, ''));
    return '<ul>' + items.map(i => `<li>${i}</li>`).join('') + '</ul>';
  });
  md = md.replace(/(?:^\d+\. .*(?:\n|$))+/gm, (block) => {
    const items = block.trim().split('\n').map(l => l.replace(/^\d+\. /, ''));
    return '<ol>' + items.map(i => `<li>${i}</li>`).join('') + '</ol>';
  });

  // 12) Paragraphs - wrap loose text lines
  md = md.split(/\n{2,}/).map(block => {
    if (/^\s*<(h\d|ul|ol|pre|blockquote|table|hr|img)/.test(block.trim())) return block;
    if (block.includes('\u0000CODE')) return block;
    if (!block.trim()) return '';
    return '<p>' + block.replace(/\n/g, '<br>') + '</p>';
  }).join('\n');

  // 13) Restore code blocks
  md = md.replace(/\u0000CODE(\d+)\u0000/g, (m, i) => codeBlocks[parseInt(i, 10)]);

  return md;
}

/* =================== UPDATE PREVIEW =================== */
function update() {
  const md = generateMarkdown();
  rawEl.textContent = md;
  renderedEl.innerHTML = markdownToHtml(md);
  saveState();
}

/* =================== EVENT LISTENERS =================== */
Object.values(fields).forEach(el => el && el.addEventListener('input', update));

$$('.section-toggle, .badge-toggle').forEach(cb => cb.addEventListener('change', update));

// Form tabs

$$('.tab').forEach(tab => {
  tab.addEventListener('click', () => {

    $$('.tab').forEach(t => t.classList.remove('active'));

    $$('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    $(`[data-content="${tab.dataset.tab}"]`).classList.add('active');
  });
});

// Preview tabs

$$('.preview-tab').forEach(tab => {
  tab.addEventListener('click', () => {

    $$('.preview-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const view = tab.dataset.view;
    renderedEl.classList.toggle('active', view === 'rendered');
    rawEl.classList.toggle('active', view === 'raw');
  });
});

// Copy button
$('#copyBtn').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(generateMarkdown());
    showToast('✅ Copied to clipboard!');
  } catch {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = generateMarkdown();
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('✅ Copied to clipboard!');
  }
});

// Download button
$('#downloadBtn').addEventListener('click', () => {
  const md = generateMarkdown();
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'README.md';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('⬇ README.md downloaded!');
});

// Toast
function showToast(msg) {
  const toast = $('#toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

// Theme toggle
const themeToggle = $('#themeToggle');
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('readmeForgeTheme', theme);
}
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
});
applyTheme(localStorage.getItem('readmeForgeTheme') || 'light');

// Mobile menu
$('.hamburger').addEventListener('click', () => {
  $('.nav-links').classList.toggle('open');
});

$$('.nav-links a').forEach(a => a.addEventListener('click', () => $('.nav-links').classList.remove('open')));

/* =================== INIT =================== */
loadState();
update();