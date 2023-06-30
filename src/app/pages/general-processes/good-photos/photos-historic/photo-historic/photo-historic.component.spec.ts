/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoHistoricComponent } from './photo-historic.component';

describe('PhotoHistoricComponent', () => {
  let component: PhotoHistoricComponent;
  let fixture: ComponentFixture<PhotoHistoricComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PhotoHistoricComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoHistoricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
