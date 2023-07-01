/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotosHistoricComponent } from './photos-historic.component';

describe('PhotosHistoricComponent', () => {
  let component: PhotosHistoricComponent;
  let fixture: ComponentFixture<PhotosHistoricComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PhotosHistoricComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotosHistoricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
