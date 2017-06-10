const BASE_URL = 'http://localhost:3000';

function getPaste(key) {
  return fetch(`${BASE_URL}/paste/${key}`).then(res => res.json());
}

function getPasteHtmlContent(key) {
  return fetch(`${BASE_URL}/paste/${key}/content/html`).then(res => res.text());
}

function getSyntaxes() {
  return fetch(`${BASE_URL}/syntax`).then(res => res.json());
}

function getThemes() {
  return fetch(`${BASE_URL}/theme`).then(res => res.json());
}

function getThemeCss(name) {
  return fetch(`${BASE_URL}/theme/${name}/css`).then(res => res.text());
}

function getLatestPastes() {
  return fetch(`${BASE_URL}/paste/latests`).then(res => res.json());
}

function uploadPaste(data) {
  if (!data.content && data.content.length < 1) {
    throw new Error('Content is required!');
  }

  return fetch(`${BASE_URL}/paste`, {
    method: 'put',
    body: JSON.stringify(data),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(res => res.json());
}

export {
	getPaste,
	getPasteHtmlContent,
	getSyntaxes,
	getThemes,
	getThemeCss,
	getLatestPastes,
	uploadPaste
};
