/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyParametersComponent } from './copyParameters.component';

describe('CopyParametersComponent', () => {
  let component: CopyParametersComponent;
  let fixture: ComponentFixture<CopyParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CopyParametersComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
