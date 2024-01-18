/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { ShowHideAuthErrorInterceptorService } from './show-hide-auth-error-interceptor.service';

describe('Service: ShowHideAuthErrorInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShowHideAuthErrorInterceptorService],
    });
  });

  it('should ...', inject(
    [ShowHideAuthErrorInterceptorService],
    (service: ShowHideAuthErrorInterceptorService) => {
      expect(service).toBeTruthy();
    }
  ));
});
