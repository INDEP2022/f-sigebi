/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseConceptsListModalComponent } from './expense-concepts-list-modal.component';

describe('ExpenseConceptsListModalComponent', () => {
  let component: ExpenseConceptsListModalComponent;
  let fixture: ComponentFixture<ExpenseConceptsListModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExpenseConceptsListModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseConceptsListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
