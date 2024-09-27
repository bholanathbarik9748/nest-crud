import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { CrudDocument } from './crud.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  constructor(@InjectModel('Crud') private crudModel: Model<CrudDocument>) { }

  // Fetch all records
  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const records = await this.crudModel.find(); // Fetch records
      return res.status(200).json({
        status: 'success',
        data: records
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An error occurred while fetching records',
        error: error.message
      });
    }
  }

  // Create a new record
  async createRecord(req: Request, res: Response): Promise<Response> {
    try {
      const body = req.body;  // Access the request body
      const newCrud = new this.crudModel(body);
      await newCrud.save();  // Await the save operation

      return res.status(200).json({
        status: 'success',
        data: newCrud
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An error occurred while creating the record',
        error: error.message
      });
    }
  }

  // Fetch By ID records
  async getRecordByID(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const response = await this.crudModel.findById(id);
      return res.status(200).json({
        status: 'success',
        data: response
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An error occurred while creating the record',
        error: error.message
      });
    }
  }

  // delete By ID records
  async getDeleteByID(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const response = await this.crudModel.findByIdAndUpdate(
        { _id: id },
        { is_archive: true }
      );
      return res.status(200).json({
        status: 'success',
        message: 'Record Delete Successfully'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An error occurred while creating the record',
        error: error.message
      });
    }
  }

  async getUpdateByID(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params; // Extract id from the request params
      const body = req.body; // Extract the body from the request

      const response = await this.crudModel.findByIdAndUpdate(
        id, // Pass the ID directly
        body, // Pass the updated fields directly
        { new: true } // Optionally return the updated document
      );

      if (!response) {
        return res.status(404).json({
          status: 'error',
          message: 'Record not found',
        });
      }

      return res.status(200).json({
        status: 'success',
        data: response, // Return the updated document
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An error occurred while updating the record',
        error: error.message,
      });
    }
  }

}
