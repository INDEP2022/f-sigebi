/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceAclarationComponent } from './maintenance-aclaration.component';

describe('MaintenanceAclarationComponent', () => {
  let component: MaintenanceAclarationComponent;
  let fixture: ComponentFixture<MaintenanceAclarationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MaintenanceAclarationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceAclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
