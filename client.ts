import type {AppRouter} from './apps/server/src/app';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import fetch from 'node-fetch';

(global as any).fetch = fetch;

function getTrpcClient (){
    return createTRPCProxyClient<AppRouter>({
        links: [
            httpBatchLink({
                url: 'http://localhost:4000/trpc'
            })
        ],
    })
}

async function main() {
    const client = getTrpcClient();

    const players = await client.player.getPlayersByClub.query("cldg7eq8u0000qfe5ciswe0dn");

    console.log(players);
}

main();