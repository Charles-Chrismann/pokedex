let a = 0

function findEvolution(evolutions, toFind){
    for(const evolution of evolutions){
        let finalReturn = findEvolution(evolution.evolves_to, toFind)
        if(finalReturn) return finalReturn
        if(evolution.species.name == toFind) return evolution
    }
    return null
}

let evo = {
    "baby_trigger_item": null,
    "chain": {
      "evolution_details": [],
      "evolves_to": [
        {
          "evolution_details": [],
          "evolves_to": [
            {
              "evolution_details": [],
              "evolves_to": [
                {
                    "evolution_details": [],
                    "evolves_to": [],
                    "is_baby": false,
                    "species": {
                      "name": "venusaur-V1.1.1",
                      "url": "https://pokeapi.co/api/v2/pokemon-species/3/"
                    }
                },
                {
                    "evolution_details": [],
                    "evolves_to": [],
                    "is_baby": false,
                    "species": {
                      "name": "venusaur-V1.1.2",
                      "url": "https://pokeapi.co/api/v2/pokemon-species/3/"
                    }
                }
              ],
              "is_baby": false,
              "species": {
                "name": "venusaur-V1.1",
                "url": "https://pokeapi.co/api/v2/pokemon-species/3/"
              }
            }
          ],
          "is_baby": false,
          "species": {
            "name": "ivysaur-V1",
            "url": "https://pokeapi.co/api/v2/pokemon-species/2/"
          }
        },
        {
            "evolution_details": [],
            "evolves_to": [
              {
                "evolution_details": [],
                "evolves_to": [],
                "is_baby": false,
                "species": {
                  "name": "venusaur-V2.1",
                  "url": "https://pokeapi.co/api/v2/pokemon-species/3/"
                }
              },
              {
                "evolution_details": [],
                "evolves_to": [],
                "is_baby": false,
                "species": {
                  "name": "venusaur-V2.2",
                  "url": "https://pokeapi.co/api/v2/pokemon-species/3/"
                }
              }
            ],
            "is_baby": false,
            "species": {
              "name": "ivysaur-V2",
              "url": "https://pokeapi.co/api/v2/pokemon-species/2/"
            }
          },
          {
            "evolution_details": [],
            "evolves_to": [],
            "is_baby": false,
            "species": {
              "name": "ivysaur-V3",
              "url": "https://pokeapi.co/api/v2/pokemon-species/2/"
            }
          }
      ],
      "is_baby": false,
      "species": {
        "name": "bulbasaur",
        "url": "https://pokeapi.co/api/v2/pokemon-species/1/"
      }
    },
    "id": 1
  }

// console.log(evo)
console.log("Final Result :", findEvolution(evo.chain.evolves_to, "bulbasaur"))

