import { Body, Controller, Post, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFileDto } from './dto/create-file.dto';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
    constructor(
        private fileService: FileService
    ) { }

    @Post('')
    @UseInterceptors(FileInterceptor('file'))
    @UsePipes(ValidationPipe)
    crateFile(
        @Body() fileDto: CreateFileDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.fileService.createFile(fileDto, file);
    }
}
