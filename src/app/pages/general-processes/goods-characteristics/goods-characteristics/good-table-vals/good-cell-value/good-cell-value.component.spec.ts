/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodCellValueComponent } from './good-cell-value.component';

describe('GoodCellValueComponent', () => {
  let component: GoodCellValueComponent;
  let fixture: ComponentFixture<GoodCellValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GoodCellValueComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodCellValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
