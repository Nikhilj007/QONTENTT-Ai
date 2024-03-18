const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");
const { default: axios } = require("axios");

const users = [
  {
    id: "1",
    name: "John",
    age: 25,
    email: "john@gmail.com",
  },
  {
    id: "2",
    name: "Jane",
    age: 24,
    email: "jane@gmail.com",
  },
];
async function startApolloServer() {
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());

  const server = new ApolloServer({
    typeDefs: `
        type User {
            id: ID!
            name: String!
            age: Int!
            email: String!
          }

        type Query {
            users: [User!]!
            createUser(input: CreateUserInput!): User!
            deleteUser(id: ID!): User!
          }
        
        input CreateUserInput {
            name: String!
            age: Int!
            email: String!
          }
        type Mutation {
            createUser(input: CreateUserInput!): User!
            deleteUser(id: ID!): User!
          }

        `,
    resolvers: {
      Query: {
        users: () => users,
        createUser: ({ input }) => {
          const newUser = { id: String(users.length + 1), ...input };
          users.push(newUser);
          return newUser;
        },
        deleteUser: ({ id }) => {
          const index = users.findIndex((user) => user.id === id);
          if (index !== -1) {
            const deletedUser = users[index];
            users.splice(index, 1);
            return deletedUser;
          }
          return null;
        },
      },
    },
  });

  await server.start();
  app.use(expressMiddleware(server));
  app.listen(4000, () => {
    console.log(` Server ready at http://localhost:4000`);
  });
  return { server, app };
}

startApolloServer();
