const { gql } = require("apollo-server-express");
const fs = require("fs");
const { DateTimeResolver } = require("graphql-scalars");

const schemaArray = [];
const resolversArray = [];

const root = gql`
    scalar DateTime

    type Query {
        root: String
    }
    type Mutation {
        root: String
    }
    type DeleteResponse {
        ok: Boolean!
    }
`;

const rootResolvers = {
    DateTime: DateTimeResolver
}

schemaArray.push(root);
resolversArray.push(rootResolvers);

fs.readdirSync("./schema").forEach(function (file) {
    if (file != "index.js") {
        let name = file.replace(".js", "");
        exports[name] = require('./' + file);
        schemaArray.push(exports[name].schema);
        resolversArray.push(exports[name].resolvers);
    }
});

module.exports = { schemaArray, resolversArray }