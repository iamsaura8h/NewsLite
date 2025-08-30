const source = "https://www.thehindu.com/news/national/feeder/default.rss";

async function fetchRSS(rssUrl) {
  const api = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;
  const res = await fetch(api);
  if (!res.ok) throw new Error("Fetch failed");
  const { contents } = await res.json();
  return new DOMParser().parseFromString(contents, "application/xml");
}

async function loadHeadlines() {
  const list = document.getElementById("news-list");
  list.innerHTML = "";
  let xml;

  try {
    xml = await fetchRSS(source);
  } catch (err) {
    console.error(err);
    list.innerHTML = "<li>⚠️ Unable to load news right now.</li>";
    return;
  }

  const items = Array.from(xml.querySelectorAll("item")).slice(0, 5);
  items.forEach(item => {
    const title = item.querySelector("title")?.textContent || "";
    const link = item.querySelector("link")?.textContent || "";
    const desc = item.querySelector("description")?.textContent || "";

    const li = document.createElement("li");
    li.textContent = title;
    li.style.cursor = "pointer";
    li.addEventListener("click", () => loadArticle({ title, link, description: desc }));
    list.appendChild(li);
  });
}

function loadArticle({ title, link, description }) {
  const container = document.getElementById("article");
  let text = description.replace(/<[^>]*>?/gm, "");
  let snippet = text.split(/\s+/).slice(0, 25).join(" ");
  if (text.split(/\s+/).length > 25) snippet += "...";
  container.innerHTML = `
    <h2>${title}</h2>
    <p>${snippet}</p>
    <p><a href="${link}" target="_blank">Read full article</a></p>
  `;
}

loadHeadlines();
