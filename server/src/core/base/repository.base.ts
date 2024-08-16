import { InternalServerErrorException } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { ERRORCODES } from '../error/code';
import { select } from 'src/utils/mongoose/select.util';

export class BaseRepository<T> {
  protected repo: Model<T>;

  constructor(repo: Model<T>) {
    this.repo = repo;
  }

  getRepo() {
    return this.repo;
  }

  async findMany(
    filter: FilterQuery<T>,
    selectedProps?: string[],
    unSelectedProps?: string[],
  ): Promise<T[]> {
    try {
      return this.repo
        .find(filter)
        .select(select(selectedProps, unSelectedProps))
        .lean();
    } catch (error) {
      throw new InternalServerErrorException({
        errorCode: ERRORCODES.DOCUMENT_FAIL_FIND,
      });
    }
  }

  async findOne(
    filter: FilterQuery<T>,
    selectedProps?: string[],
    unSelectedProps?: string[],
  ): Promise<T> {
    try {
      return await this.repo
        .findOne(filter)
        .select(select(selectedProps, unSelectedProps))
        .lean();
    } catch (error) {
      throw new InternalServerErrorException({
        errorCode: ERRORCODES.DOCUMENT_FAIL_FIND,
      });
    }
  }

  async create(props: Partial<T>): Promise<T | any> {
    try {
      return (await this.repo.create(props))['_doc'];
    } catch (error) {
      throw new InternalServerErrorException({
        errorCode: ERRORCODES.DOCUMENT_FAIL_CREATE,
      });
    }
  }

  async updateOne(
    filter: FilterQuery<T>,
    updatedProps: Partial<T>,
    selectedProps?: string[],
    unSelectedProps?: string[],
    options: Record<string, any> = { new: true },
  ): Promise<unknown> {
    try {
      return await this.repo
        .findOneAndUpdate(filter, updatedProps, options)
        .select(select(selectedProps, unSelectedProps))
        .lean();
    } catch (error) {
      throw new InternalServerErrorException({
        errorCode: ERRORCODES.DOCUMENT_FAIL_UPDATE,
      });
    }
  }

  async deleteOne(
    filter: FilterQuery<T>,
    selectedProps?: string[],
    unSelectedProps?: string[],
    options: Record<string, any> = { new: true },
  ): Promise<unknown> {
    try {
      return await this.repo
        .findOneAndDelete(filter, options)
        .select(select(selectedProps, unSelectedProps))
        .lean();
    } catch (error) {
      throw new InternalServerErrorException({
        errorCode: ERRORCODES.DOCUMENT_FAIL_UPDATE,
      });
    }
  }
}
