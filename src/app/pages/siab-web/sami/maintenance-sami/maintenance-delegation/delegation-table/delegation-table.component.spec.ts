/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegationTableComponent } from './delegation-table.component';

describe('DelegationTableComponent', () => {
  let component: DelegationTableComponent;
  let fixture: ComponentFixture<DelegationTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DelegationTableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
