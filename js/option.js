const mySwiper = new Swiper('.swiper-container', {
  loop: true,

  // Navigation arrows
  navigation: {
    nextEl: '.slider-button-next',
    prevEl: '.slider-button-prev',
  },
});

// cart

const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');
// const modalClose = document.querySelector('.modal-close');

const openModal = function () {
  modalCart.classList.add('show');
};
const closeModal = function () {
  modalCart.classList.remove('show');
};

buttonCart.addEventListener('click', openModal);

// modalClose.addEventListener('click', closeModal);

modalCart.addEventListener('click', function (event) {
  const target = event.target;
  if (target.classList.contains('overlay') || target.classList.contains('modal-close')) {
    closeModal();
  }

})


// scroll smooth
{
  const scrollLinks = document.querySelectorAll('a.scroll-link');

  for (const scrollLink of scrollLinks) {
    scrollLink.addEventListener('click', function () {
      event.preventDefault();
      const id = scrollLink.getAttribute('href');
      document.querySelector(id).scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    });
  }
}

// goods
const longGoodsList = document.querySelector('.long-goods-list');
const viewAll = document.querySelectorAll('.view-all');
const navigationLink = document.querySelectorAll('.navigation-link:not(.view-all)');

const showAcsessories = document.querySelectorAll('.show-acsessories')
const showClothing = document.querySelectorAll('.show-clothing')
const getGoods = async function () {
  const result = await fetch('db/db.json');
  if (!result.ok) {
    throw 'Ошибочка вышла: ' + result.status
  }
  return await result.json();

};

const createCard = function ({
  label,
  name,
  img,
  description,
  id,
  price
}) {
  const card = document.createElement('div');
  card.className = 'col-lg-3 col-sm-6'


  card.innerHTML = `
				<div class="goods-card">
					${label ? `<span class="label">${label}</span>` : ''}
						
						<img src="db/${img}" alt="${name}" class="goods-image">
						<h3 class="goods-title">${name}</h3>
						<p class="goods-description">${description}</p>
						<button class="button goods-card-btn add-to-cart" data-id="${id}">
							<span class="button-price">$${price}</span>
						</button>
					</div>
					`;

  return card;
}

const renderCards = function (data) {
  longGoodsList.textContent = '';
  const cards = data.map(createCard)
  longGoodsList.append(...cards)
  document.body.classList.add('show-goods')
};

const showAll = function (event) {
  event.preventDefault();
  getGoods().then(renderCards);
}

viewAll.forEach(function (elem) {
  elem.addEventListener('click', showAll);
})


const filterCards = function (field, value) {
  getGoods()
    .then(function (data) {
      const filteredGoods = data.filter(function (good) {
        return good[field] === value
      });
      return filteredGoods;
    })
    .then(renderCards);
};

navigationLink.forEach(function (link) {
  link.addEventListener('click', function (event) {
    event.preventDefault();
    const field = link.dataset.field;
    const value = link.textContent;
    filterCards(field, value);
  })
});

showAcsessories.forEach(item => {
  item.addEventListener('click', event => {
    event.preventDefault();
    filterCards('category', 'Accessories')
  });
});

showClothing.forEach(item => {
  item.addEventListener('click', event => {
    event.preventDefault();
    filterCards('category', 'Clothing')
  });
});