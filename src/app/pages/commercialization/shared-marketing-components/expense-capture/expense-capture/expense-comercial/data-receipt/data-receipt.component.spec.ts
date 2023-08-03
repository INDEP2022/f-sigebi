/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataReceiptComponent } from './data-receipt.component';

describe('DataReceiptComponent', () => {
  let component: DataReceiptComponent;
  let fixture: ComponentFixture<DataReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataReceiptComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
