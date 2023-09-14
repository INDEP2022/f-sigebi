/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AclarationTableComponent } from './aclaration-table.component';

describe('AclarationTableComponent', () => {
  let component: AclarationTableComponent;
  let fixture: ComponentFixture<AclarationTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AclarationTableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AclarationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
