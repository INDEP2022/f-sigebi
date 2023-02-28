import { IGood } from "../good/good.model";

export interface IGoodsTransAva {
    goodNumber: IGood | string,
    process: string,
    registryNumber: number
}