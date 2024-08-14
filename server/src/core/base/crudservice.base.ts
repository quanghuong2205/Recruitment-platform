import { InternalServerErrorException } from '@nestjs/common';
import { BaseRepository } from './repository.base';
import aqp from 'api-query-params';
import { ERRORCODES } from '../error/code';
import { select } from 'src/utils/mongoose/select.util';

export class BaseCRUDService<T, CDTO, UDTO> {
  private repository: BaseRepository<T>;
  private name: string;

  constructor(repository: BaseRepository<T>, name: string) {
    this.repository = repository;
    this.name = name;
  }

  async findOne(
    filter: Record<string, any>,
    selectedProps?: string[],
    unSelectedProps?: string[],
  ) {
    try {
      const data = await this.repository
        .getRepo()
        .findOne(filter)
        .select(select(selectedProps, unSelectedProps));
      return data;
    } catch (error) {
      throw new InternalServerErrorException({
        errorCode: ERRORCODES.DOCUMENT_FAIL_FIND,
      });
    }
  }

  async findMany(
    query: string,
    page: number,
    limit: number,
    selectedProps?: string[],
    unSelectedProps?: string[],
  ) {
    /* Parse query string to object */
    const parsedQuery = aqp(query);

    /* Get document range */
    const skip = (page - 1) * limit;

    /* Sort condition */

    /* Query documents */
    return this.repository
      .getRepo()
      .find(parsedQuery?.filter ?? {})
      .limit(limit)
      .skip(skip)
      .select(select(selectedProps, unSelectedProps));
  }

  async create(payload: CDTO): Promise<any> {
    try {
      const data = await this.repository.getRepo().create(payload);
      return data;
    } catch (error) {
      throw new InternalServerErrorException({
        errorCode: ERRORCODES.DOCUMENT_FAIL_CREATE,
      });
    }
  }

  async updateOne(
    filter: Record<string, any>,
    updatedProps: UDTO,
    options?: Record<string, any>,
  ): Promise<any> {
    try {
      const data = await this.repository
        .getRepo()
        .updateOne(filter, updatedProps, options);
      return data;
    } catch (error) {
      throw new InternalServerErrorException({
        errorCode: ERRORCODES.DOCUMENT_FAIL_UPDATE,
      });
    }
  }

  async deleteOne(
    filter: Record<string, any>,
    options?: Record<string, any>,
  ): Promise<any> {
    try {
      const data = await this.repository.getRepo().deleteOne(filter, options);
      return data;
    } catch (error) {
      throw new InternalServerErrorException({
        errorCode: ERRORCODES.DOCUMENT_FAIL_DELETE,
      });
    }
  }
}
