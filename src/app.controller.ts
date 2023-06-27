import { Controller, Get, Res, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('*')
  serveFile(@Req() req: Request, @Res() res: Response) {
    const filePath = join(
      __dirname,
      '..',
      '..',
      'client',
      'build',
      'index.html',
    );
    return res.sendFile(filePath);
  }
}
