import { createContext } from "react";
import { User } from "../../types/User";

export type GlobalStatesContextType = {
    sceneFocus: boolean;
}

export const GlobalStatesContext = createContext<GlobalStatesContextType>(null!);