/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsManagementSocialTableErrorsComponent } from './goods-management-social-table-errors.component';

describe('GoodsManagementSocialTableErrorsComponent', () => {
  let component: GoodsManagementSocialTableErrorsComponent;
  let fixture: ComponentFixture<GoodsManagementSocialTableErrorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GoodsManagementSocialTableErrorsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      GoodsManagementSocialTableErrorsComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
