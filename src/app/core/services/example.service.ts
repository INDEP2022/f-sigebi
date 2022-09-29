import { Injectable } from '@angular/core';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Example } from '../models/example';
import { ExampleRepository } from '../repository/example.repository';

@Injectable({
  providedIn: 'root',
})
export class ExampleService implements ICrudMethods<Example> {
  route: string = 'cat-paragraphs';
  constructor(private exampleRepository: ExampleRepository) {}

  getAll(params: ListParams) {
    return this.exampleRepository.getAllPaginated(this.route, params);
  }

  getById(id: number | string) {
    return this.exampleRepository.getById(this.route, id);
  }

  create(formData: Object) {
    return this.exampleRepository.create(this.route, formData);
  }

  update(id: number | string, formData: Object) {
    return this.exampleRepository.update(this.route, id, formData);
  }

  remove(id: number | string) {
    return this.exampleRepository.remove(this.route, id);
  }
}
