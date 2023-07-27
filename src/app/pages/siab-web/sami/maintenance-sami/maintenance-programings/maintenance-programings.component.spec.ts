/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceProgramingsComponent } from './maintenance-programings.component';

describe('MaintenanceProgramingsComponent', () => {
  let component: MaintenanceProgramingsComponent;
  let fixture: ComponentFixture<MaintenanceProgramingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MaintenanceProgramingsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceProgramingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
