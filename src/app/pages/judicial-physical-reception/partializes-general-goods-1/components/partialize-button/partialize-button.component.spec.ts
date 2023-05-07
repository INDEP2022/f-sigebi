/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartializeButtonComponent } from './partialize-button.component';

describe('PartializeButtonComponent', () => {
  let component: PartializeButtonComponent;
  let fixture: ComponentFixture<PartializeButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PartializeButtonComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartializeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
