import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PJDGenerationOfficialFilesComponent } from './pj-d-generationofficialfiles.component';

describe('PJDGenerationOfficialFilesComponent', () => {
  let component: PJDGenerationOfficialFilesComponent;
  let fixture: ComponentFixture<PJDGenerationOfficialFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PJDGenerationOfficialFilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PJDGenerationOfficialFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
