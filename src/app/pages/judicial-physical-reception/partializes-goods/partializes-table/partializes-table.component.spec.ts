/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartializesTableComponent } from './partializes-table.component';

describe('PartializesTableComponent', () => {
  let component: PartializesTableComponent;
  let fixture: ComponentFixture<PartializesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PartializesTableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartializesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
