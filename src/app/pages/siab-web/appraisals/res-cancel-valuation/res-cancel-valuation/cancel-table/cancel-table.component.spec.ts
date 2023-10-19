/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelTableComponent } from './cancel-table.component';

describe('CancelTableComponent', () => {
  let component: CancelTableComponent;
  let fixture: ComponentFixture<CancelTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CancelTableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
