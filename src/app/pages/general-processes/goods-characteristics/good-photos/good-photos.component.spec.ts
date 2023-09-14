/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodPhotosComponent } from './good-photos.component';

describe('GoodPhotosComponent', () => {
  let component: GoodPhotosComponent;
  let fixture: ComponentFixture<GoodPhotosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GoodPhotosComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
