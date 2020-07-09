const express = require("express");
const cors = require("cors");
const { ApolloServer, gql } = require("apollo-server-express");
const responseCachePlugin = require("apollo-server-plugin-response-cache");
const massive = require("massive");
const { schemaArray, resolversArray } = require("./schema");
const SWAPI = require("./datasources/swAPI");
const SWDB = require("./datasources/swDB");

const app = express();

(async () => {
    const db = await massive({
        host: "swdb.cnb7agjijo8q.us-east-1.rds.amazonaws.com",
        port: 5432,
        database: "swdb",
        user: "postgres",
        password: "6FuZXyQCj9NvU45lOEoX"
    }, {
        documentPkType: "uuid"
    });

    const server = new ApolloServer({
        typeDefs: schemaArray,
        resolvers: resolversArray,
        dataSources: () => {
            return {
                swAPI: new SWAPI(),
                swDB: new SWDB(db)
            }
        },
        plugins: [responseCachePlugin()],
    });
    
    const app = express();
    app.use(cors());
    server.applyMiddleware({ app, path: "/graphql" });
    
    app.listen({ port: 4000 }, () =>
        console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
    );
})();