const shortenInput = document.querySelector('#shortenInput');
const shortenErrorNode = document.querySelector('#shortenError');

const urlListNode = document.querySelector('#urlList');

const bodyNode = document.querySelector('body');

const shortenSubmit = document.querySelector('#shortenSubmit');

const burgerNode = document.querySelector('#burger');
const navLinksNode = document.querySelector('#navLinks');

let urlList;
let urlListButtonNodes = [];

function setShortenError(message = 'Invalid link') {
  shortenInput.classList.add('shorten__input--error');
  shortenErrorNode.innerText = message;
}

function resetShortenError() {
  shortenInput.classList.remove('shorten__input--error');
  shortenErrorNode.innerText = '';
}

function startLoading() {
  bodyNode.classList.add('body--loading');
}

function stopLoading() {
  bodyNode.classList.remove('body--loading');
}

const resetUrlButtonNodes = () => {
  for (const node of urlListButtonNodes) {
    node.classList.remove('btn--active');
    node.innerHTML = '&nbsp&nbspCopy&nbsp&nbsp';
  }
};

function renderUrlList() {
  if (urlList === undefined) return console.log('Failed to render url list.');
  urlListNode.innerHTML = '';
  urlListButtonNodes = [];

  for (const item of urlList) {
    if (!item.origin || !item.new) console.warn('Invalid url list format.');
    /*
      <li class="urlList__item">
          <p class="urlList__item__origin">${item.origin}</p>
          <hr class="urlList__hr" />
          <div class="urlList__item__main">
            <p>${item.new}</p>
            <button class="btn btn--squared btn--small">Copy</button>
          </div>
        </li>
    */

    const urlList__item = document.createElement('li');
    urlList__item.classList.add('urlList__item');

    const urlList__item__origin = document.createElement('p');
    urlList__item__origin.classList.add('urlList__item__origin');
    urlList__item__origin.innerHTML = item.origin;

    const urlList__hr = document.createElement('hr');
    urlList__hr.classList.add('urlList__hr');

    const urlList__item__main = document.createElement('div');
    urlList__item__main.classList.add('urlList__item__main');

    const url__item__p = document.createElement('p');
    url__item__p.innerText = item.new;

    const url__item__btn = document.createElement('button');
    url__item__btn.classList.add('btn', 'btn--squared', 'btn--small');
    url__item__btn.innerHTML = '&nbsp&nbspCopy&nbsp&nbsp';

    urlListButtonNodes.push(url__item__btn);

    url__item__btn.addEventListener('click', function () {
      navigator.clipboard.writeText(item.new);
      resetUrlButtonNodes();
      this.innerText = 'Copied!';
      this.classList.add('btn--active');
    });

    urlList__item__main.appendChild(url__item__p);
    urlList__item__main.appendChild(url__item__btn);

    urlList__item.appendChild(urlList__item__origin);
    urlList__item.appendChild(urlList__hr);
    urlList__item.appendChild(urlList__item__main);

    urlListNode.appendChild(urlList__item);
  }
}

const addUrlItem = async () => {
  const originLink = shortenInput.value;
  if (originLink == '') {
    return setShortenError('Please add a link');
  }

  startLoading();
  const res = await fetch(`https://api.shrtco.de/v2/shorten?url=${originLink}`);
  const data = await res.json();
  stopLoading();

  if (data.result) {
    urlList.push({ origin: originLink, new: data.result['full_short_link'] });
    localStorage.setItem('urlList', JSON.stringify(urlList));
    renderUrlList();
    resetShortenError();
  } else {
    setShortenError();
  }
};

const init = () => {
  urlList = localStorage.getItem('urlList');
  if (urlList) {
    urlList = JSON.parse(urlList);
  } else {
    urlList = [];
  }

  renderUrlList();
  shortenSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    addUrlItem();
  });

  burgerNode.addEventListener('click', function () {
    navLinksNode.classList.toggle('nav__links--show');
  });
};

init();
