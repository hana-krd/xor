import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from '../database/schemas/file.schema';
import { MulterModule } from '@nestjs/platform-express';
import { multerOption } from '../config/multer.config';

@Module({
  imports: [
    MulterModule.register(multerOption),
    MongooseModule.forFeature([
      {name: File.name, schema: FileSchema}
    ])
  ],
  providers: [FileService],
  controllers: [FileController]
})
export class FileModule {}
