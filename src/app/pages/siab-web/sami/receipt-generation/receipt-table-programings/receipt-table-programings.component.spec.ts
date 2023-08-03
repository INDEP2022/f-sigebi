/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptTableProgramingsComponent } from './receipt-table-programings.component';

describe('ReceiptTableProgramingsComponent', () => {
  let component: ReceiptTableProgramingsComponent;
  let fixture: ComponentFixture<ReceiptTableProgramingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReceiptTableProgramingsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptTableProgramingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
