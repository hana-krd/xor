import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File, FileDocument } from '../database/schemas/file.schema';
import { CreateFileDto } from './dto/create-file.dto';

@Injectable()
export class FileService {
    constructor(
        @InjectModel(File.name) private fileModel: Model<FileDocument>
    ) { }
    
    async createFile(
        fileDto: CreateFileDto,
        uploadedFile: Express.Multer.File
    ): Promise<File>{

        fileDto.name = uploadedFile.filename;
        fileDto.originalName = uploadedFile.originalname;
        fileDto.type = uploadedFile.mimetype;
        
        return await this.fileModel.create(fileDto);
    }

    
}
