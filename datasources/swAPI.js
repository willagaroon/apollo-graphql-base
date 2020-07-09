const { RESTDataSource } = require("apollo-datasource-rest");

class SWAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = "https://swapi.dev/api/";
    }

    async getPlanets() {
        return this.get("planets");
    }

    async getPlanet(id) {
        return this.get(`planets/${id}`);
    }

    async getPeople() {
        return this.get("people");
    }

    async getPerson(id) {
        return this.get(`people/${id}`);
    }

    async getPersonByName(name) {
        return this.get(`people/?search=${name}`);
    }

    async getSpecificPeople(ids) {
        const each = (arr, cb, i = 0) => i < arr.length ? Promise.resolve(cb(arr[i++])).then(() => each(arr, cb, i)) : Promise.resolve();
        let people = []
        await each(ids, async(id) => {
            const person = await this.get(`people/${id}`);
            people.push(person);
        });
        return people;
    }
}

module.exports = SWAPI;