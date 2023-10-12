/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentGlobComponent } from './payment-glob.component';

describe('PaymentGlobComponent', () => {
  let component: PaymentGlobComponent;
  let fixture: ComponentFixture<PaymentGlobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentGlobComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentGlobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
