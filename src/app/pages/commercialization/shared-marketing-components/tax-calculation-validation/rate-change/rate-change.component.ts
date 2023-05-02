import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-rate-change',
  templateUrl: './rate-change.component.html',
  styles: [],
})
export class RateChangeComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  rateBatch: number = 0;
  rateResiConstruction: number = 0;
  rateCommerConstruction: number = 0;
  rateSpecialPlants: number = 0;
  otherRate: number = 0;

  edit: boolean = false;
  title: string = 'Cambio de Tasa';

  @Output() data = new EventEmitter<{}>();

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      rateBatch: [0],
      rateResiConstruction: [0],
      rateCommerConstruction: [0],
      rateSpecialPlants: [0],
      otherRate: [0],
      goodId: [null, [Validators.required]],
    });

    this.form.controls['rateBatch'].valueChanges.subscribe(val => {
      this.rateBatch = val;
    });
    this.form.controls['rateResiConstruction'].valueChanges.subscribe(val => {
      this.rateResiConstruction = val;
    });
    this.form.controls['rateCommerConstruction'].valueChanges.subscribe(val => {
      this.rateCommerConstruction = val;
    });
    this.form.controls['rateSpecialPlants'].valueChanges.subscribe(val => {
      this.rateSpecialPlants = val;
    });
    this.form.controls['otherRate'].valueChanges.subscribe(val => {
      this.otherRate = val;
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    let data = {};
    this.data.emit(data);
    this.modalRef.hide();
  }
}
