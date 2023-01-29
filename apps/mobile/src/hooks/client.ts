import { useContext } from "react";
import { TrpcClientContext } from "../contexts/trpc.context";

export  default function useClient() {
    return useContext(TrpcClientContext)
}