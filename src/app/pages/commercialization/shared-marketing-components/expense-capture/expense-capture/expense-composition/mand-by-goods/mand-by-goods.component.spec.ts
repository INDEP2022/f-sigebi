/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandByGoodsComponent } from './mand-by-goods.component';

describe('MandByGoodsComponent', () => {
  let component: MandByGoodsComponent;
  let fixture: ComponentFixture<MandByGoodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MandByGoodsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandByGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
