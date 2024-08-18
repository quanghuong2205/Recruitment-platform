import { BaseRepository } from './repository.base';
import aqp from 'api-query-params';
import { select } from 'src/utils/mongoose/select.util';
import { FilterQuery, Types } from 'mongoose';

export class BaseCRUDService<T, CDTO, UDTO> {
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
  ): Promise<T> {
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
  ): Promise<T[]> {
    /* Parse query string to object */
    const parsedQuery = aqp(query);
    delete parsedQuery.filter['page'];
    delete parsedQuery.filter['limit'];

    /* Default page infor */
    const defaultLimit = limit ?? 50;
    const defaultPage = page ?? 1;

    /* Get document range */
    const skip = (defaultPage - 1) * defaultLimit;

    /* Sort condition */

    /* Query documents */
    return await this.repository
      .getRepo()
      .find(parsedQuery?.filter ?? {})
      .limit(defaultLimit)
      .skip(skip)
      .populate(parsedQuery.population)
      .select(select(selectedProps, unSelectedProps));
  }

  async create(props: CDTO): Promise<T> {
    return await this.repository.create({
      _id: new Types.ObjectId(),
      ...props,
    } as any);
  }

  async updateOne(
    filter: FilterQuery<T>,
    updatedProps: UDTO,
    selectedProps?: string[],
    unSelectedProps?: string[],
    options?: Record<string, any>,
  ): Promise<any> {
    return await this.repository.updateOne(
      filter,
      updatedProps as any,
      selectedProps,
      unSelectedProps,
      options,
    );
  }

  async deleteOne(
    filter: FilterQuery<T>,
    selectedProps?: string[],
    unSelectedProps?: string[],
    options?: Record<string, any>,
  ): Promise<any> {
    return await this.repository.deleteOne(
      filter,
      selectedProps,
      unSelectedProps,
      options,
    );
  }

  async softDelete(
    filter: FilterQuery<T>,
    updatedProps: Record<string, any>,
    selectedProps?: string[],
    unSelectedProps?: string[],
    options?: Record<string, any>,
  ) {
    return await this.repository.updateOne(
      filter,
      {
        isDeleted: true,
        ...updatedProps,
      } as any,
      selectedProps,
      unSelectedProps,
      options,
    );
  }
}
