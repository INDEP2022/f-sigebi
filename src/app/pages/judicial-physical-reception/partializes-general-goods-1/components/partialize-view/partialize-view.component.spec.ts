/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartializeViewComponent } from './partialize-view.component';

describe('PartializeViewComponent', () => {
  let component: PartializeViewComponent;
  let fixture: ComponentFixture<PartializeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PartializeViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartializeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
