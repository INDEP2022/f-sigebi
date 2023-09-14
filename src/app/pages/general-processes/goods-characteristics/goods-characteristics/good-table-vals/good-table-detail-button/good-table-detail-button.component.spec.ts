/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodTableDetailButtonComponent } from './good-table-detail-button.component';

describe('GoodTableDetailButtonComponent', () => {
  let component: GoodTableDetailButtonComponent;
  let fixture: ComponentFixture<GoodTableDetailButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GoodTableDetailButtonComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodTableDetailButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
