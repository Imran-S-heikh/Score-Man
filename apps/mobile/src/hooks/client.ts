import { useContext } from "react";
import { useRecoilValue } from "recoil";
import { TrpcClientContext } from "../contexts/trpc.context";
import { PlayerUtils } from "../state/user.state";

export  default function useClient() {
    return useContext(TrpcClientContext)
}

export function usePlayerUtils() {
    const utils = useRecoilValue(PlayerUtils);
    return utils ;
}