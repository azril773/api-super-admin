import { HttpCode, SetMetadata, UseGuards, applyDecorators } from "@nestjs/common"
import { JwtAuth } from "guards/jwt-auth.guard"

export const ResCode = (code,message,role) => {
    return applyDecorators(
        SetMetadata("msg",message),
        HttpCode(code),
        SetMetadata(process.env.KEY_METADATA_SUPER_ADMIN,role)
    )
}