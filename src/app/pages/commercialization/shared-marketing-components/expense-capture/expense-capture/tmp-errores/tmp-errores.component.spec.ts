/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TmpErroresComponent } from './tmp-errores.component';

describe('TmpErroresComponent', () => {
  let component: TmpErroresComponent;
  let fixture: ComponentFixture<TmpErroresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TmpErroresComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TmpErroresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
