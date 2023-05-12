/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectConceptSpentDialogComponent } from './select-concept-spent-dialog.component';

describe('SelectConceptSpentDialogComponent', () => {
  let component: SelectConceptSpentDialogComponent;
  let fixture: ComponentFixture<SelectConceptSpentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectConceptSpentDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectConceptSpentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
