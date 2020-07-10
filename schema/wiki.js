const { gql } = require("apollo-server-express");

// the database table name for this schema
const table = "sw";

const schema = gql`
    type Wiki @cacheControl(maxAge: 60) {
        id: ID!
        name: String!
        url: String!
        created_at: DateTime
    }

    input WikiInput {
        name: String,
        url: String
    }

    extend type Query {
        wiki(name: String!): Wiki
        wikis: [Wiki]
    }

    extend type Mutation {
        addWiki(input: WikiInput): Wiki
        editWiki(id: ID!, input: WikiInput): Wiki
        deleteWiki(id: ID!): DeleteResponse
    }
`;

const resolvers = {
    Query: {
        wiki: async (parent, _args, { dataSources }) => {
            return dataSources.swDB.getOneDoc(table, { name: _args.name });
        },
        wikis: async (parent, _args, { dataSources }) => {
            return await dataSources.swDB.getAllDocs(table);
        }
    },
    Mutation: {
        addWiki: async (parent, _args, { dataSources }) => {
            return await dataSources.swDB.addDoc(table, _args.input);
        },
        editWiki: async (parent, _args, { dataSources }) => {
            return await dataSources.swDB.editDoc(table, _args.id, _args.input);
        },
        deleteWiki: async (parent, _args, { dataSources }) => {
            return await dataSources.swDB.deleteDoc(table, _args.id);
        }
    }
};

module.exports = { schema, resolvers };