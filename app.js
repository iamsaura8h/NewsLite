async function loadHeadlines() {
  try {
    const res = await fetch('/data/headlines.json');
    const headlines = await res.json();
    const list = document.getElementById('news-list');
    list.innerHTML = '';

    headlines.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.title;
      li.style.cursor = 'pointer';
      li.addEventListener('click', () => loadArticle(item.id));
      list.appendChild(li);
    });
  } catch (err) {
    console.error('Error loading headlines:', err);
  }
}

async function loadArticle(id) {
  try {
    const res = await fetch(`/data/articles/${id}.json`);
    const article = await res.json();
    const container = document.getElementById('article');
    container.innerHTML = `<h2>${article.title}</h2><p>${article.content}</p>`;
  } catch (err) {
    console.error('Error loading article:', err);
  }
}

loadHeadlines();
