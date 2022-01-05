import { MulterModuleOptions } from '@nestjs/platform-express';

export const multerOption: MulterModuleOptions = {
  dest: './upload',
};
