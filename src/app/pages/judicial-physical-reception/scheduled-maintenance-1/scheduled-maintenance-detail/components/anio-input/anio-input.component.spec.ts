/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnioInputComponent } from './anio-input.component';

describe('AnioInputComponent', () => {
  let component: AnioInputComponent;
  let fixture: ComponentFixture<AnioInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnioInputComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnioInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
