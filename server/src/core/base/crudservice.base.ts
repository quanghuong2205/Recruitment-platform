import { BaseRepository } from './repository.base';
import aqp from 'api-query-params';
import { select } from 'src/utils/mongoose/select.util';
import { FilterQuery, Types } from 'mongoose';

export class BaseCRUDService<T> {
  private repository: BaseRepository<T>;
  private name: string;

  constructor(repository: BaseRepository<T>, name: string) {
    this.repository = repository;
    this.name = name;
  }

  async findOne(
    filter: FilterQuery<T>,
    selectedProps?: string[],
    unSelectedProps?: string[],
  ) {
    return await this.repository.findOne(
      filter,
      selectedProps,
      unSelectedProps,
    );
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
    return await this.repository
      .getRepo()
      .find(parsedQuery?.filter ?? {})
      .limit(limit)
      .skip(skip)
      .select(select(selectedProps, unSelectedProps));
  }

  async create(payload: Partial<T> | any): Promise<T> {
    return await this.repository.create({
      _id: new Types.ObjectId(),
      ...payload,
    });
  }

  async updateOne(
    filter: FilterQuery<T>,
    updatedProps: Partial<T>,
    options?: Record<string, any>,
  ): Promise<any> {
    return await this.repository.updateOne(filter, updatedProps, options);
  }

  async deleteOne(
    filter: FilterQuery<T>,
    options?: Record<string, any>,
  ): Promise<any> {
    return await this.repository.deleteOne(filter, options);
  }
}
