const { gql } = require("apollo-server-express");
const fs = require("fs");

const schemaArray = [];
const resolversArray = [];

const root = gql`
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

schemaArray.push(root);

fs.readdirSync("./schema").forEach(function (file) {
    if (file != "index.js") {
        let name = file.replace(".js", "");
        exports[name] = require('./' + file);
        schemaArray.push(exports[name].schema);
        resolversArray.push(exports[name].resolvers);
    }
});

module.exports = { schemaArray, resolversArray }