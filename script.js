const shortenInput = document.querySelector('#shortenInput');
const urlListNode = document.querySelector('#urlList');

const shortenSubmit = document.querySelector('#shortenSubmit');

let urlList;
// {origin: "string", new:"string"}

const init = () => {
  urlList = localStorage.getItem('urlList');
  if (urlList) {
    urlList = JSON.parse(urlList);
  } else {
    urlList = [];
  }

  renderUrlList();
  shortenSubmit.addEventListener('click', () => {
    console.log('hello');
    addUrlItem();
  });
};

init();

const addUrlItem = async () => {
  const originLink = shortenInput.value;

  const res = await fetch(`https://api.shrtco.de/v2/shorten?url=${originLink}`);
  const data = await res.json();

  if (data.result) {
    urlList.push({ origin: originLink, new: data.result['full_short_link'] });
    localStorage.setItem('urlList', JSON.stringify(urlList));
    renderUrlList();
  }
};

function renderUrlList() {
  if (urlList === undefined) return console.log('Failed to render url list.');
  let newItems = '';
  for (const item of urlList) {
    if (!item.origin || !item.new) console.warn('Invalid url list format.');
    newItems += `
        <li class="urlList__item">
          <p class="urlList__item__origin">${item.origin}</p>
          <hr class="urlList__hr" />
          <div class="urlList__item__main">
            <p>${item.new}</p>
            <button class="btn btn--squared btn--small">Copy</button>
          </div>
        </li>
        `;
  }
  urlListNode.innerHTML = newItems;
}
