/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandByGoodsModalComponent } from './mand-by-goods-modal.component';

describe('MandByGoodsModalComponent', () => {
  let component: MandByGoodsModalComponent;
  let fixture: ComponentFixture<MandByGoodsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MandByGoodsModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandByGoodsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
