/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodCharacteristicModalComponent } from './good-characteristic-modal.component';

describe('GoodCharacteristicModalComponent', () => {
  let component: GoodCharacteristicModalComponent;
  let fixture: ComponentFixture<GoodCharacteristicModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GoodCharacteristicModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodCharacteristicModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
