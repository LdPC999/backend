import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ required: true})
    nombre: string;

    @Prop({ required: true})
    apellidos: string;

    @Prop({ required: true, unique: true})
    email: string;

    @Prop({ type: [String], default:[] })
    alergenos: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);