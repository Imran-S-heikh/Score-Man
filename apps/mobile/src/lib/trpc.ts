import type { AppRouter } from '../../../server/src/app';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
// import superjson from 'superjson';
export {AppRouter}
const config = {
  links: [
    httpBatchLink({
      url: 'http://192.168.0.104:4000/trpc',
    }),
  ],
  // transformer: superjson
};
export type TrpcClient = ReturnType<typeof createTRPCProxyClient<AppRouter>>;
let client: TrpcClient;

export function getTrpcClient() {
  if (client) {
    return client;
  }
  client = createTRPCProxyClient<AppRouter>(config);
  return client;
}
