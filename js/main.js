let model = [
    {
        id: 001,
        imgURL: 'img/goods/item-1.jpg',
        name: 'Плед Клеточка LT1070',
        price: '170.00',
        currency: 'грн',
        meta: 'rugs'
    },
    {
        id: 002,
        imgURL: 'img/goods/item-2.jpg',
        name: 'Покрывало PL03',
        price: '5846.00',
        currency: 'грн',
        meta: 'rugs'
    },
    {
        id: 003,
        imgURL: 'img/goods/item-3.jpg',
        name: 'Полотенце гобеленовое PLG03',
        price: '190.00',
        currency: 'грн',
        meta: 'towels'
    },
    {
        id: 004,
        imgURL: 'img/goods/item-4.jpg',
        name: 'Скатерть',
        price: '3446.00',
        currency: 'грн',
        meta: 'tablecloth'
    },
    {
        id: 005,
        imgURL: 'img/goods/item-5.jpg',
        name: 'Сумка',
        price: '250.00',
        currency: 'грн',
        meta: 'tapestry-bags'
    },
    {
        id: 006,
        imgURL: 'img/goods/item-6.jpg',
        name: 'Плед Клеточка LT1070',
        price: '120.00',
        currency: 'грн',
        meta: 'rugs'
    },
    {
        id: 007,
        imgURL: 'img/goods/item-7.jpg',
        name: 'Покрывало гобеленовое PL03',
        price: '2350.00',
        currency: 'грн',
        meta: 'rugs'
    },
    {
        id: 008,
        imgURL: 'img/goods/item-8.jpg',
        name: 'Плед Клеточка LT1070',
        price: '195.00',
        currency: 'грн',
        meta: 'rugs'
    },
    {
        id: 009,
        imgURL: 'img/goods/item-5.jpg',
        name: 'Покрывало гобеленовое PLG03',
        price: '999.00',
        currency: 'грн',
        meta: 'rugs'
    }
];

let cssClasses = {
    iconBasket : 'icon-basket',
    flexGrid: 'col-xs-4',
    priceName: 'price-name',
    basket: 'basket',
    row: 'row',
    priceForItem: 'price-for-item',
    box: 'box',
    flexGridSm: 'col-sm',
    flexGridMd: 'col-md-6'
}

class Goods {
    constructor(options){
        this.options = options;
    }
    render (target, cssClasses) {
        let self = this;
        let wrapper = document.createElement('div');
        wrapper.classList.add(cssClasses.row, cssClasses.box);
        target.appendChild(wrapper);
        this.options.forEach(function(item, i){
            let itemWrap = document.createElement('div');

            let priceNameWrap = document.createElement('div');
            let itemImg = document.createElement('img');
            let basket = document.createElement('div');
            let nameArticle = document.createElement('div');
            let priceArticle = document.createElement('div');
            itemWrap.appendChild(itemImg);
            itemWrap.appendChild(priceNameWrap);
            priceNameWrap.appendChild(nameArticle);
            priceNameWrap.appendChild(priceArticle);
            itemWrap.appendChild(basket);
            itemImg.setAttribute('src', self.options[i].imgURL);
            itemImg.setAttribute('alt', self.options[i].name);
            wrapper.appendChild(itemWrap);
            priceNameWrap.classList.add(cssClasses.priceName);
            itemWrap.classList.add(cssClasses.flexGrid, cssClasses.row, cssClasses.flexGridSm, cssClasses.flexGridMd);
            basket.classList.add(cssClasses.iconBasket,
            cssClasses.basket);
            priceArticle.classList.add(cssClasses.priceForItem)
            nameArticle.innerHTML = self.options[i].name;
            priceArticle.innerHTML = self.options[i].price
            +' '+self.options[i].currency;
        })
    }
    rerender() {
                                                                
        if (document.querySelector('.box')){
            document.querySelector('.box').remove();
        }
        let targetRender = document.querySelector('.goods-items');
        this.render(targetRender, cssClasses);
    }
}

class TransferService {
	constructor () {
		this.data = {}
	}
	setData (params) {
		this.data[params.name] = params.data;
	}
	getData (name) {
		return this.data[name];
	}
}

window.onload = function () {
    let transfer = new TransferService();
    let transferRange = true;
    let modelChanged = false;
    let parentRange = document.querySelector('.price-range');
    let outputPrice = new Array();
    let inputPrice = new Array();
    let elm = document.querySelector('input[type="range"]');
    let container = elm.parentNode;
    let values = elm.getAttribute('data-values').split(' ');
    let rangeCheck = true;

    values.forEach(function (value, i, values) {
        inputPrice[i] = elm.cloneNode();
        inputPrice[i].type = 'range';
        inputPrice[i].removeAttribute('data-values');
        inputPrice[i].value = value;
        inputPrice[i] = container.insertBefore(inputPrice[i], elm);
        inputPrice[i].style.width = "100%";
        outputPrice[i] = document.createElement('input');
        parentRange.appendChild(outputPrice[i]);
        outputPrice[i].classList.add('price-show');
        outputPrice[i].value = inputPrice[i].value;
        inputPrice[i].addEventListener('input', rangeHandler);

        function rangeHandler () {
            modelChanged = true;
            if (+inputPrice[0].value >= +inputPrice[1].value) {
                inputPrice[1].value = inputPrice[0].value;
            }
            outputPrice[i].value = inputPrice[i].value;
            arrayBuf = new Array();
            let currModel;
            if (rangeCheck) {
                currModel = transfer.getData('switcher') || model;
            }
            else {
                currModel = transfer.getData('filterToRange');
            }
            let arrayBufWithoutFilter = new Array();
            let rangeModelWithoutFilter = transfer.getData('switcher') || model;
            rangeModelWithoutFilter.forEach(function(item){
                if (+item.price > +inputPrice[0].value && +item.price < +inputPrice[1].value){
                    arrayBufWithoutFilter[arrayBufWithoutFilter.length] = item;
                }
            })
            transfer.setData({name: 'RangeWithoutFilter', data: arrayBufWithoutFilter});
            console.log(currModel);
            currModel.forEach(function(item) {
            
                if (+item.price > +inputPrice[0].value && +item.price < +inputPrice[1].value){
                    arrayBuf[arrayBuf.length] = item;
                }
            })
            let goodsRange = new Goods(arrayBuf);
            goodsRange.rerender();
            popUpHandler();
            transfer.setData({name: 'serviceRange', data: arrayBuf});
            transferRange = true;
            
        }
    });

    elm.remove();

    let goodsItems = new Goods(model);
    let targetRender = document.querySelector('.goods-items');
    goodsItems.render(targetRender, cssClasses);

    let switcher = document.querySelector('select[name="select"]');
    switcher.addEventListener('change', switcherHandler);
    
    function switcherHandler () {
        let arr;
        
        if (modelChanged == true) {
            if (transferRange) {
                arr =  transfer.getData('serviceRange');
                console.log(arr);
            }
            else {
                arr = transfer.getData('serviceFilter');
                console.log(arr);
            }  
        }
        else {
            arr = model
        }
        if (switcher.value == "Возрастанию цены") {
            let incrAllGoods = sortArrayIncr(model);
            let incrModel = sortArrayIncr(arr);
            let goodsIncr = new Goods(incrModel)
            goodsIncr.rerender();
            transfer.setData({name: 'switcher', data: incrAllGoods});
            transfer.setData({name: 'sortedForRender', data: incrModel});
        }
        else if (switcher.value == "Убыванию цены") {
            let decAllGoods = sortArrayDec(model);
            let decModel = sortArrayDec(arr);
            let goodsDec = new Goods(decModel);
            goodsDec.rerender();
            transfer.setData({name: 'switcher', data: decAllGoods});
            transfer.setData({name: 'sortedForRender', data: decModel});
        }
        else if (switcher.value == "Сортировать по") {
            let goodsCurr = new Goods(arr);
            goodsCurr.rerender();
            let defaultModel = sortDefault(arr);
            transfer.setData({name: 'switcher', data: model});
            transfer.setData({name: 'sortedForRender', data: defaultModel});
        }
        popUpHandler(); 
    }

    function sortDefault (arr) {
        let arrPush = true;
        let sortedArr = new Array();
        for (let i=0; i<arr.length; i++) {
            for (let j=0; j<sortedArr.length; j++) {
                if (arr[i].id > sortedArr[j].id) {
                    arrPush = true;
                    continue
                }
                else {
                    sortedArr.splice(j, 0, arr[i]);
                    arrPush = true;
                    break
                }
            }
            if (arrPush) {
                sortedArr.push(arr[i]);
            }
        }
        return sortedArr
    }

    function sortArrayIncr (arr) {
        let arrPush = true;
        let arrIncr = new Array();
        for (let i=0; i<arr.length; i++) {
            for (let j=0; j<arrIncr.length; j++) {
                if (+arr[i].price > +arrIncr[j].price) {
                    arrPush = true;
                    continue
                }
                else {
                    arrIncr.splice(j, 0, arr[i]);
                    arrPush = false;
                    break
                }
            }
        if (arrPush) {
            arrIncr.push(arr[i]);
            }
        }
        return arrIncr;
    }

    function sortArrayDec (arr) {
        let arrPush = true;
        let arrDec = new Array();
        for (let i=0; i<arr.length; i++) {
            for (let j=0; j<arrDec.length; j++) {
                if (+arr[i].price < +arrDec[j].price) {
                    arrPush = true;
                    continue
                }
                else {
                    arrDec.splice(j, 0, arr[i]);
                    arrPush = false;
                    break
                }
            }
        if (arrPush) {
            arrDec.push(arr[i]);
            }
        }
        return arrDec;
    }

    // sort by meta-info
    let inputCheckBoxes = document.querySelectorAll('.category-checkbox input');
    let metaObj = new Object();
    function isEmptyObject(obj) {
        for (let i in obj) {
            if (obj.hasOwnProperty(i)) {
                return false;
            }
        }
        return true;
    }
    
    inputCheckBoxes.forEach(function(item){
        item.addEventListener('click', clickHandler)
    })
    let filterNone = true;
    function clickHandler (event) {
       
        transferRange = false;
        modelChanged = true;
        let filter = new Array();
        let allFilter = new Array();
        if (event.target.checked) {
            metaObj[event.target.id] = "";
        }
        else {
            delete metaObj[event.target.id]
        }
        
       
        let currModel;
        
        if (filterNone) {
            currModel =  transfer.getData('serviceRange');
            console.log('filterNone', filterNone)
        }
        else {
            currModel = transfer.getData('sortedForRender') || model;
        }
        let allModel = transfer.getData('switcher') || model;
        if (isEmptyObject(metaObj)) {
            filterNone = true;
            
            let metaModelGoodDefault = new Goods(transfer.getData('RangeWithoutFilter') || model)
            metaModelGoodDefault.rerender();
            popUpHandler();
            transfer.setData({name: 'serviceFilter', data: allModel});
            console.log(transfer.getData('serviceRange'));
            rangeCheck = true;
        }
        else {
            rangeCheck = false;
            filterNone = false;
            let goodsWithoutFilter = transfer.getData('RangeWithoutFilter') || model;
            console.log(currModel);
            for (let key in metaObj) {
                goodsWithoutFilter.forEach(function(item, i){
                    if (key == item.meta) {
                        filter[filter.length] = item;
                }
                })
                allModel.forEach(function(item, i){
                    if (key == item.meta) {
                        allFilter[allFilter.length] = item;
                }
                })
             }
             
            let metaRender = new Goods(filter);
            metaRender.rerender();
            transfer.setData({name: 'serviceFilter', data: filter});
            transfer.setData({name: 'filterToRange', data: allFilter});
            console.log('rangeCheck',rangeCheck);
            console.log(filter);
            popUpHandler();
        }
    }

// Accordeon
let filter = document.querySelector('.filter');
let headCategory = document.querySelector('.head-category');
let plusMinus = document.querySelector('.head-category .plus-or-minus');    
headCategory.addEventListener('click', showHide);
function showHide () {
    filter.classList.toggle('non-vis');
    if (filter.classList.contains('non-vis')) {
        plusMinus.innerHTML = "+";
    }
    else if (filter.classList.contains('non-vis') == false) {
        plusMinus.innerHTML = "-";
    }
}

// Pop-Up
    function popUpHandler(){
        let openPopUp = document.querySelectorAll('.basket');
        let closePopUp = document.querySelector('.popup-content .close-popup img');
        let popUp = document.querySelector('.popup');
        
        openPopUp.forEach(function(item){
            item.addEventListener('click', openForm); 
        })
    
        function openForm () {
            popUp.classList.remove('non-vis');
        }
        function closeForm() {
            popUp.classList.add('non-vis');
        }
        closePopUp.addEventListener('click', closeForm);
    };
    popUpHandler();
   
    let inputsPopUp = document.querySelectorAll('.popup input');
    inputsPopUp.forEach(function(item){
        item.addEventListener('input', function () {
            item.classList.remove('error');
        })
        document.querySelector('button.payment').addEventListener('click', function(event){
            event.preventDefault();
            if (item.value == ''){
                    item.classList.add('error')
                }
            else {
                item.classList.remove('error')
            }   
        }) 
    })
    function popupHeader () {
        let openPopUp = document.querySelector('button.open-popup');
        let closePopUp = document.querySelector('.popupHeader-content .close-popup img');
        let popUp = document.querySelector('.popupHeader');
        let popUpUrl = 'json/text.json';

        function openPopup () {
            popUp.classList.remove('non-vis');

            httpGet(popUpUrl)
            .then(function(res){
                textPopup = JSON.parse(res);
                textPopup = textPopup.text;
                document.querySelector('.popupHeader .popup-text').innerHTML = textPopup
                return textPopup;
            });

        }
        function closePopup () {
            popUp.classList.add('non-vis');
        }
        openPopUp.addEventListener('click', openPopup);
        closePopUp.addEventListener('click', closePopup);
    }
    popupHeader();

    function httpGet(url) {

        return new Promise(function(resolve, reject) {
      
          let xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onload = function() {
            if (this.status == 200) {
              resolve(this.response);
            } else {
              var error = new Error(this.statusText);
              error.code = this.status;
              reject(error);
            }
          };
          xhr.send();
        });
      
      }

// Sticky scroll up header

    window.onscroll = function() {
        scrollPage()
    };

    let header = document.querySelector ('header');
	let headerHeight = header.clientHeight;
	let content = document.querySelector('.banner');
	content.style.marginTop = headerHeight+'px';
	let startScroll = 0;
	let transferScrollData = new TransferService();

	function scrollPage () { 
		let scrolled = window.pageYOffset || document.documentElement.scrollTop;

		if (scrolled > startScroll) {
		    header.style.position = 'absolute';
		    let topHeader = transferScrollData.getData('currScroll') || 0;
		    header.style.top = topHeader+'px';
		    transferScrollData.setData({name: 'scrollForAbs', data: scrolled});
		    }
		 else if (scrolled < startScroll) {
		  	let scrollForHeader = transferScrollData.getData('scrollForAbs');
		  	if (scrollForHeader - headerHeight < scrolled) {
		  		header.style.position = 'absolute';
		  		header.style.top = scrollForHeader-headerHeight + 'px';
		  	}
		  	else {
		  		header.style.position = 'fixed';
		    	header.style.top = '0px';
		    	transferScrollData.setData({name: 'currScroll' ,data:scrolled});
		  	}
		}
		startScroll = scrolled;
	}	

// hmbg menu
    let hmbgMenu = document.querySelector('.hmbg-menu');
    let menu = document.querySelector('.menu');
    hmbgMenu.addEventListener('click', hmbgMenuHandler);
    function hmbgMenuHandler (event) {
        menu.classList.toggle('hidden');
        event.preventDefault();
        event.stopPropagation();
        hmbgMenu.addEventListener('mouseout', hideMenu)
    }
    function hideMenu () {
        document.addEventListener('click', function() {
            menu.classList.add('hidden');
        })
    }
}