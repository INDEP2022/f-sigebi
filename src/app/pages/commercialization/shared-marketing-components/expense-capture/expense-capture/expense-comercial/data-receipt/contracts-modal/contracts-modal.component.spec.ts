/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsModalComponent } from './contracts-modal.component';

describe('ContractsModalComponent', () => {
  let component: ContractsModalComponent;
  let fixture: ComponentFixture<ContractsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContractsModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
