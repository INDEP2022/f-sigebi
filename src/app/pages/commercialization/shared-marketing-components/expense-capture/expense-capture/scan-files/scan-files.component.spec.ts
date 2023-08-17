/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanFilesComponent } from './scan-files.component';

describe('ScanFilesComponent', () => {
  let component: ScanFilesComponent;
  let fixture: ComponentFixture<ScanFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScanFilesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
