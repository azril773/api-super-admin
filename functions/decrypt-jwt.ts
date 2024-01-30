import * as jwt from "jsonwebtoken"
import * as crypto from "crypto-js"

export const decryptJwt = (value2) => {
    try {
        const data = crypto.AES.decrypt(value2,process.env.KEY_ENCRYPT).toString(crypto.enc.Utf8)
        const spli = data.split("")
        let baru = data
        if(spli[0] == '"' || spli[spli.length -1] == '"'){
            spli.pop()
            spli.shift()
            baru = spli.join("")
        }
        const jwts2 = jwt.verify(`${baru}`,"mek",{algorithm: 'HS256'})
        const data2 = crypto.AES.decrypt(jwts2.data,process.env.KEY_ENCRYPT).toString(crypto.enc.Utf8)
        return JSON.parse(data2)
    } catch (err) {
        return err
    }
        
}