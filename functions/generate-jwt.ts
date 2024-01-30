import * as jwt from "jsonwebtoken"
import * as crypto from "crypto-js"
export const generateJwt = (payload) => {
    const data = {name:"azril"}
    const encryptData = crypto.AES.encrypt(JSON.stringify(data),process.env.KEY_ENCRYPT).toString()
    console.log(process.env.KEY_JWT)
    const jwts = jwt.sign({data:encryptData},"mek",{expiresIn:3600,algorithm: 'HS256'})
    const encryptJwt = crypto.AES.encrypt(JSON.stringify(jwts),process.env.KEY_ENCRYPT).toString()
    return encryptJwt
}