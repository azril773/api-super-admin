import { SetMetadata, applyDecorators } from "@nestjs/common"

const AuthorDec = (jobs:number[]) => {
    return applyDecorators(
        SetMetadata(process.env.KEY_METADATA_JOB,jobs)
    )
}

export default AuthorDec