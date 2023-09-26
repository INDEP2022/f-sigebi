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

  v_vri: number = 0;
  v_iva: number = 0;
  v_cambio: string = 'N';
  v_prueba: number;

  IVA_TERRENO: string;
  AUX_TASA_IVA_TERRENO: string;
  TASA_IVA_TERRENO: string;

  IVA_CONS_HABITACIONAL: string;
  AUX_TASA_IVA_CONS_HABITACIONAL: string;
  TASA_IVA_CONSTR_HAB: string;

  dataDet: any;

  AUX_NO_BIEN: any;
  AUX_TASA_TERRENO: any;
  AUX_TASA_CONSTR_HAB: any;
  AUX_TASA_CONSTR_COMER: any;
  AUX_TASA_INST_ESP: any;
  AUX_TASA_OTROS: any;

  @Output() data = new EventEmitter<{}>();

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    if (this.dataDet) {
      console.log('data dataDet ', this.dataDet);
      this.form.get('goodId').patchValue({
        goodId: this.dataDet.goodId,
        goodDescription: this.dataDet.goodDescription,
      });
      if (
        this.dataDet.observations == null ||
        this.dataDet.observations == ''
      ) {
        this.AUX_NO_BIEN = this.dataDet.goodId;
      }
    }
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      rateBatch: [null],
      rateResiConstruction: [null],
      rateCommerConstruction: [null],
      rateSpecialPlants: [null],
      otherRate: [null],
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
    this.saveTasa();
    this.data.emit(data);
    this.modalRef.hide();
  }

  saveTasa() {
    // this.alert(
    //   'success',
    //   '',
    //   'no hay data ' + this.form.get('rateBatch').value
    // );

    this.alert('success', '', 'valor ' + this.form.get('rateBatch').value);

    if (this.form.get('rateBatch').value == 0) {
      this.IVA_TERRENO = 'N/A';
      this.AUX_TASA_IVA_TERRENO = 'EXENTO';
      this.TASA_IVA_TERRENO = null;
    } else {
      this.IVA_TERRENO = String();
      this.AUX_TASA_IVA_TERRENO = 'EXENTO';
      this.TASA_IVA_TERRENO = null;
    }
  }

  nvl(valor?: number): number {
    if (valor != null) {
      return valor;
    } else {
      return 0;
    }
  }
}
