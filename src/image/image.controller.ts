import { Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, SetMetadata, UploadedFile, UseGuards, UseInterceptors, Get, Res, Body } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import * as fs from "fs"
import { JwtAuth } from "guards/jwt-auth.guard";
import { ResponseIntercept } from "intercept/response.intercept";
import { diskStorage } from "multer";
import { pipe } from "rxjs";
import { pipeline } from "stream";
import * as path from "path"
@Controller("image")
@UseInterceptors(new ResponseIntercept(new Reflector()))
@UseGuards(JwtAuth)
export class ImageController{
    @Post("/upload")
    @UseInterceptors(FileInterceptor("image",{
        storage:diskStorage({
            destination:'./public',
            filename(req, file, callback) {
                callback(null,`${new Date().getTime()}${file.originalname}`)
            },
        })
    }))
    @SetMetadata(process.env.KEY_METADATA_ROLE,["super_admin"])
    upload(@UploadedFile(new ParseFilePipe({
        validators:[
            new FileTypeValidator({fileType:"image/*"}),
            new MaxFileSizeValidator({maxSize:200000000})
        ]
    })) file:Express.Multer.File){
        
        return file.filename
    }

    // @Post("/image")
    // @SetMetadata(process.env.KEY_METADATA_SUPER_ADMIN,["super_admin"])
    // image(@Res() res:Response,@Body("image") img:string){
    //     console.log(img)
    //     console.log("image/"+img.split(".")[1])
    //     res.setHeader("Content-Type","image/"+img.split(".")[1]) 
    //     res.sendFile(path.join(__dirname,"/../../../public",img))
    // }
}