"use strict"

async function fetchJson(uri){
    const resp = await fetch(uri)
    .then(resp => resp.json())
    .catch(err => console.log('error while fetch: ', err))
    return resp
}

function closestDisplayedPokemon(pokemonId){
    let ids = Array.from(document.querySelectorAll('.pokemon .pokemon__id')).map(p => parseInt(p.textContent.substring(1).replace(/^0*/gi, '')))
    ids.push(pokemonId)
    let placeOfId = ids.sort((a, b) => a - b).indexOf(pokemonId)
    console.log(placeOfId)
    return placeOfId
    // let sortedIds = ids.sort((a, b) => a - b)
    // return sortedIds[sortedIds.length - 1]
}

async function fetchPokemonList(offset, limit){
    const pokemons = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`)
    .then(resp => resp.json())
    .catch(err => console.log('error while fetch: ', err))
    return pokemons.results
}

function findEvolution(evolutions, toFind){
    for(const evolution of evolutions){
        let finalReturn = findEvolution(evolution.evolves_to, toFind)
        if(finalReturn) return finalReturn
        if(evolution.species.name == toFind) return evolution
    }
    return null
}

async function loadAndDisplayPokemon(pokemonNameOrId){
    let pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNameOrId}`)
    .then(resp => resp.json())
    .catch(err => console.log('error while fetch: ', err))
    let clone = document.importNode(templatePokemon.content, true)

    let id = clone.querySelector('.pokemon__id')
    id.textContent = `#${String(pokemon.id).padStart(3, '0')}`

    let name = clone.querySelector('.pokemon__name')
    name.textContent = pokemon.name

    // checkbox
    let checkbox = clone.querySelector('input[type="checkbox"]')
    checkbox.addEventListener('change', (e) => {
        // if(!e.target.checked) return
        // select pokemon parent
        let parent = e.target.parentNode;
        while(!parent.classList.contains('pokemon')) parent = parent.parentNode;
        console.log(parent)
        let id = parseInt(parent.querySelector('.pokemon__id').textContent.substring(1))
        let name = parent.querySelector('.pokemon__name').textContent
        console.log(name)


        

        let pokeList;
        if(localStorage.getItem('pokemons')) pokeList = new Map(JSON.parse(localStorage.getItem('pokemons')))
        else pokeList = new Map()

        if(e.target.checked) pokeList.set(id, name)
        else pokeList.delete(id)
        
        localStorage.setItem('pokemons', JSON.stringify(Array.from(pokeList.entries())))
    })

    let pokeList = new Map(JSON.parse(localStorage.getItem('pokemons')))
    if(pokeList.has(pokemon.id)) checkbox.checked = true;
    else checkbox.checked = false;


    let height = clone.querySelector('.pokemon__height')
    height.textContent = pokemon.height

    let weight = clone.querySelector('.pokemon__weight')
    weight.textContent = pokemon.weight

    let img = clone.querySelector('.pokemon__img')
    img.src = pokemon.sprites.front_default
    img.alt = `Sprite of ${pokemon.name}`

    let types = clone.querySelector('.pokemon__types')
    if(pokemon.types.length == 1) types.textContent = pokemon.types[0].type.name
    else types.textContent = `${pokemon.types[0].type.name} ${pokemon.types[1].type.name}`

    let abilities = clone.querySelector('.pokemon__abilities')
    pokemon.abilities.forEach(ability => {
        abilities.textContent = ability.name
    });

    let hp = clone.querySelector('.pokemon__hp')
    hp.children[1].textContent = pokemon.stats[0].base_stat

    let atk = clone.querySelector('.pokemon__atk')
    atk.children[1].textContent = pokemon.stats[1].base_stat

    let def = clone.querySelector('.pokemon__def')
    def.children[1].textContent = pokemon.stats[2].base_stat

    let speAtk = clone.querySelector('.pokemon__speAtk')
    speAtk.children[1].textContent = pokemon.stats[3].base_stat

    let speDef = clone.querySelector('.pokemon__speDef')
    speDef.children[1].textContent = pokemon.stats[4].base_stat

    let spd = clone.querySelector('.pokemon__spd')
    spd.children[1].textContent = pokemon.stats[5].base_stat

    // evolutions
    let variety = await fetchJson(pokemon.species.url)
    let evolutionChain = await fetchJson(variety.evolution_chain.url)
    let evolution = findEvolution(evolutionChain.chain.evolves_to, pokemon.species.name)
    // console.log(`Evolution de ${pokemon.name}`, evolutionChain.chain.evolves_to[0].species.name)

    let current = clone.querySelector('.pokemon__current')
    current.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
    if(!evolution){
        let next = clone.querySelector('.pokemon__next')
        let evolutionId = await fetchJson(`https://pokeapi.co/api/v2/pokemon/${evolutionChain.chain.evolves_to[0].species.name}`)
        next.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolutionId.id}.png`
    } else {
        let next = clone.querySelector('.pokemon__next')
        if(evolution.evolves_to[0]){
            let evolutionId = await fetchJson(`https://pokeapi.co/api/v2/pokemon/${evolution.evolves_to[0].species.name}`)
            next.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolutionId.id}.png`
        } else {
            next.src = ""
        }
    }
    // let next = clone.querySelector('.pokemon__next')
    // let evolutionId = fetchJson(`https://pokeapi.co/api/v2/pokemon/${evolution.species.name}`)
    // next.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolutionId}.png`

    
    // console.log(pokemon.id)
    let addAfter = document.querySelector(`#pokemons:nth-child(${closestDisplayedPokemon(pokemon.id)})`)
    // console.log(!addAfter)
    if(!addAfter) pokemonsContainer.appendChild(clone)
    else if (pokemon.id == 3) pokemonsContainer.appendChild(clone)
    else addAfter.after(clone)
    // console.log(`#pokemons:nth-child(${closestDisplayedPokemon(pokemon.id)})`)
    
    // pokemonsContainer.appendChild(clone)
}

async function start(toLoad){
    const pokemons = await fetchPokemonList(0, toLoad);
    for (const pokemon of pokemons){
        await loadAndDisplayPokemon(pokemon.name)
    }
    lastLoaded = toLoad - 1
}

let templatePokemon = document.querySelector('.template__pokemon')
let pokemonsContainer = document.querySelector('#pokemons')
let lastLoaded;
let pokemons;



// const array1 = [1, 4, 9, 16];

// // pass a function to map
// const map1 = array1.map(x => x * 2);

// const map1 = new Map();

// map1.set(1, 'a');
// map1.set(2, 'b');
// map1.set(3, 'c');

// localStorage.setItem('pokemons', JSON.stringify(Array.from(map1.entries())))
// console.log(map1)

window.addEventListener('scroll', async (e) => {
    let distanceToTheEnd = document.body.offsetHeight - (window.innerHeight + window.pageYOffset)
    if(distanceToTheEnd < document.querySelector('.pokemon').offsetHeight) {
        lastLoaded += 1
        await loadAndDisplayPokemon(lastLoaded + 1)
    }
    console.log("lastLoaded : ", lastLoaded)
})

let filters = document.querySelectorAll('.sideBar button')
filters.forEach(btn => {
    btn.addEventListener('click', (e) => {
        if(e.target.textContent == 'All'){
            document.querySelectorAll('.pokemon').forEach(pokemon => {
                pokemon.style.display = "block"
                
            })
            return
        }
        document.querySelectorAll('.pokemon').forEach(pokemon => {
            let types = pokemon.querySelector('.pokemon__types').textContent.split(' ')
            console.log(types)
            console.log(e.target.textContent)
            console.log(types.indexOf(e.target.textContent.toLowerCase()))
            if(types.indexOf(e.target.textContent.toLowerCase()) != -1) pokemon.style.display = "block"
            else pokemon.style.display = "none"
        })
    })
})



start(6)

