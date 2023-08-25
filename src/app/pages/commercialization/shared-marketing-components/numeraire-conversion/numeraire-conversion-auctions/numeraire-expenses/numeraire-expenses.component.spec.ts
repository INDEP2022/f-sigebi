/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumeraireExpensesComponent } from './numeraire-expenses.component';

describe('NumeraireExpensesComponent', () => {
  let component: NumeraireExpensesComponent;
  let fixture: ComponentFixture<NumeraireExpensesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NumeraireExpensesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumeraireExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
