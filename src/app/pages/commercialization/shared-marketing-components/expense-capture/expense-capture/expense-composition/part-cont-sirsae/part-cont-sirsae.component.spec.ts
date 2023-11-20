/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartContSirsaeComponent } from './part-cont-sirsae.component';

describe('PartContSirsaeComponent', () => {
  let component: PartContSirsaeComponent;
  let fixture: ComponentFixture<PartContSirsaeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PartContSirsaeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartContSirsaeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
