import { Controller, Delete, Get, Patch, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';

@Controller('/crud/action')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  async getAll(@Req() req: Request, @Res() res: Response): Promise<any> {
    return this.appService.getAll(req, res); // Pass req and res to the service
  }

  @Post()
  async createRecord(@Req() req: Request, @Res() res: Response): Promise<any> {
    return this.appService.createRecord(req, res); // Pass req and res to the service
  }

  @Get('/:id')
  async getByID(@Req() req: Request, @Res() res: Response): Promise<any> {
    return this.appService.getRecordByID(req, res);
  }

  @Delete('/:id')
  async deleteByID(@Req() req: Request, @Res() res: Response): Promise<any> {
    return this.appService.getDeleteByID(req, res);
  }

  @Patch('/:id')
  async updateByID(@Req() req: Request, @Res() res: Response): Promise<any> {
    return this.appService.getUpdateByID(req, res);
  }
}
