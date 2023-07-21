/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamsConcepsListComponent } from './params-conceps-list.component';

describe('ParamsConcepsListComponent', () => {
  let component: ParamsConcepsListComponent;
  let fixture: ComponentFixture<ParamsConcepsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParamsConcepsListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamsConcepsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
