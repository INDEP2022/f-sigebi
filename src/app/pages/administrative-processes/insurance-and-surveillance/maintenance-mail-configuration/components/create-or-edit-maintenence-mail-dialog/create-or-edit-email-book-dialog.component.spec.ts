/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrEditEmailMaintenencekDialogComponent } from './create-or-edit-maintenence-mail-dialog.component';

describe('CreateOrEditEmailBookDialogComponent', () => {
  let component: CreateOrEditEmailMaintenencekDialogComponent;
  let fixture: ComponentFixture<CreateOrEditEmailMaintenencekDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateOrEditEmailMaintenencekDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      CreateOrEditEmailMaintenencekDialogComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
