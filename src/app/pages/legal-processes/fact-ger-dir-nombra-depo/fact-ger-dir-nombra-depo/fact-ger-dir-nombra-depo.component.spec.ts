import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactGerDirNombraDepoComponent } from './fact-ger-dir-nombra-depo.component';

describe('FactGerDirNombraDepoComponent', () => {
  let component: FactGerDirNombraDepoComponent;
  let fixture: ComponentFixture<FactGerDirNombraDepoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FactGerDirNombraDepoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FactGerDirNombraDepoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
