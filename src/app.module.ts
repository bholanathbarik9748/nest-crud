import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// import mongodb
import { MongooseModule } from '@nestjs/mongoose';

// import schema
import { Crud, CrudSchema } from './crud.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // This makes the config module globally available
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([{ name: Crud.name, schema: CrudSchema }]), // Register the schema here
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }
