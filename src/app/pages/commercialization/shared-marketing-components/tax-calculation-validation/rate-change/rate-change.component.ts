import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AppraiseService } from 'src/app/core/services/ms-appraise/appraise.service';
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
  TASA_IVA_TERRENO: any;

  IVA_CONS_HABITACIONAL: string;
  AUX_TASA_IVA_CONS_HABITACIONAL: string;
  TASA_IVA_CONSTR_HAB: any;

  dataDet: any;

  AUX_NO_BIEN: any;
  AUX_TASA_TERRENO: any;
  AUX_TASA_CONSTR_HAB: any;
  AUX_TASA_CONSTR_COMER: any;
  AUX_TASA_INST_ESP: any;
  AUX_TASA_OTROS: any;

  IVA_CONSTRUCION: any;
  AUX_TASA_IVA_CONSTRUCION: any;
  TASA_IVA_CONSTR_COMER: any;

  IVA_INSTALACIONES_ESP: any;
  AUX_TASA_IVA_INSTALACIONES_ESP: any;
  TASA_IVA_INST_ESP: any;

  IVA_OTROS: any;
  AUX_TASA_IVA_OTROS: any;
  TASA_IVA_OTROS: any;

  vriIva: any;
  totalAccount: any;

  dataComple: any;

  @Output() data = new EventEmitter<{}>();
  @Input() patchValue: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private appraiseService: AppraiseService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    if (this.dataDet) {
      console.log('data dataDet ', this.dataDet);
      console.log(
        'Tasa terreno ',
        this.convertDecToInteger(this.dataDet.terrainRate)
      );
      console.log(
        'Tasa constucción habitacional ',
        this.convertDecToInteger(this.dataDet.rateHousing)
      );
      console.log('Tasa construcción comercial ', this.dataDet.rateCommercial);
      console.log('Tasa Instalaciones espeaciales ', this.dataDet.rateSpecials);
      console.log('Tasa Otros ', this.dataDet.rateOthers);
      this.form.patchValue({
        goodId: this.dataDet.goodId,
        goodDescription: this.dataDet.goodDescription,
      });

      this.form
        .get('rateBatch')
        .patchValue(this.convertDecToInteger(this.dataDet.terrainRate));
      this.form
        .get('rateResiConstruction')
        .patchValue(this.convertDecToInteger(this.dataDet.rateHousing));
      this.form
        .get('rateCommerConstruction')
        .patchValue(this.convertDecToInteger(this.dataDet.rateCommercial));
      this.form
        .get('rateSpecialPlants')
        .patchValue(this.convertDecToInteger(this.dataDet.rateSpecials));
      this.form
        .get('otherRate')
        .patchValue(this.convertDecToInteger(this.dataDet.rateOthers));

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
      goodDescription: [null, [Validators.required]],
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

  onGoodsChange() {
    if (this.patchValue) {
      this.form.patchValue({
        goodId: Number(this.dataDet.goodId),
        goodDescription: this.dataDet.goodDescription,
      });
    }
    this.form.updateValueAndValidity();
    //this.resetFields([this.subgood]);
    //this.subgoods = new DefaultSelect();
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    let data = {};
    this.saveTasa();
  }

  saveTasa() {
    // this.alert(
    //   'success',
    //   '',
    //   'no hay data ' + this.form.get('rateBatch').value
    // );

    //this.alert('success', '', 'valor ' + this.form.get('rateBatch').value);

    /**--*************************** TASA_TERRENO ************************* */
    if (this.form.get('rateBatch').value == null) {
      this.IVA_TERRENO = 'N/A';
      this.AUX_TASA_IVA_TERRENO = 'EXENTO';
      this.TASA_IVA_TERRENO = null;
    } else {
      this.IVA_TERRENO = String(
        Number(this.form.get('rateBatch').value) *
          this.nvl(this.dataDet.vTerrain)
      );
      this.AUX_TASA_IVA_TERRENO =
        String(Number(this.form.get('rateBatch').value) * 100) + '%';
      this.TASA_IVA_TERRENO = Number(this.form.get('rateBatch').value);
    }
    /**--*************************** TASA_CONSTR_HAB *********************** */
    if (this.form.get('rateResiConstruction').value == null) {
      this.IVA_CONS_HABITACIONAL = 'N/A';
      this.AUX_TASA_IVA_CONS_HABITACIONAL = 'EXENTO';
      this.TASA_IVA_CONSTR_HAB = null;
    } else {
      this.IVA_CONS_HABITACIONAL = String(
        Number(this.form.get('rateResiConstruction').value) *
          this.nvl(this.dataDet.vConstruction)
      );
      this.AUX_TASA_IVA_CONS_HABITACIONAL =
        String(Number(this.form.get('rateResiConstruction').value) * 100) + '%';
      this.TASA_IVA_CONSTR_HAB = Number(
        this.form.get('rateResiConstruction').value
      );
    }
    /**--*************************** TASA_CONSTR_COMER ******************** */
    if (this.form.get('rateCommerConstruction').value == null) {
      this.IVA_CONSTRUCION = 'N/A';
      this.AUX_TASA_IVA_CONSTRUCION = 'EXENTO';
      this.TASA_IVA_CONSTR_COMER = null;
    } else {
      this.IVA_CONSTRUCION = String(
        Number(this.form.get('rateCommerConstruction').value) *
          this.nvl(this.dataDet.vConstructionEat)
      );
      this.AUX_TASA_IVA_CONSTRUCION =
        String(Number(this.form.get('rateCommerConstruction').value) * 100) +
        '%';
      this.TASA_IVA_CONSTR_COMER = Number(
        this.form.get('rateCommerConstruction').value
      );
    }
    /**--*************************** TASA_INST_ESP ************************ */
    if (this.form.get('rateSpecialPlants').value == null) {
      this.IVA_INSTALACIONES_ESP = 'N/A';
      this.AUX_TASA_IVA_INSTALACIONES_ESP = 'EXENTO';
      this.TASA_IVA_INST_ESP = null;
    } else {
      this.IVA_INSTALACIONES_ESP = String(
        Number(this.form.get('rateSpecialPlants').value) *
          this.nvl(this.dataDet.vInstallationsEsp)
      );
      this.AUX_TASA_IVA_INSTALACIONES_ESP =
        String(Number(this.form.get('rateSpecialPlants').value) * 100) + '%';
      this.TASA_IVA_INST_ESP = Number(this.form.get('rateSpecialPlants').value);
    }
    /**--*************************** TASA_OTROS *************************** */
    if (this.form.get('otherRate').value == null) {
      this.IVA_OTROS = 'N/A';
      this.AUX_TASA_IVA_OTROS = 'EXENTO';
      this.TASA_IVA_OTROS = null;
    } else {
      this.IVA_OTROS = String(
        Number(this.form.get('otherRate').value) *
          this.nvl(this.dataDet.vOthers)
      );
      this.AUX_TASA_IVA_OTROS =
        String(Number(this.form.get('otherRate').value) * 100) + '%';
      this.TASA_IVA_OTROS = Number(this.form.get('otherRate').value);
    }
    /********************************************************************* */
    // if (
    //   this.form.get('rateBatch').value != this.AUX_TASA_TERRENO ||
    //   this.form.get('rateResiConstruction').value != this.AUX_TASA_CONSTR_HAB ||
    //   this.form.get('rateCommerConstruction').value !=
    //     this.AUX_TASA_CONSTR_COMER ||
    //   this.form.get('rateSpecialPlants').value != this.AUX_TASA_INST_ESP ||
    //   this.form.get('otherRate').value != this.AUX_TASA_OTROS
    // ) {
    //   this.v_cambio = 'S';
    // }
    /********************************************************************* */
    // if (this.v_cambio == 'S') {
    this.v_vri =
      this.nvl(this.dataDet.vTerrain) +
      this.nvl(this.dataDet.vConstruction) +
      this.nvl(this.dataDet.vConstructionEat) +
      this.nvl(this.dataDet.vInstallationsEsp) +
      this.nvl(this.dataDet.vOthers);

    if (
      this.form.get('rateBatch').value != 1000 &&
      this.form.get('rateBatch').value != null
    ) {
      this.v_iva = Number(this.dataDet.terrainIva);
    }

    if (
      this.form.get('rateResiConstruction').value != 1000 &&
      this.form.get('rateResiConstruction').value != null
    ) {
      this.v_iva = this.v_iva + Number(this.dataDet.ivaHousing);
    }

    if (
      this.form.get('rateCommerConstruction').value != 1000 &&
      this.form.get('rateCommerConstruction').value != null
    ) {
      this.v_iva = this.v_iva + Number(this.dataDet.ivaCommercial);
    }

    if (
      this.form.get('rateSpecialPlants').value != 1000 &&
      this.form.get('rateSpecialPlants').value != null
    ) {
      this.v_iva = this.v_iva + Number(this.dataDet.ivaSpecial);
    }

    if (
      this.form.get('otherRate').value != 1000 &&
      this.form.get('otherRate').value != null
    ) {
      this.v_iva = this.v_iva + Number(this.dataDet.ivaOthers);
    }

    this.totalAccount = this.v_vri + this.v_iva;

    this.vriIva =
      this.nvl(this.TASA_IVA_TERRENO) * this.dataDet.vTerrain +
      this.nvl(this.TASA_IVA_CONSTR_HAB) * this.dataDet.vConstruction +
      this.nvl(this.TASA_IVA_CONSTR_COMER) * this.dataDet.vConstructionEat +
      this.nvl(this.TASA_IVA_INST_ESP) * this.dataDet.vInstallationsEsp +
      this.nvl(this.TASA_IVA_OTROS) +
      this.dataDet.vOthers;
    //}

    //this.data.emit(data);
    //this.modalRef.hide();

    let modal = {
      IVA_TERRENO: this.IVA_TERRENO,
      terrainRate: this.form.get('rateBatch').value,

      IVA_CONS_HABITACIONAL: this.IVA_CONS_HABITACIONAL,
      rateHousing: Number(this.form.get('rateResiConstruction').value),
      IVA_CONSTRUCION: this.IVA_CONSTRUCION,
      rateCommercial: this.form.get('rateCommerConstruction').value,
      IVA_INSTALACIONES_ESP: this.IVA_INSTALACIONES_ESP,
      rateSpecials: Number(this.form.get('rateSpecialPlants').value),

      IVA_OTROS: this.IVA_OTROS,
      rateOthers: Number(this.form.get('otherRate').value),
    };
    this.dataComple = modal;

    let body = {
      idAppraisal: Number(this.dataDet.idDetAppraisal),
      idDetAppraisal: Number(this.dataDet.idDetAppraisal1),
      noGood: Number(this.dataDet.goodId),
      vcIva: this.v_iva,
      vriIva: this.vriIva != null ? Number(this.vriIva) : this.vriIva,

      rateIvaTerrain: this.TASA_IVA_TERRENO,
      rateIvaConstrHab: this.TASA_IVA_CONSTR_HAB,
      rateIvaConstrEat: this.TASA_IVA_CONSTR_COMER,
      rateIvaInstEsp: this.TASA_IVA_INST_ESP,
      rateIvaOtros: this.TASA_IVA_OTROS,
    };

    console.log('data update -> ', body);
    this.updateDetailEval(body);
    console.log('this.dataComple ', this.dataComple);
    this.modalRef.content.callback(true, this.dataComple);
    this.close();
  }

  nvl(valor?: number): number {
    if (valor != null) {
      return valor;
    } else {
      return 0;
    }
  }

  updateDetailEval(valor: any) {
    console.log('Body updateDetailEval-> ', valor);
    this.appraiseService.updateEatDetAppraisal(valor).subscribe({
      next: resp => {
        console.log('Resp updateDetailEval-> ', resp);
        this.alert(
          'success',
          'El registro ha sido actualizado correctamente',
          ''
        );
      },
      error: err => {
        this.alert('error', 'El registro no ha sido actualizado', '');
      },
    });
  }

  convertDecToInteger(numero: number): number {
    const parteDecimal = numero - Math.floor(numero);
    if (Number.isInteger(numero) || parteDecimal === 0) {
      // Si es un número entero o tiene una parte decimal igual a 0, lo dejamos sin cambios
      return numero;
    } else {
      // Si tiene una parte decimal distinta de 0, la multiplicamos por 100 para convertirla en entero
      return parteDecimal * 100;
    }
  }
}
