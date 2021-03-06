import './index.css'
import Card from '../components/Card.js'
import { elementList, FormValidator } from '../components/FormValidator.js'
import Section from '../components/Section.js'
import PopupWithImage from '../components/PopupWithImage.js'
import PopupWithForm from '../components/PopupWithForm.js'
import UserInfo from '../components/UserInfo.js'
import PopupWithSubmit from '../components/PopupWithSubmit.js'
import Api from '../components/Api.js'
import {
  popup,
  popupEditButton,
  nameInput,
  jobInput,
  nameProfile,
  occupationProfile,
  editProfileForm,
  cardAddPopup,
  elementContainer,
  popupImg,
  popupCard,
  popupAddButton,
  cardAddInputText,
  cardAddInputLink,
  popupWithSubmitForm,
  avatarProfile,
  popupAvatar,
  avatarInputLink,
  avatarProfileSrc
 } from '../utils/constants.js'


const addCardValidator = new FormValidator(elementList, cardAddPopup);
const popupAvatarValidator = new FormValidator(elementList, popupAvatar);
const editProfileValidator = new FormValidator(elementList, editProfileForm);
const profilePopup = new PopupWithForm(popup, handleSubmitForm);
const cardPopup = new PopupWithForm(popupCard, handleSubmitCard);
const imagePopup = new PopupWithImage(popupImg);
const userData = new UserInfo(nameProfile, occupationProfile, avatarProfileSrc);
const submitPopup = new PopupWithSubmit(popupWithSubmitForm, handleDeleteCard);
const avatarPopup = new PopupWithForm(popupAvatar, handleSubmitAvatar);


const api = new Api ({
  url: 'https://mesto.nomoreparties.co/v1/cohort-17',
  headers: {
    authorization: 'd0f4e15e-5e8f-4105-8cb3-71e6a52f3645',
    'content-type': 'application/json'
  }
});


let userId = '';


Promise.all([
  api.getUserData(),
  api.getInitialCards(),
])
  .then(([userInfo, initialCards]) => {
    userData.setUserInfo(userInfo);
    const cardsLists = new Section ({
      items: initialCards,
      renderer: (items) => {
        addCards(items);
      }
     }, elementContainer);
     cardsLists.renderItems();
  })
  .catch((err) => {
    console.log(err);
  });


api.getUserData()
  .then((data) => {
    const userDatas = data;
    userId = data._id
  })


const initCards = api.getInitialCards()

const cardsList = new Section ({
  data: initCards,
  renderer: (data) => {
    addCards(data);
  }
 }, elementContainer)


function handleSubmitForm (data) {
  const inputValues = {
    name: nameInput.value,
    about: jobInput.value
  }
  profilePopup.renderLoading(true)
  api.saveUserData(inputValues)
    .then((inputValues) => {
      userData.setUserInfo(inputValues);
      profilePopup.closePopup();
    })
    .catch((error) => console.log(error))
}


function handleSubmitAvatar(data) {
  const inputValue = {
    avatar: avatarInputLink.value
  }
  avatarPopup.renderLoading(true)
  api.saveAvatar(inputValue)
    .then((inputValue) => {
      userData.setUserInfo(inputValue);
      avatarPopup.closePopup();
    })
    .catch((error) => console.log(error))
}


function openProfile () {
  profilePopup.openPopup();
  const profileValues = userData.getUserInfo();
  nameInput.value = profileValues.name;
  jobInput.value = profileValues.occupation;
  editProfileValidator.resetPopup(popup);
}


function addCards(card) {
  const cardClass = new Card(card, '#cardsTemplate', handleCardClick, userId, {
    handlePopupDelete: (cardElement) => {
      submitPopup.openPopup(cardElement, card._id)
    },
    setLike: (evt, card, likeSum) => {
      const isLikeOwner = card.likes.some((l) => l._id === userId)

      if(isLikeOwner) {

        deleteLike(evt, card, likeSum)

      }
      else {
        setLike(evt, card, likeSum)
      }

    }
  });
  const cardElement = cardClass.generateCard();
  cardsList.addItem(cardElement);
}


function updateLike (card, likeSum) {
  likeSum.textContent = card.likes.length;
}


function setLike(evt, card, likeSum) {
  api.saveLike(card._id)
    .then((card) => {
      evt.target.classList.add('elements__like_active');
      updateLike(card, likeSum);
    })
    .catch((error) => console.log(error))
}


function deleteLike(evt, card, likeSum) {
  api.deleteLike(card._id)
    .then((card) => {
      evt.target.classList.remove('elements__like_active');
      updateLike(card, likeSum);
    })
    .catch((error) => console.log(error))
}


function handleSubmitCard() {
  const cards = {
    name: cardAddInputText.value,
    link: cardAddInputLink.value
  }
  cardPopup.renderLoading(true)
    api.saveNewCard(cards)
    .then((card) => {
      addCards(card);
      cardPopup.closePopup();
    })
    .catch((error) => console.log(error))
}


function handleDeleteCard(cardElement, cardId) {
  submitPopup.renderLoading(true)
  api.deleteCard(cardId)
    .then(() => {
      submitPopup.removeCard()
      submitPopup.closePopup();
    })
    .catch((error) => console.log(error))
}


function handleCardClick (name, link) {
  imagePopup.openPopup(name, link)
}

popupEditButton.addEventListener('click', openProfile);

popupAddButton.addEventListener('click', function () {
  addCardValidator.resetPopup(popupCard);
  cardPopup.openPopup();
});

avatarProfile.addEventListener('click', function () {
  avatarPopup.openPopup();
});


profilePopup.setEventListeners();
cardPopup.setEventListeners();
imagePopup.setEventListeners();
submitPopup.setEventListeners();
avatarPopup.setEventListeners();


addCardValidator.enableValidation();
editProfileValidator.enableValidation();
popupAvatarValidator.enableValidation();











