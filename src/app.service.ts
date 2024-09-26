import { Injectable } from '@nestjs/common';

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

@Injectable()
export class AppService {
  getHello(): HelloResponse {
    const response: HelloResponse = {
      message: 'Hello World!',
      status: 200,
      data: {
        name: 'John Doe',
        age: 30,
        job: 'Software Engineer',
        hobbies: ['coding', 'reading', 'gaming']
      }
    };
    return response;
  }
}
