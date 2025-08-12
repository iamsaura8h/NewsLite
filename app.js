async function loadHeadlines() {
  const res = await fetch('data/headlines.json');
  const headlines = await res.json();
  const list = document.getElementById('news-list');
  list.innerHTML = '';
  headlines.forEach(h => {
    const li = document.createElement('li');
    li.textContent = h.title;
    li.onclick = () => loadArticle(h.file);
    list.appendChild(li);
  });
}

async function loadArticle(filename) {
  const res = await fetch(`data/articles/${filename}`);
  const text = await res.text();
  document.getElementById('article').textContent = text;
}

loadHeadlines();
