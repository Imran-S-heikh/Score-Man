import { Prisma } from "@prisma/client";
import {z} from "zod";

const input = {
    club: {id: ''},
    
} as Prisma.PlayerWhereInput;

const GetPlayersInput = z.object({

})