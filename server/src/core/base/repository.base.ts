import { InternalServerErrorException } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { ERRORCODES } from '../error/code';
import { select } from 'src/utils/mongoose/select.util';
import { createObjectId } from 'src/utils/mongoose/createObjectId';

interface PopulateOptions {
  path: string | string[];
  selectedProps?: string[];
  unSelectedProps?: string[];
}

export class BaseRepository<T> {
  protected repo: Model<T>;
  constructor(repo: Model<T>) {
    this.repo = repo;
  }

  getRepo() {
    return this.repo;
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

  async findOneWithPopulate(
    filter: FilterQuery<T>,
    selectedProps?: string[],
    unSelectedProps?: string[],
    populate?: PopulateOptions,
  ): Promise<T> {
    try {
      return await this.repo
        .findOne(filter)
        .select(select(selectedProps, unSelectedProps))
        .populate(
          populate?.path,
          select(populate?.selectedProps, populate?.unSelectedProps),
        )
        .lean();
    } catch (error) {
      throw new InternalServerErrorException({
        errorCode: ERRORCODES.DOCUMENT_FAIL_FIND,
      });
    }
  }

  async findOneById(
    id: string,
    selectedProps?: string[],
    unSelectedProps?: string[],
  ): Promise<T> {
    try {
      return await this.repo
        .findOne({
          _id: createObjectId(id),
        })
        .select(select(selectedProps, unSelectedProps))
        .lean();
    } catch (error) {
      throw new InternalServerErrorException({
        errorCode: ERRORCODES.DOCUMENT_FAIL_FIND,
      });
    }
  }

  async findOneByIdWithPopulate(
    id: string,
    selectedProps?: string[],
    unSelectedProps?: string[],
    populate?: PopulateOptions,
  ): Promise<T> {
    try {
      return await this.repo
        .findOne({
          _id: createObjectId(id),
        })
        .select(select(selectedProps, unSelectedProps))
        .populate(
          populate?.path,
          select(populate?.selectedProps, populate?.unSelectedProps),
        )
        .lean();
    } catch (error) {
      throw new InternalServerErrorException({
        errorCode: ERRORCODES.DOCUMENT_FAIL_FIND,
      });
    }
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
    options?: Record<string, any>,
  ): Promise<T> {
    try {
      return await this.repo.updateOne(filter, updatedProps, options).lean();
    } catch (error) {
      throw new InternalServerErrorException({
        errorCode: ERRORCODES.DOCUMENT_FAIL_UPDATE,
      });
    }
  }

  async updateOneById(
    id: string,
    updatedProps: Partial<T>,
    options?: Record<string, any>,
  ): Promise<T> {
    try {
      return await this.repo
        .updateOne({ _id: createObjectId(id) }, updatedProps, options)
        .lean();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({
        errorCode: ERRORCODES.DOCUMENT_FAIL_UPDATE,
      });
    }
  }

  async deleteOne(
    filter: FilterQuery<T>,
    options?: Record<string, any>,
  ): Promise<T> {
    try {
      return await this.repo.deleteOne(filter, options).lean();
    } catch (error) {
      throw new InternalServerErrorException({
        errorCode: ERRORCODES.DOCUMENT_FAIL_UPDATE,
      });
    }
  }

  async deleteOneById(id: string, options?: Record<string, any>): Promise<T> {
    try {
      return await this.repo
        .deleteOne({ _id: createObjectId(id) }, options)
        .lean();
    } catch (error) {
      throw new InternalServerErrorException({
        errorCode: ERRORCODES.DOCUMENT_FAIL_UPDATE,
      });
    }
  }
}
