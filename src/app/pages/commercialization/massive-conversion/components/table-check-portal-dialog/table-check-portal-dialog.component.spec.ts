/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCheckPortalDialogComponent } from './table-check-portal-dialog.component';

describe('TableCheckPortalDialogComponent', () => {
  let component: TableCheckPortalDialogComponent;
  let fixture: ComponentFixture<TableCheckPortalDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TableCheckPortalDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableCheckPortalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
