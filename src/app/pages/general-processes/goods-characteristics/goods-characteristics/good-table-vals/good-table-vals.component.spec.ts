/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodTableValsComponent } from './good-table-vals.component';

describe('GoodTableValsComponent', () => {
  let component: GoodTableValsComponent;
  let fixture: ComponentFixture<GoodTableValsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GoodTableValsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodTableValsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
