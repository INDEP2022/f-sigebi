/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrEditEmailBookDialogComponent } from './create-or-edit-email-book-dialog.component';

describe('CreateOrEditEmailBookDialogComponent', () => {
  let component: CreateOrEditEmailBookDialogComponent;
  let fixture: ComponentFixture<CreateOrEditEmailBookDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateOrEditEmailBookDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrEditEmailBookDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
