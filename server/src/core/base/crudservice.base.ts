import { BaseRepository } from './repository.base';
import aqp from 'api-query-params';
import { select } from 'src/utils/mongoose/select.util';
import { FilterQuery, Types } from 'mongoose';
import { createObjectId } from 'src/utils/mongoose/createObjectId';

interface PopulateOptions {
  path: string;
  selectedProps?: string[];
  unSelectedProps?: string[];
}

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
    const sortBy: Record<string, any> = parsedQuery.sort;

    /* Query documents */
    return await this.repository
      .getRepo()
      .find(parsedQuery?.filter ?? {})
      .limit(defaultLimit)
      .skip(skip)
      .sort(sortBy)
      .populate(parsedQuery.population)
      .select(select(selectedProps, unSelectedProps));
  }

  async findManyWithPopulate(
    query: string,
    page: number,
    limit: number,
    selectedProps?: string[],
    unSelectedProps?: string[],
    populate?: PopulateOptions[],
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
    const sortBy: Record<string, any> = parsedQuery.sort;

    /* Populate */
    const populateObjects = populate.map((g) => {
      return {
        path: g.path,
        select: select(g.selectedProps, g.unSelectedProps),
      };
    });

    /* Query documents */
    return await this.repository
      .getRepo()
      .find(parsedQuery?.filter ?? {})
      .limit(defaultLimit)
      .skip(skip)
      .sort(sortBy)
      .populate(populateObjects)
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
    options?: Record<string, any>,
  ): Promise<any> {
    return await this.repository.updateOne(
      filter,
      updatedProps as any,
      options,
    );
  }

  async deleteOne(
    filter: FilterQuery<T>,
    options?: Record<string, any>,
  ): Promise<any> {
    return await this.repository.deleteOne(filter, options);
  }

  async softDelete(
    filter: FilterQuery<T>,
    updatedProps: Record<string, any>,
    options?: Record<string, any>,
  ) {
    return await this.repository.updateOne(
      filter,
      {
        isDeleted: true,
        ...updatedProps,
      } as any,
      options,
    );
  }

  async softDeleteById(
    id: string,
    updatedProps?: Record<string, any>,
    options?: Record<string, any>,
  ) {
    return await this.repository.updateOne(
      { _id: createObjectId(id) },
      {
        is_deleted: true,
        ...updatedProps,
      } as any,
      options,
    );
  }
}
