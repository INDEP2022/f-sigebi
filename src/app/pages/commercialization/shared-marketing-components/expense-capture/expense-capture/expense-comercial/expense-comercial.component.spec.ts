/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseComercialComponent } from './expense-comercial.component';

describe('ExpenseComercialComponent', () => {
  let component: ExpenseComercialComponent;
  let fixture: ComponentFixture<ExpenseComercialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExpenseComercialComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseComercialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
