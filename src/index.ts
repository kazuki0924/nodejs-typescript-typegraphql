import "reflect-metadata";

import connectRedis from "connect-redis";
import cors from "cors";
import Express from "express";
import session from "express-session";
import queryComplexity, { simpleEstimator } from "graphql-query-complexity";
import { ApolloServer } from "apollo-server-express";
import { createConnection } from "typeorm";

import { redis } from "./redis";
import { createSchema } from "./utils/createSchema";

/** @format */
const main = async () => {
  await createConnection();

  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({
      req,
      res,
      authorsLoader: createAuthorsLoader()
    }),
    validationRules: [
      queryComplexity({
        maximumComplexity: 30,
        variables: {},
        onComplete: (complexity: number) => {
          console.log("Query Complexity:", complexity);
        },
        estimators: [
          simpleEstimator({
            defaultComplexity: 1,
          }),
        ],
      }) as any,
    ],
  });

  const app = Express();

  const RedisStore = connectRedis(session);

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );

  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
      }),
      name: "qid",
      secret: "secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365,
      },
    })
  );

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("server started on http://localhost:4000/graphql");
  });
};

main().catch(err => console.error(err));
