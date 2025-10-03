//Category
const categoryPopUpContainer = document.querySelector('#category-popup')
const categoryPopUpCloseButton = document.querySelector('#category-popup-close')
const categoryAddButton= document.querySelector('#category-add-button')
const categoryName = document.querySelector('#category-name-input')
const categoryColor = document.querySelector('#category-color-input')
const categoryCreateButton = document.querySelector('#category-create-new-button')
const categoryTableBody = document.querySelector('tbody')


function loadCategory() {
    function addButtonsEvent(tr) {
        const deleteButton = tr.querySelector('.delete-btn');
        const name = tr.querySelector('.name');
        const colorContainer = tr.querySelector('.color-container')
        const color = tr.querySelector('.color');
        const editButton = tr.querySelector('.edit-btn');

        deleteButton.addEventListener('click', e => {
            e.preventDefault()
            tr.remove()

            const categoryList = JSON.parse(localStorage.getItem('category-list') ?? '[]')
            const index = categoryList.findIndex(category => category[0] === name.textContent)

            if(index >= 0) {
                categoryList.splice(index, 1)
                localStorage.setItem('category-list', JSON.stringify(categoryList))
                loadCategoryFromContainer()
            }
        })

        editButton.addEventListener('click', e => {
            e.preventDefault()

            color.innerHTML = `<input type="text" value="${color.textContent}" class="w-full mx-auto text-center bg-green-200 outline-none"></input>`
            const input = color.querySelector('input[type="text"]')
            input.focus()

            function saveCategoryColorEdit(value) {
                if(!value) value = color.textContent

                const categoryList = JSON.parse(localStorage.getItem('category-list') ?? '[]')
                const update = categoryList.map(category => {
                    if(category[0] === name.textContent) return [category[0], value]
                    return category
                })
                localStorage.setItem('category-list', JSON.stringify(update))
                
                colorContainer.innerHTML = `
                <span class="color flex-4" id="color">${value}</span>
                <button class="edit-btn flex-1 bg-blue-400 cursor-pointer" id="edit-btn"><i class="ri-pencil-line"></i></button>`

                addButtonsEvent(tr)
                loadCategoryFromContainer()
            }

            const confirm = document.createElement('button')
            confirm.className = 'flex-1 bg-green-400 cursor-pointer'
            confirm.innerHTML = '<i class="ri-check-line"></i>'

            editButton.replaceWith(confirm)

            confirm.addEventListener('click', e => {
                e.preventDefault()
                saveCategoryColorEdit(input.value)
            })
            input.addEventListener('blur', () => saveCategoryColorEdit(input.value))
        })
    }

    const tr = document.createElement('tr')
    tr.innerHTML = `
        <td class="border">
            <button class="delete-btn flex-1 bg-red-500 w-full cursor-pointer"><i class="ri-delete-bin-line"></i></button>
        </td>
        <td class="name border">Vazio</td>
        <td class="border">
            <div class="color-container flex">
                <span class="color flex-4">#CCCCCC</span>
                <button class="edit-btn flex-1 bg-blue-400 cursor-pointer"><i class="ri-pencil-line"></i></button>
            </div>
        </td>
    `
    addButtonsEvent(tr)
    categoryTableBody.replaceChildren(tr)

    JSON.parse(localStorage.getItem('category-list') ?? '[]').forEach(c => {
        const tr = document.createElement('tr')
        tr.innerHTML += `
            <td class="border">
                <button class="delete-btn flex-1 bg-red-500 w-full cursor-pointer"><i class="ri-delete-bin-line"></i></button>
            </td>
            <td class="name border">${c[0]}</td>
            <td class="border">
                <div class="color-container flex">
                    <span class="color flex-4">${c[1]}</span>
                    <button class="edit-btn flex-1 bg-blue-400 cursor-pointer"><i class="ri-pencil-line"></i></button>
                </div>
            </td>
        `
        addButtonsEvent(tr)
        categoryTableBody.appendChild(tr)
    });
}

function loadCategoryFromContainer() {
    const productSelectCategory = document.querySelector("#create-select-category")
    productSelectCategory.innerHTML = `<option value="void">Vazio</option>`

    const category = [...JSON.parse(localStorage.getItem('category-list') ?? '[]')]
    category.forEach(c => {
        productSelectCategory.innerHTML += `<option value="${c[0]}" class="bg-[${c[1]}]">${c[0]}</option>`
    })
}

function addCategory(name, hex) {
    const isValidHex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);
    if(!(name && hex)) return;

    //Salvando
    const category = [...JSON.parse(localStorage.getItem('category-list') ?? '[]')]
    category.push([name, hex])
    localStorage.setItem('category-list', JSON.stringify(category))

    //Carregando categorias na area de criação
    loadCategoryFromContainer()
}


categoryAddButton.addEventListener('click', e => {
    e.preventDefault()

    document.querySelector('#category-popup').classList.toggle('hidden')
    loadCategory()
})

categoryCreateButton.addEventListener('click', e => {
    e.preventDefault()
    console.log('a')

    const categoryCreatorContainer = document.querySelector('#category-creator')

    addCategory(categoryName.value, categoryColor.value)
    loadCategory()
    categoryCreatorContainer.reset()
})

categoryPopUpCloseButton.addEventListener('click', e => {
    e.preventDefault()

    categoryPopUpContainer.classList.toggle('hidden')
})

loadCategoryFromContainer()


//Create
const productName = document.querySelector('#create-product-name')
const productValue = document.querySelector('#create-product-value')
const productCategory = document.querySelector('#create-select-category')
const productOrigin = document.querySelector('#create-product-origin')
const productBatch = document.querySelector('#create-product-batch')
const productDate = document.querySelector('#create-product-date')
const productCreateButton = document.querySelector('#create-product-button')

function getProductListFromStorage() {
    return JSON.parse(localStorage.getItem('products-list') ?? '[]')
}

function showError(msg) {
    const msgError = document.querySelector('#text-error')

    msgError.textContent = msg
    msgError.classList.toggle('invisible')
    
    setTimeout(() => msgError.classList.toggle('invisible'), 2000);
}

function addProductInStorage(name, value, category, origin, batch, date) {
    let products = getProductListFromStorage()
    let productTableOrigin = products.find(product => product[0] === name)
    const productFind = products.find(product => product[0] === value)

    if(productFind && productFind[0] !== productTableOrigin[0]) return;
    if(!productName.value || !productOrigin.value || !productBatch.value || !productDate.value) return;

    products.push([name, Number(value), category, origin, batch, date])

    localStorage.setItem('products-list', JSON.stringify(products))
    
    //Notification
    const notification = document.querySelector('#notification')

    notification.classList.remove('hidden')
    notification.classList.remove('translate-x-[-100%]')
    notification.classList.add('translate-x-0')

    setTimeout(() => {
        notification.classList.remove('translate-x-0')
        notification.classList.add('translate-x-[-100%]')
    }, 2000);
}

productCreateButton.addEventListener('click', e => {
    e.preventDefault()
    let products = getProductListFromStorage()
    const productFind = products.find(product => product[0] === productName.value)
    const productCreatorContainer = document.querySelector('#product-creator')

    if(productFind) {
        showError('Já existe um elemento com esse nome!')
        return;
    }

    if(!productName.value || !productOrigin.value || !productBatch.value || !productDate.value) {
        showError('Preencha todos os campos!')
        return;
    }

    addProductInStorage(productName.value, Number(productValue.value), productCategory.value, productOrigin.value , productBatch.value, productDate.value)
    productCreatorContainer.reset()
})

