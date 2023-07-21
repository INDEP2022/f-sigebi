import { Injectable } from '@angular/core';
import { IConcept } from 'src/app/core/models/ms-comer-concepts/concepts';
import { ConceptsService } from 'src/app/core/services/ms-commer-concepts/concepts.service';

@Injectable({
  providedIn: 'root',
})
export class ExpenseConceptsService {
  concept: IConcept;

  constructor(private conceptsService: ConceptsService) {}
}
