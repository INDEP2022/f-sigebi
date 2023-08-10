import { Injectable } from '@angular/core';
import { ConceptsService } from 'src/app/core/services/ms-commer-concepts/concepts.service';

@Injectable({
  providedIn: 'root',
})
export class ExpenseConceptsService {
  concept: { id: string; address?: string };
  // refreshParams = new Subject();
  haveParams = false;
  constructor(private conceptsService: ConceptsService) {}

  getAddressCode(address: string) {
    switch (address) {
      case 'MUEBLES':
        return 'M';
      case 'INMUEBLES':
        return 'I';
      case 'GENERAL':
        return 'C';
      case 'VIGILANCIA':
        return 'V';
      case 'SEGUROS':
        return 'S';
      case 'JURIDICO':
        return 'J';
      case 'ADMINISTRACIÓN':
        return 'A';
      default:
        return '';
    }
  }
}
