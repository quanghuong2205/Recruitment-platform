import { BaseRepository } from './repository.base';

export class BaseCRUDService<
  T,
  CDTO extends Partial<T>,
  UDTO extends Partial<T>,
> {
  private repository: BaseRepository<T>;
  private name: string;

  constructor(repository: BaseRepository<T>, name: string) {
    this.repository = repository;
    this.name = name;
  }

  async create(payload: CDTO): Promise<{ data: any; message: string }> {
    const data = await this.repository.create(payload);
    return { data, message: `${this.name} successfully created` };
  }
}
