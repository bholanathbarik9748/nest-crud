import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { CrudDocument } from './crud.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CrudDto } from './validation.dto';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(@InjectModel('Crud') private crudModel: Model<CrudDocument>) { }

  // Fetch all records
  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const records = await this.crudModel.find();
      return res.status(200).json({
        status: 'success',
        data: records
      });
    } catch (error) {
      this.logger.error('Error fetching records', { error });
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error, please try again later.'
      });
    }
  }

  // Create a new record
  async createRecord(req: Request, res: Response): Promise<Response> {
    try {
      const body = req.body;

      // Transform body into an instance of CreatePersonDto and validate it
      const createPersonDto = plainToInstance(CrudDto, body);
      const errors = await validate(createPersonDto);

      if (errors.length > 0) {
        // If validation errors exist, return them
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: errors.map((err) => ({
            property: err.property,
            constraints: err.constraints,
          })),
        });
      }

      const newCrud = new this.crudModel(body); // Proceed with saving if no validation errors
      await newCrud.save();

      return res.status(201).json({
        status: 'success',
        data: newCrud,
      });
    } catch (error) {
      this.logger.error('Error creating record', { error });

      // Handle different types of errors (e.g., validation, database)
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed, please check your input.',
          error: error.message,
        });
      }

      return res.status(500).json({
        status: 'error',
        message: 'Failed to create record. Please try again later.',
      });
    }
  }

  // Fetch By ID
  async getRecordByID(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const record = await this.crudModel.findById(id);

      if (!record) {
        throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
      }

      return res.status(200).json({
        status: 'success',
        data: record
      });
    } catch (error) {
      this.logger.error(`Error fetching record by ID: ${req.params.id}`, { error });

      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({
          status: 'error',
          message: error.message
        });
      }

      return res.status(500).json({
        status: 'error',
        message: 'An error occurred while fetching the record'
      });
    }
  }

  // Delete By ID
  async getDeleteByID(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const response = await this.crudModel.findByIdAndUpdate(
        id,
        { is_archive: true }
      );

      if (!response) {
        throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
      }

      return res.status(200).json({
        status: 'success',
        message: 'Record deleted successfully'
      });
    } catch (error) {
      this.logger.error(`Error deleting record by ID: ${req.params.id}`, { error });

      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({
          status: 'error',
          message: error.message
        });
      }

      return res.status(500).json({
        status: 'error',
        message: 'Failed to delete the record, please try again later.'
      });
    }
  }

  // Update By ID
  async getUpdateByID(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const body = req.body;

    // Transform body into an instance of CreatePersonDto and validate it
    const createPersonDto = plainToInstance(CrudDto, body);
    const errors = await validate(createPersonDto);

    if (errors.length > 0) {
      // If validation errors exist, return them
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.map((err) => ({
          property: err.property,
          constraints: err.constraints,
        })),
      });
    }

    try {

      const updatedRecord = await this.crudModel.findByIdAndUpdate(
        id,
        body,
        { new: true }
      );

      if (!updatedRecord) {
        throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
      }

      return res.status(200).json({
        status: 'success',
        data: updatedRecord
      });
    } catch (error) {
      this.logger.error(`Error updating record by ID: ${req.params.id}`, { error });

      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({
          status: 'error',
          message: error.message
        });
      }

      return res.status(500).json({
        status: 'error',
        message: 'An error occurred while updating the record'
      });
    }
  }
}
