/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedGoodsComponent } from './rejected-goods.component';

describe('RejectedGoodsComponent', () => {
  let component: RejectedGoodsComponent;
  let fixture: ComponentFixture<RejectedGoodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RejectedGoodsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectedGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
