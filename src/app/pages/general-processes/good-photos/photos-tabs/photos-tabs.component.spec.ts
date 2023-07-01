/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotosTabsComponent } from './photos-tabs.component';

describe('PhotosTabsComponent', () => {
  let component: PhotosTabsComponent;
  let fixture: ComponentFixture<PhotosTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PhotosTabsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotosTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
