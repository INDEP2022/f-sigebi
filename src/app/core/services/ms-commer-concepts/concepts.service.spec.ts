/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { ConceptsService } from './concepts.service';

describe('Service: Concepts', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConceptsService],
    });
  });

  it('should ...', inject([ConceptsService], (service: ConceptsService) => {
    expect(service).toBeTruthy();
  }));
});
