import { Injectable } from '@angular/core';
import { Repository } from 'src/app/common/repository/repository';
import { Example } from '../models/example';

@Injectable({
  providedIn: 'root',
})
export class ExampleRepository extends Repository<Example> {}
