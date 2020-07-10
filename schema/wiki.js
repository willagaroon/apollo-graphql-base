const { gql } = require("apollo-server-express");

const schema = gql`
    type Wiki @cacheControl(maxAge: 60) {
        id: ID!
        name: String!
        url(version: String): String!
        created_at: DateTime
    }

    extend type Query {
        wiki(name: String!): Wiki
        wikis: [Wiki]
    }

    extend type Mutation {
        addWiki(name: String!, url: String!): Wiki
        editWiki(id: ID!, name: String, url: String): Wiki
        deleteWiki(id: ID!): DeleteResponse
    }
`;

const resolvers = {
    Query: {
        wiki: async (parent, _args, { dataSources }) => {
            return dataSources.swDB.getWiki(_args.name);
        },
        wikis: async (parent, _args, { dataSources }) => {
            return await dataSources.swDB.getWikis();
        }
    },
    Wiki: {
        url: async (parent, _args) => {
            return parent.url;
        }
    },
    Mutation: {
        addWiki: async (parent, _args, { dataSources }) => {
            return await dataSources.swDB.addWiki(_args);
        },
        editWiki: async (parent, _args, { dataSources }) => {
            return await dataSources.swDB.editWiki(_args);
        },
        deleteWiki: async (parent, _args, { dataSources }) => {
            return await dataSources.swDB.deleteWiki(_args.id);;
        }
    }
};

module.exports = { schema, resolvers };