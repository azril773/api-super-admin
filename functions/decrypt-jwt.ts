import * as jwt from "jsonwebtoken"
import * as crypto from "crypto-js"
import { UnauthorizedException } from "@nestjs/common"

export const decryptJwt = (value2) => {
        if(typeof value2 !== "string") throw new UnauthorizedException("Kont")
        const enc = crypto.AES.decrypt(value2,process.env.KEY_ENCRYPT)
        const data = enc ? enc.toString(crypto.enc.Utf8) : null
        if(data == null) throw new UnauthorizedException("Kont")
        const spli = data.split("")
        let baru = data
        if(spli[0] == '"' || spli[spli.length -1] == '"'){
            spli.pop()
            spli.shift()
            baru = spli.join("")
        }
        return jwt.verify(`${baru}`,process.env.KEY_JWT,{algorithm: 'HS256'},function(err,decoded){
            if(err){
                return err
            }else{
                const data2 = crypto.AES.decrypt(decoded.data,process.env.KEY_ENCRYPT).toString(crypto.enc.Utf8)
                const cek = JSON.parse(data2)
                return cek
                // if(Object.keys(cek).includes(""))
                
            }
            // console.log(decoded)
        })
        
}