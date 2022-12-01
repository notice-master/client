import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import React from 'react';
const client = new ApolloClient({
  uri: 'https://48p1r2roz4.sse.codesandbox.io',
  cache: new InMemoryCache(),
});
export const GqlProvider = ({ children }: { children: JSX.Element }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
