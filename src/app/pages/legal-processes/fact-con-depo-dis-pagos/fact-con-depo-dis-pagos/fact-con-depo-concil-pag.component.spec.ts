import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactCondepoConcilPagComponent } from './fact-condepo-concil-pag.component';

describe('FactCondepoConcilPagComponent', () => {
  let component: FactCondepoConcilPagComponent;
  let fixture: ComponentFixture<FactCondepoConcilPagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FactCondepoConcilPagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FactCondepoConcilPagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
