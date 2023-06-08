/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MesInputComponent } from './mes-input.component';

describe('MesInputComponent', () => {
  let component: MesInputComponent;
  let fixture: ComponentFixture<MesInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MesInputComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MesInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
