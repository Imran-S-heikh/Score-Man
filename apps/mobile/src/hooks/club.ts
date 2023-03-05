import { useRecoilValue } from "recoil"
import { ClubUtils } from "../screens/drawer/club/club.state"

export function useClubUtils() {
    const utils = useRecoilValue(ClubUtils);
    return utils; 
}