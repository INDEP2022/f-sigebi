/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsManagementSocialCabinetTabComponent } from './goods-management-social-cabinet-tab.component';

describe('GoodsManagementSocialCabinetTabComponent', () => {
  let component: GoodsManagementSocialCabinetTabComponent;
  let fixture: ComponentFixture<GoodsManagementSocialCabinetTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GoodsManagementSocialCabinetTabComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsManagementSocialCabinetTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
