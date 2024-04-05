import * as ms from "ms"
import * as jwt from "jsonwebtoken"
import * as crypto from "crypto-js"
export const generateJwt = (payload,expired) => {
    const encryptData = crypto.AES.encrypt(JSON.stringify(payload),process.env.KEY_ENCRYPT).toString()
    const jwts = jwt.sign({data:encryptData},process.env.KEY_JWT,{expiresIn:ms(expired),algorithm: 'HS256'})
    const encryptJwt = crypto.AES.encrypt(JSON.stringify(jwts),process.env.KEY_ENCRYPT).toString()
    return encryptJwt
}