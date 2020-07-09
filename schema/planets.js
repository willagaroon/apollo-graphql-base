const { gql } = require("apollo-server-express");

const schema = gql`
    type Planet @cacheControl(maxAge: 3600) {
        "**id** does not exist via the SWAPI but is helpful, so we have a custom resolver to extract it from the url"
        id: Int
        name: String
        climate: String
        diameter: Int
        gravity: String
        orbital_period: Int
        population: Int
        rotation_period: Int
        "**surface_water** returns a 1 or 0 from SWAPI but Boolean is better, so we have a custom resolver to convert to Boolean"
        surface_water: Boolean
        terrain: String
        """
        **residents** uses a resolver to get People instead of just URL's to People  
        **NOTE:** this makes a request to the SWAPI for each person, try not to use it too much otherwise you will hit rate limiting  
        **NOTE:** response caching helps, but if the response changes (fields are added/removed) it will pull all new data
        """
        residents: [People]
        "**films** returns an array of URL's from SWAPI, so we have a custom resolver to convert to an array of Int for the id instead"
        films: [Int]
        url: String
    }

    extend type Query {
        planet(id: ID!): Planet
        planets: [Planet]
    }
`;

const resolvers = {
    Query: {
        planet: async (parent, _args, { dataSources }) => {
            return dataSources.swAPI.getPlanet(_args.id);
        },
        planets: async (parent, _args, { dataSources }) => {
            // SWAPI returns paginated data, for example purposes we are only pulling the first page
            const resp = await dataSources.swAPI.getPlanets();
            return resp.results;
        }
    },
    Planet: {
        // resolver to extract the id from the url
        id: (parent, _args) => {
            let pieces = parent.url.split(/[\s//]+/);
            return pieces[pieces.length-2];
        },
        surface_water: (parent, _args) => {
            return Boolean(parent.surface_water);
        },
        residents: async (parent, _args, { dataSources }, info) => {
            let residents = [];
            parent.residents.forEach(resident => {
                let pieces = resident.split(/[\s//]+/);
                residents.push(pieces[pieces.length-2]);
            })
            info.cacheControl.setCacheHint({ maxAge: 3600 });
            return await dataSources.swAPI.getSpecificPeople(residents);
        },
        films: async (parent, _args) => {
            let films = [];
            parent.films.forEach(film => {
                let pieces = film.split(/[\s//]+/);
                films.push(pieces[pieces.length-2]);
            })
            return films;
        }
    }
};

module.exports = { schema, resolvers };