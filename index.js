const $ = el => document.querySelector(el)
const _ = el => document.querySelectorAll(el)

const convert = {
    first: 10,
    second: 2
}

const tableBCH = {
    "0000": "0",
    "0001": "1",
    "0010": "2",
    "0011": "3",
    "0100": "4",
    "0101": "5",
    "0110": "6",
    "0111": "7",
    "1000": "8",
    "1001": "9",
    "1010": "A",
    "1011": "B",
    "1100": "C",
    "1101": "D",
    "1110": "E",
    "1111": "F"
}

const tableBCO = {
    "000": "0",
    "001": "1",
    "010": "2",
    "011": "3",
    "100": "4",
    "101": "5",
    "110": "6",
    "111": "7"
}

let place = $('.gridRes')
let finalStep = $('.finalStep')
let urutan = $('.urutan')

function handleChange(val){
    let type = val.split(',')

    convert.first = parseInt(type[0])
    convert.second = parseInt(type[1])
}

function validate(){
    let init = $('.b').value.toUpperCase()
    if(init == 0) return

    place.innerHTML = ''
    urutan.style.display = 'none'
    finalStep.innerHTML = ''

    switch(convert.first){
        case 10:
            dec(init)
            break;
        case 2:
            bin(init)
            break;
        case 8:
            oct(init)
            break;
        case 16:
            hex(init)
            break;
        default:
            break;
    }
}

function dec(i){
    if(isNaN(parseInt(i, 10))) return alert("Bukan bilangan desimal!")

    _('.result').forEach( el => el.style.display = "block")
    var input = new Number (i)

    let init = parseInt(i)
    let basis = convert.second

    while(input != 0){
        place.innerHTML += `<span class="step">${input} : ${basis} = ${Math.floor(input/basis)} sisa ${input%basis} = <b> ${(input%basis).toString(basis).toUpperCase()}</b></span><br/>`
        
        input = Math.floor(input/basis)
    }

    finalStep.innerHTML = `<b>${init}<sub>${convert.first}</sub> = ${init.toString(basis).toUpperCase()}<sub>${convert.second}</sub></b>`
    urutan.style.display = 'block'
} 

function bin(i, another = false){
    if(!i.split('').every(el => el == 0 || el == 1)) return alert("Bukan bilangan biner!")

    urutan.style.display = 'none'
    _('.result').forEach( el => el.style.display = "block")

    if(convert.second == 10) return toDec(i)

    let init = i,
        divider,
        table,
        tableName;

    if(convert.second == 16){
        divider = 4
        table = tableBCH
        tableName = "BCH"
    }

    if(convert.second == 8){
        divider = 3
        table = tableBCO
        tableName = "BCO"
    }

    if(i.length % divider != 0) init = "0".repeat(divider-(i.length%divider)) + init
    
    let initDevided = new Array(init.length / divider)
        .fill()
        .map((el,id) => init.slice(id*divider, (id+1)*divider));

    let converted = initDevided.map( el => table[el])

    if(another) return {res: converted.join('').toUpperCase(), code: `<table><tr>${initDevided.map(el => `<td>${el}</td>`).join(" ")} </tr>
    <tr>${converted.map(el => `<td>${el}</td>`).join(" ")}</tr></table><span class="step"><b>${i}<sub>2</sub> = ${converted.join('').toUpperCase()}<sub>${convert.second}</sub></b></span><br/>`}

    place.style.textAlign = 'center'

    place.innerHTML = `<span class="step">Bilangan Biner dipecah menjadi ${divider} bagian dari kanan, berdasarkan tabel ${tableName}</span><br/>`
    place.innerHTML += `<table><tr>${initDevided.map(el => `<td>${el}</td>`).join(" ")} </tr>
    <tr>${converted.map(el => `<td>${el}</td>`).join(" ")}</tr></table>`
    place.innerHTML += `<span class="step"><b>${i}<sub>2</sub> = ${converted.join('').toUpperCase()}<sub>${convert.second}</sub></b></span><br/>`
}

function oct(i){
    if(isNaN(parseInt(i, 8))) return alert("Bukan bilangan oktal!")

    urutan.style.display = 'none'
    _('.result').forEach( el => el.style.display = "block")

    if(convert.second == 10) return toDec(i)
    if(convert.second == 2) return toBin(i)

    let basis = convert.first
    let targetBasis = convert.second

    const data = toBin(i, true)
    const data2 = bin(data.res, true)

    place.style.textAlign = "center"
    place.innerHTML = `<span class="step">Ubah oktal ke biner sesuai tabel BCO</span>`
    place.innerHTML += data.code
    place.innerHTML += `<span class="step">Ubah biner ke heksadesimal sesuai tabel BCH</span>`
    place.innerHTML += data2.code
    place.innerHTML += `<span class="step">Hasil <b>${i}<sub>${basis}</sub> = ${data2.res}<sub>${targetBasis}</sub></span>`
}

function hex(i){
    if(isNaN(parseInt(i, 16))) return alert("Bukan bilangan heksadesimal!")

    urutan.style.display = 'none'
    _('.result').forEach( el => el.style.display = "block")

    if(convert.second == 10) return toDec(i)
    if(convert.second == 2) return toBin(i)

    let basis = convert.first
    let targetBasis = convert.second

    const data = toBin(i, true)
    const data2 = bin(data.res, true)

    place.style.textAlign = "center"
    place.innerHTML = `<span class="step">Ubah heksadesimal ke biner sesuai tabel BCH</span>`
    place.innerHTML += data.code
    place.innerHTML += `<span class="step">Ubah biner ke oktal sesuai tabel BCO</span>`
    place.innerHTML += data2.code
    place.innerHTML += `<span class="step">Hasil <b>${i}<sub>${basis}</sub> = ${data2.res}<sub>${targetBasis}</sub></span>`

}

function toBin(i, another = false){

    let table,
        tableName;

    if(convert.first == 16){
        table = tableBCH
        tableName = "BCH"
    }

    if(convert.first == 8){
        table = tableBCO
        tableName = "BCO"
    }
    
    let initDevided = i.split('')
    let converted = initDevided.map( el => Object.keys(table).find( key => table[key] == el))

    
    if(another) return {res: converted.join('').toUpperCase(), code:`<table><tr>${initDevided.map(el => `<td>${el}</td>`).join(" ")} </tr><tr>${converted.map(el => `<td>${el}</td>`).join(" ")}</tr></table> <span class="step"><b>${i}<sub>${convert.first}</sub> = ${converted.join('').toUpperCase()}<sub>2</sub></b></span><br/>`};
    
    place.style.textAlign = 'center'
    place.innerHTML = `<span class="step">Pecah satu per satu dan cocokan dengan tabel ${tableName}</span><br/>`
    place.innerHTML += `<table><tr>${initDevided.map(el => `<td>${el}</td>`).join(" ")} </tr>
    <tr>${converted.map(el => `<td>${el}</td>`).join(" ")}</tr></table>`
    place.innerHTML += `<span class="step"><b>${i}<sub>2</sub> = ${converted.join('').toUpperCase()}<sub>${convert.second}</sub></b></span><br/>`

}

function toDec(i){

    let basis = convert.first
    let targetBasis = convert.second

    let init = parseInt(i, basis)
    let initArray = i.split('')

    let inside = []
    let inside2 = []
    let inside3 = []

    for(let j = i.length-1, k = 0; j >= 0; j--){
        inside.push(`(${initArray[k]} x ${basis}<sup>${j}</sup>)`)
        inside2.push(`(${parseInt(initArray[k], basis)} x ${basis ** j})`)
        inside3.push(parseInt(initArray[k], basis)*(basis**j))
        k++
    }

    place.style.textAlign = 'left'
    place.innerHTML = `<span class="step">${i}<sub>${basis}</sub> = ${inside.join(' + ')} </span><br/>`
    place.innerHTML += `<span class="step">${i}<sub>${basis}</sub> = ${inside2.join(' + ')} </span><br/>`
    place.innerHTML += `<span class="step">${i}<sub>${basis}</sub> = ${inside3.join(' + ')} </span><br/>`

    place.innerHTML += `<span class="step"><b>${i}<sub>${basis}</sub> = ${init.toString(targetBasis).toUpperCase()}<sub>${convert.second}</sub></b></p>`
    finalStep.innerHTML = ``
}

function select(){
    deSelect()

    if(document.selection){
        let range = document.body.createTextRange()
        range.moveToElementText(document.getElementById('res'))
        range.select()
    }

    if(window.getSelection){
        let range = document.createRange()
        range.selectNode(document.getElementById('res'))
        window.getSelection().addRange(range)
    }
}

function deSelect(){
    if(document.selection) document.selection.empty()
    if(window.getSelection) window.getSelection().removeAllRanges()
}

function pressed(event) {
    if (!(event.keyCode == 65 && event.ctrlKey)) return;
    event.preventDefault()
    select()
    return true;
}

document.addEventListener("keydown", (e) => pressed(e))