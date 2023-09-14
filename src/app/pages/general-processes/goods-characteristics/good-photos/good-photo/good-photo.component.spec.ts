/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodPhotoComponent } from './good-photo.component';

describe('GoodPhotoComponent', () => {
  let component: GoodPhotoComponent;
  let fixture: ComponentFixture<GoodPhotoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GoodPhotoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
