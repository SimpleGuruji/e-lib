// src/types/custom.d.ts
import { Request } from "express";

declare module "express" {
  interface Request {
    user?: {
      _id?: string;
      email?: string;
      name?: string;
      createdAt?: Date;
      updatedAt?: Date;
    };
  }
}
