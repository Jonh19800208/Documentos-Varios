document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearSearch');
  const noResults = document.getElementById('noResults');
  const sections = document.querySelectorAll('.section');
  const cards = document.querySelectorAll('.card');

  // ===== Collapsible sections =====
  document.querySelectorAll('[data-toggle]').forEach(header => {
    header.addEventListener('click', () => {
      const section = header.closest('.section');
      section.classList.toggle('collapsed');

      // Recalculate max-height for smooth animation
      const content = section.querySelector('.section-content');
      if (!section.classList.contains('collapsed')) {
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // Set initial max-heights
  document.querySelectorAll('.section-content').forEach(content => {
    content.style.maxHeight = content.scrollHeight + 'px';
  });

  // ===== Search =====
  function normalize(str) {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  function filterCards() {
    const query = normalize(searchInput.value);
    let visibleCount = 0;

    // Toggle clear button
    clearBtn.classList.toggle('visible', query.length > 0);

    cards.forEach(card => {
      const title = normalize(card.dataset.title || card.querySelector('h3')?.textContent || '');
      const match = !query || title.includes(query);
      card.classList.toggle('hidden', !match);
      if (match) visibleCount++;
    });

    // Hide empty sections
    sections.forEach(section => {
      const visibleCards = section.querySelectorAll('.card:not(.hidden)');
      const isEmpty = visibleCards.length === 0;
      section.classList.toggle('hidden', isEmpty);

      // Auto-expand sections that have results when searching
      if (query && !isEmpty) {
        section.classList.remove('collapsed');
        const content = section.querySelector('.section-content');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });

    // Show/hide no-results message
    noResults.classList.toggle('visible', visibleCount === 0 && query.length > 0);
  }

  searchInput.addEventListener('input', filterCards);

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
    filterCards();
  });

  // Keyboard shortcut: Ctrl/Cmd + K to focus search
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
    if (e.key === 'Escape' && document.activeElement === searchInput) {
      searchInput.value = '';
      filterCards();
      searchInput.blur();
    }
  });
});
