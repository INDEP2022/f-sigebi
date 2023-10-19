/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuedTableComponent } from './valued-table.component';

describe('ValuedTableComponent', () => {
  let component: ValuedTableComponent;
  let fixture: ComponentFixture<ValuedTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ValuedTableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValuedTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
