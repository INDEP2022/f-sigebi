/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCellCcpComponent } from './custom-cell-ccp.component';

describe('CustomCellCcpComponent', () => {
  let component: CustomCellCcpComponent;
  let fixture: ComponentFixture<CustomCellCcpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomCellCcpComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomCellCcpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
