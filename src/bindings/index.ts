import { makeBindingClass } from "graphql-binding";
import { BindingConstructor, Binding } from "./schema";
import { introspectSchema, makeRemoteExecutableSchema } from 'graphql-tools';
import { HttpLink } from 'apollo-link-http';

export * from './schema';

const link = new HttpLink({
    uri: 'http://localhost:8080/graphql', fetch
})

export const getBinding = async (): Promise<Binding> => {
    const schema = await introspectSchema(link);
    const executableSchema = makeRemoteExecutableSchema({
        schema, link
    });
    const BindingClass = makeBindingClass<BindingConstructor<Binding>>({ schema: executableSchema })
    const binding = new BindingClass();
    return binding;
}