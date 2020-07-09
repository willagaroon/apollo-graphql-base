const { gql } = require("apollo-server-express");

const schema = gql`
    type People @cacheControl(maxAge: 3600) {
        "**id** does not exist via the SWAPI but is helpful, so we have a custom resolver to extract it from the url"
        id: Int
        name: String
        birth_year: String
        eye_color: String
        gender: String
        hair_color: String
        height: Int
        mass: Int
        skin_color: String
        "**homeworld** returns a URL from SWAPI, so we have a custom resolver to extract the id from the url"
        homeworld: Int
        films: [String]
        species: [String]
        vehicles: [String]
        starships: [String]
        "**wiki** is being pulled from a postgres database!"
        wiki: Wiki
        url: String
    }

    extend type Query {
        person(id: ID!): People
        people: [People]
        personByName(name: String!): [People]
    }
`;

const resolvers = {
    Query: {
        person: async (parent, _args, { dataSources }) => {
            return dataSources.swAPI.getPerson(_args.id);
        },
        people: async (parent, _args, { dataSources }) => {
            // SWAPI returns paginated data, for example purposes we are only pulling the first page
            return (await dataSources.swAPI.getPeople()).results;
        },
        personByName: async (parent, _args, { dataSources }) => {
            return (await dataSources.swAPI.getPersonByName(_args.name)).results;
        }
    },
    People: {
        id: (parent, _args) => {
            let pieces = parent.url.split(/[\s//]+/);
            return pieces[pieces.length-2];
        },
        homeworld: (parent, _args) => {
            let pieces = parent.homeworld.split(/[\s//]+/);
            return pieces[pieces.length-2];
        },
        wiki: async (parent, _args, { dataSources }) => {
            return (await dataSources.swDB.getWiki(parent.name));
        }
    }
};

module.exports = { schema, resolvers };