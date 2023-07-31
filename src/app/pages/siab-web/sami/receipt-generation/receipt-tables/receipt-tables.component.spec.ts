/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptTablesComponent } from './receipt-tables.component';

describe('ReceiptTablesComponent', () => {
  let component: ReceiptTablesComponent;
  let fixture: ComponentFixture<ReceiptTablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReceiptTablesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
