import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CrudDocument = Crud & Document;

@Schema()
export class Crud {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    age: number;

    @Prop({ required: true })
    job: string;

    @Prop([String])
    hobbies: string[];

    @Prop({ required: false, default: false })
    is_archive: Boolean;
}

// Corrected schema export name
export const CrudSchema = SchemaFactory.createForClass(Crud);