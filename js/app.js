//Imports
import {loadState, saveState} from './helper/local-storage.js';

//Elements
let $container = document.querySelector('.todo__content');
const $inputFile = document.querySelector('.upload__input');
let $image = document.querySelector('.upload__image');
const $modal = document.querySelector('#add');
const $form = document.querySelector('#addForm');
const $modalWrapperId = document.querySelector('.add__wrapper').dataset.modalId;
const $modalId = document.querySelector('#add').dataset.modalId;
let $inputValue = document.querySelector('.add-input');
let $textValue = document.querySelector('textarea');
const $list = document.querySelector('.todo__list');

//Variables
let editItemId = -1;
let data = loadState('TODO_DATA') || [];


//add button && card
const $addBtn  = document.createElement('button');
const $card = document.createElement('div');
$card.classList.add('todo__add-card');
$addBtn.classList.add('add-btn');
$addBtn.innerHTML = '+';
$card.appendChild($addBtn);

//first render elements in array
render();

//add item
function addItem() {
    if($inputValue.value === '' || $textValue.value === '' || $image.src === '') {
        alert('Empty field, please, you should fill in.');
    } else {
        if(editItemId >= 0) {
            data = data.map((item, index) => {
                return {
                    ...item,
                    name: index === editItemId ? $inputValue.value : item.name,
                    description: index === editItemId ? $textValue.value : item.description,
                    image: index === editItemId ? $image.src : item.image,
                }
            });
            editItemId = -1;

        } else {

            let count = 0;
            for(let i = 0; i < $container.firstElementChild.children.length - 1; i++) {
                count++;
            }

            const item = {
                id: String(count),
                name: $inputValue.value,
                description: $textValue.value,
                image: $image.src,
            }

            data.push(item);
            saveState('TODO_DATA', data);
        }
         reset($inputValue, $textValue, $image);
    }
}
function reset(inputValue, textValue, image) {
    let result = '';
    if( inputValue) {
        inputValue.value = result;
    }
    if( textValue) {
        textValue.value = result;
    }
    if(image.src) {
        image.src = result;
    }
    return result;
}

//render items
function render() {
    $list.innerHTML = '';
    data.forEach(({image, name, description, id}, index) => {
        $list.innerHTML += `<div  data-edit-id=${id} id=${index} class="todo__item">
         <img src=${image} class="todo__img" />
          <h2 class="todo__title">
            ${name}
          </h2>
          <p class="todo__description">
            ${description}
          </p>
          <span class="todo__close">&times;</span>
          <a href="#" class="todo__edit">Edit</a>
        </div>`;
    });
    $list.appendChild($card);
}

//Handle functions
function openModal() {
    $modal.classList.replace('add__modal-close', 'add__modal-open');
}
function closeModal() {
    $modal.classList.replace('add__modal-open', 'add__modal-close');
}
function clickOutsideToCloseModal(event) {
    const { modalId } =  event.target.dataset;
    const { wrapperId } = event.target.dataset;

    if (modalId === $modalId || wrapperId === $modalWrapperId) {
        reset($inputValue, $textValue, $image);
        closeModal();
    }
}
function handleUpload(event) {
    const { files } = event.target;
    const file = files[0];

    if(file) {
        const fileReader = new FileReader();
        fileReader.addEventListener('load', loadFile);
        fileReader.readAsDataURL(file);
    }
}
function loadFile(event) {
    $image.src = event.target.result;
}

function handleItemEdit(itemId) {
    $inputValue.value = data[itemId].name;
    $textValue.value = data[itemId].description;
    $image.src = data[itemId].image;
    editItemId = itemId;
    openModal();
}

function handleItemDelete(itemId) {
    data = data.filter((item, index) => index !== itemId);
    editItemId = -1;
    saveState('TODO_DATA', data);
    render();
}

function handleActions(event) {
    if(event.target.parentNode.className === 'todo__item') {
        const item = event.target.parentNode;
        const id = Number(item.id);

        if(event.target.className === 'todo__edit') handleItemEdit(id);
        if(event.target.className === 'todo__close') handleItemDelete(id);
    }
}

//Listeners
$addBtn.addEventListener('click', openModal);
$inputFile.addEventListener('change', handleUpload);
window.addEventListener('click', clickOutsideToCloseModal);

$form.addEventListener('submit', function (event){
    event.preventDefault();
    addItem();
    render();
    closeModal();
    saveState('TODO_DATA', data);
});

$list.addEventListener('click', handleActions);



