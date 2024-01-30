import * as crypto from "crypto-js"

export const decrypt = (value) => {
    const data = crypto.AES.decrypt(value,process.env.KEY_ENCRYPT).toString(crypto.enc.Utf8)
    return data
}       