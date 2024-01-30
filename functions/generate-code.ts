import { randomBytes } from "crypto"

export const RandomKode = (size:number) => {
    return `sims${randomBytes(size).toString("hex")}`
}