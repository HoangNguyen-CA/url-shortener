const shortenInput = document.querySelector('#shortenInput');

let urlList;

const renderUrlList = () => {};

const init = () => {
  urlList = localStorage.getItem('urlList') || [];
};

init();
