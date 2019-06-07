import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import globalConfig from '../globalConfig'
import { ApolloServer } from 'apollo-server-express';
import { schemaFactory } from './embeddedGraphql';
import { jwt, cookie } from './Authentication';
import { getBinding } from './embeddedGraphql/bindings';
import contextFactory from './contextFactory';
import { CustomRequest, CustomResponse } from './CustomRequestResponse';

(async () => {
    try {
        const app = express();
        app.use(compression());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(cookieParser());

        // authentication
        app.use(cookie); // cookie authentication
        app.use(jwt); // jwt authentication

        // initialize custom request 
        app.use((req, res, next) => {
            (req as CustomRequest).binding = binding;
            (req as CustomRequest).config = globalConfig;
            next();
        })

        // graphql
        const schema = await schemaFactory();
        const binding = getBinding(schema);
        var apolloServer = new ApolloServer({
            schema,
            context: c => contextFactory(c.req as CustomRequest, c.res as CustomResponse)
        });
        apolloServer.applyMiddleware({ app });

        app.listen(globalConfig.port, () => {
            console.log(`server listening on port ${globalConfig.port}`)
        });
    }
    catch (err) {
        console.error(err);
        throw err;
    }
})();