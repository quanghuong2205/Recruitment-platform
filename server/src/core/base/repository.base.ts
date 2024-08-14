import { InternalServerErrorException } from '@nestjs/common';
import { Model } from 'mongoose';
import { ERRORCODES } from '../error/code';

export class BaseRepository<T> {
  protected repo: Model<T>;

  constructor(repo: Model<T>) {
    this.repo = repo;
  }

  getRepo() {
    return this.repo;
  }

  async findMany(filter: Record<string, any>): Promise<T[]> {
    try {
      return this.repo.find(filter);
    } catch (error) {
      throw new InternalServerErrorException({
        errorCode: ERRORCODES.DOCUMENT_FAIL_FIND,
      });
    }
  }

  async findOne(filter: Record<string, any>): Promise<T> {
    try {
      return this.repo.findOne(filter);
    } catch (error) {
      throw new InternalServerErrorException({
        errorCode: ERRORCODES.DOCUMENT_FAIL_FIND,
      });
    }
  }

  async create(props: Partial<T>): Promise<T> {
    try {
      return await this.repo.create(props);
    } catch (error) {
      throw new InternalServerErrorException({
        errorCode: ERRORCODES.DOCUMENT_FAIL_CREATE,
      });
    }
  }

  async updatedOne(
    filter: Record<string, any>,
    updatedProps: Partial<T>,
    options?: Record<string, any>,
  ): Promise<unknown> {
    try {
      return await this.repo.updateOne(filter, updatedProps, options);
    } catch (error) {
      throw new InternalServerErrorException({
        errorCode: ERRORCODES.DOCUMENT_FAIL_UPDATE,
      });
    }
  }

  async deleteOne(
    filter: Record<string, any>,
    options?: Record<string, any>,
  ): Promise<unknown> {
    try {
      return await this.repo.deleteOne(filter, options);
    } catch (error) {
      throw new InternalServerErrorException({
        errorCode: ERRORCODES.DOCUMENT_FAIL_UPDATE,
      });
    }
  }

  async findOneAndUpdate(
    filter: Record<string, any>,
    updatedProps: Partial<T>,
    options?: Record<string, any>,
  ): Promise<unknown> {
    try {
      return await this.repo.findOneAndUpdate(filter, updatedProps, options);
    } catch (error) {
      throw new InternalServerErrorException({
        errorCode: ERRORCODES.DOCUMENT_FAIL_UPDATE,
      });
    }
  }
}
