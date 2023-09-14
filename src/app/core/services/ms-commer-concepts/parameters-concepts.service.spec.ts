/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { ParametersConceptsService } from './parameters-concepts.service';

describe('Service: ParametersConcepts', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ParametersConceptsService],
    });
  });

  it('should ...', inject(
    [ParametersConceptsService],
    (service: ParametersConceptsService) => {
      expect(service).toBeTruthy();
    }
  ));
});
