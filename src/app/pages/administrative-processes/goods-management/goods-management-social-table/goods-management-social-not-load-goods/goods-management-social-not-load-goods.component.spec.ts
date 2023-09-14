/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsManagementSocialNotLoadGoodsComponent } from './goods-management-social-not-load-goods.component';

describe('GoodsManagementSocialNotLoadGoodsComponent', () => {
  let component: GoodsManagementSocialNotLoadGoodsComponent;
  let fixture: ComponentFixture<GoodsManagementSocialNotLoadGoodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GoodsManagementSocialNotLoadGoodsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      GoodsManagementSocialNotLoadGoodsComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
