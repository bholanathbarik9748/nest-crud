import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

interface HelloResponse {
  message: string;
  status: number;
  data: {
    name: string;
    age: number;
    job: string;
    hobbies: string[];
  };
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): HelloResponse {
    return this.appService.getHello();
  }
}
