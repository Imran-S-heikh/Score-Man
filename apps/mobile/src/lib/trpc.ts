import type {AppRouter} from "../../../server/src/app";
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';

export function getTrpcClient (){
   return createTRPCProxyClient<AppRouter>({
        links: [
            httpBatchLink({
                url: 'http://192.168.0.101:4000/trpc'
            })
        ],
        // transformer: superjson
    })
}

export type TrpcClient = ReturnType<typeof getTrpcClient>;