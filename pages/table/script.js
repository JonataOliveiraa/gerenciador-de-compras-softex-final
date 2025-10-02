// `
// <tr>
//     <td class="border">1</td>
//     <td class="border">
//         <button>Editar</button>
//         <button>Remover</button>
//     </td>
//     <td class="border">Creme</td>
//     <td class="border">100</td>
//     <td class="border">Limpeza</td>
//     <td class="border">Empresa</td>
//     <td class="border">ABA-21312</td>
//     <td class="border">11/11/1111</td>
// </tr>
// `

//Atualizando tabela
const sortTableButton = document.querySelector('#sort-table')
const searchProductInput = document.querySelector("#search-from-input")
const typeProductSelect = document.querySelector("#product-search-info-type")
const searchProductButton = document.querySelector("#search-product-button")
const tableBody = document.querySelector('tbody')

function getProductListFromStorage() {
    return JSON.parse(localStorage.getItem('products-list') ?? '[]')
}

function setProductListFromStorage(products) {
    localStorage.setItem('products-list', JSON.stringify(products))
}

function updateTable() {
    function addButtonsEvent(tr) {
        const name = tr.querySelector('.name');
        const value = tr.querySelector('.value');
        const category = tr.querySelector('.category');
        const origin = tr.querySelector('.origin');
        const batch = tr.querySelector('.batch');
        const date = tr.querySelector('.date');
        const editButton = tr.querySelector('.edit-btn');
        const deleteButton = tr.querySelector('.delete-btn');

        deleteButton.addEventListener('click', () => {
            tr.remove()

            const productList = getProductListFromStorage()
            const index = productList.findIndex(product => product[0] === name.textContent)

            if(index >= 0) {
                productList.splice(index, 1)
                setProductListFromStorage(productList)
                updateTable()
            }
        })

        editButton.addEventListener('click', () => {
            const body = document.querySelector('body')
            const div = document.createElement('div')

            div.className = `flex fixed inset-0 items-center justify-center bg-black/30`
            div.innerHTML = `
                <div class="relative flex flex-col gap-4 bg-white p-3 mx-2 border rounded-xl z-20" id="container">
                    <button class="absolute flex items-center justify-center w-6 h-6 top-2 right-2 text-white bg-red-500 rounded-full hover:bg-red-600 cursor-pointer" id="close-popup-button"><i class="ri-close-line"></i></button>
                    <div>
                        <h1 class="text-xl font-bold">Editar Produto</h1>
                    </div>
                    <div class="flex flex-wrap gap-2 mx-5 justify-between">   
                        <div>
                            <label for="create-product-name">Nome:</label>
                            <input type="text" id="create-product-name" name="create-product-name" placeholder="Produto..." value="${name.textContent}" class="border px-1">
                            
                            <label for="create-product-value">R$</label>
                            <input type="number" id="create-product-value" name="create-product-value" min="0" max="10000" placeholder="2" value="${value.textContent}" class="border w-20 px-1 text-center">
                        </div>
                        <div class="flex">
                            <label for="create-select-category">Categoria:</label>
                            <select name="create-select-category" id="create-select-category" class="border px-1 ml-1">
                                <option value="void">Vazio</option>
                            </select>
                        </div>
                    </div>
            
                    <div class="flex flex-wrap gap-2 mx-5 justify-between">
                        <div>
                            <label for="create-product-origin">Origem:</label>
                            <input type="text" id="create-product-origin" name="create-product-name" placeholder="Comida, Ferramenta..." value="${origin.textContent}" class="border px-1">
                        </div>
                            
                        <div>
                            <label for="create-product-lote">Nº de Lote:</label>
                            <input type="text" id="create-product-batch" name="create-product-batch" placeholder="Lote 2025-01A" value="${batch.textContent}" class="border px-1">
                        </div>
                    </div>

                    <div class="flex gap-2 mx-5">
                        <label for="create-product-lote">Data:</label>
                        <input type="date" id="create-product-date" value="${date.textContent}" class="border">
                    </div>
                    <span class="text-red-400 text-center invisible" id="text-error">Preencha todos os campos!</span>
                    <div class="flex w-full mt-auto gap-1">
                        <button class="flex-1 px-1 rounded-sm bg-yellow-500 cursor-pointer hover:bg-yellow-600 border" id="confirm-product-button">Confirmar</button> 
                        <button class="flex-1 px-1 rounded-sm bg-red-500 cursor-pointer hover:bg-red-600 border" id="cancel-product-button">Cancelar</button> 
                    </div>
                </div>
            `

            const divContainer = div.querySelector('#container')
            const productName = div.querySelector('#create-product-name')
            const productValue = div.querySelector('#create-product-value')
            const productCategory = div.querySelector('#create-select-category')
            const productOrigin = div.querySelector('#create-product-origin')
            const productBatch = div.querySelector('#create-product-batch')
            const productDate = div.querySelector('#create-product-date')
            const productCloseContainerButton = div.querySelector('#close-popup-button')
            const productConfirmButton = div.querySelector('#confirm-product-button')
            const productCancelButton = div.querySelector('#cancel-product-button')

            productCategory.innerHTML = `<option value="void">Vazio</option>`

            const category = [...JSON.parse(localStorage.getItem('category-list') ?? '[]')]
            category.forEach(c => {
                productCategory.innerHTML += `<option value="${c[0]}" class="bg-[${c[1]}]">${c[0]}</option>`
            })

            divContainer.addEventListener('click', () => {
                event.stopPropagation()
            })
            
            div.addEventListener('click', () => {
                div.remove()
            })

            productCloseContainerButton.addEventListener('click', () => {
                div.remove()
            })

            productConfirmButton.addEventListener('click', () => {
                function showError(msg) {
                    const text = div.querySelector('#text-error')
                    text.textContent = msg
                    text.classList.toggle('invisible')
                    
                    setTimeout(() => text.classList.toggle('invisible'), 2000);
                }

                let products = getProductListFromStorage()
                let productTableOrigin = products.find(product => product[0] === name.textContent)
                const productFind = products.find(product => product[0] === productName.value)

                if(productFind && productFind[0] !== productTableOrigin[0]) {
                    showError('Já existe um elemento com esse nome!')
                    return;
                }

                if(!productName.value || !productOrigin.value || !productBatch.value || !productDate.value) {
                    showError('Preencha todos os campos!')
                    return;
                }

                products = products.map(product => {
                    if(product[0] === productTableOrigin[0]) {
                        productTableOrigin = [
                            productName.value,
                            productValue.value,
                            productCategory.value,
                            productOrigin.value,
                            productBatch.value,
                            productDate.value
                        ]
                        return productTableOrigin
                    }
                    return product  
                })

                setProductListFromStorage(products)
                div.remove()
                updateTable()
            })

            productCancelButton.addEventListener('click', () => {
                div.remove()
            })

            body.prepend(div)
        })
    }

    tableBody.innerHTML = ''

    let products = getProductListFromStorage()
    products.forEach(product => {
        const tr = document.createElement('tr')

        tr.innerHTML += `
        <td class="border">
            <div class="flex h-full">
                <button class="edit-btn flex-1 h-full bg-blue-400 hover:bg-blue-500 hover:text-white cursor-pointer"><i class="ri-pencil-line"></i></button>
                <button class="delete-btn flex-1 h-full  bg-red-500 hover:bg-red-600 hover:text-white  cursor-pointer"><i class="ri-delete-bin-line"></i></button>
            </div>
        </td>
        <td class="name border">${product[0]}</td>
        <td class="value border">${product[1]}</td>
        <td class="category border">${product[2]}</td>
        <td class="origin border">${product[3]}</td>
        <td class="batch border">${product[4]}</td>
        <td class="date border">${product[5].split("-").reverse().join('/')}</td>
        `
        addButtonsEvent(tr)
        tableBody.appendChild(tr)
    });
}
updateTable()

//Cabeçalho do table (ordenaçao, pesquisa, etc)

function sortTable(method) {
    let products = getProductListFromStorage()
    let length = products.length
    let changed;

    switch (method) {
        case 'name':
            do {
                changed = false
                for(let i = 0 ; i < length - 1 ; i++) {
                    if(products[i][0].toLowerCase() > products[i + 1][0].toLowerCase()) {
                        const bigger = products[i][0]
                        products[i][0] = products[i + 1][0]
                        products[i + 1][0] = bigger
                        changed = true
                    }
                }

                length--
            } while(changed)
            break;

        case 'value':
            do {
                changed = false
                for(let i = 0 ; i < length - 1 ; i++) {
                    if(Number(products[i][1]) > Number(products[i + 1][1])) {
                        const bigger = Number(products[i][1])
                        products[i][1] = Number(products[i + 1][1])
                        products[i + 1][1] = bigger
                        changed = true
                    }
                }

                length--
            } while(changed)
            products = products.reverse()
            break;

            case 'date':
            do {
                changed = false
                for(let i = 0 ; i < length - 1 ; i++) {
                    if(new Date(products[i][5]) > new Date(products[i + 1][5])) {
                        const bigger = products[i][5]

                        products[i][5] = products[i + 1][5]
                        products[i + 1][5] = bigger
                        changed = true
                    }
                }

                length--
            } while(changed)
            products = products.reverse()
            break;
    
        default:
            break;
    }

    return products
}

sortTableButton.addEventListener('click', () => {
    const selection = document.querySelector('#product-sort-type')
    const sortedProducts = sortTable(selection.value)

    if(sortedProducts) {
        setProductListFromStorage(sortedProducts)
        updateTable()
    }
})

typeProductSelect.addEventListener('change', () => {
    const selectValue = Number(typeProductSelect.value)
    if(selectValue === 5) {
        searchProductInput.type = 'date'
    } else {
        searchProductInput.type = 'text'
    }
})

searchProductButton.addEventListener('click', () => {
    const inputValue = searchProductInput.value
    const selectValue = Number(typeProductSelect.value)

    const products = getProductListFromStorage()
    const index = products.findIndex(p => p[selectValue] === inputValue)

    if(index >= 0 ) {
        const finded = products[index]

        products.splice(index, 1)
        products.unshift(finded)
        setProductListFromStorage(products)
        updateTable()
    }
})