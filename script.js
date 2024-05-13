// script.js
const cardsContainer = document.getElementById('cards');

const owner = 'rdkcentral';
const repo = 'firebolt-certification-app';
const branch = 'github-io-deployment';
const path = '';

const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    const folderNames = data.filter((item) => item.type === 'dir').map((item) => item.name);

    folderNames.forEach((folderName) => {
      const column = document.createElement('div');
      column.classList.add('column', 'is-one-quarter', 'card-container');

      const link = document.createElement('a');
      link.href = `https://rdkcentral.github.io/${repo}/${folderName}/index.html`;
      link.target = '_blank';

      const card = document.createElement('div');
      card.classList.add('card');

      const cardContent = document.createElement('div');
      cardContent.classList.add('card-content');

      const title = document.createElement('p');
      title.classList.add('title', 'is-4', 'has-text-centered');
      title.textContent = folderName.toUpperCase();

      cardContent.appendChild(title);
      card.appendChild(cardContent);
      link.appendChild(card);
      column.appendChild(link);
      cardsContainer.appendChild(column);
    });
  })
  .catch((error) => console.error('Error:', error));
