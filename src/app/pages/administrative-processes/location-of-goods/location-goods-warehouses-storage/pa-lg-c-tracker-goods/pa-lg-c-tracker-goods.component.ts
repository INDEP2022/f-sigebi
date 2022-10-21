import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-pa-lg-c-tracker-goods',
  templateUrl: './pa-lg-c-tracker-goods.component.html',
  styles: [],
})
export class PaLgCTrackerGoodsComponent implements OnInit {
  //Reactive Forms
  form: FormGroup;

  //Criterio por clasificación de bienes
  get tariffFraction() {
    return this.form.get('tariffFraction');
  }
  get goodsClassificationNumber() {
    return this.form.get('goodsClassificationNumber');
  }
  get alternateClassificationGood() {
    return this.form.get('alternateClassificationGood');
  }
  get search() {
    return this.form.get('search');
  }

  //Reactive Forms
  formCriteria: FormGroup;
  //Criterios por Datos del Bien
  get numberGood() {
    return this.formCriteria.get('numberGood');
  }
  get listGoods() {
    return this.formCriteria.get('listGoods');
  }
  get inventorySAMI() {
    return this.formCriteria.get('inventorySAMI');
  }
  get listInventory() {
    return this.formCriteria.get('listInventory');
  }
  get process() {
    return this.formCriteria.get('process');
  }
  get targetIndicator() {
    return this.formCriteria.get('targetIndicator');
  }
  get status() {
    return this.formCriteria.get('status');
  }
  get goods() {
    return this.formCriteria.get('goods');
  }
  get goodFatherMenssagge() {
    return this.formCriteria.get('goodFatherMenssagge');
  }
  get approisedValue() {
    return this.formCriteria.get('approisedValue');
  }
  get to() {
    return this.formCriteria.get('to');
  }
  get dateImg() {
    return this.formCriteria.get('dateImg');
  }
  get description() {
    return this.formCriteria.get('description');
  }
  get attributes() {
    return this.formCriteria.get('attributes');
  }
  get identifier() {
    return this.formCriteria.get('identifier');
  }
  get furnitureInv() {
    return this.formCriteria.get('furnitureInv');
  }
  get siabiInv() {
    return this.formCriteria.get('siabiInv');
  }
  get cisiInv() {
    return this.formCriteria.get('cisiInv');
  }
  get socialCabinet() {
    return this.formCriteria.get('socialCabinet');
  }

  //Reactive Forms
  formCriterionFiles: FormGroup;
  // Criterio por expediente, Notificación y Dictamen
  get dossier() {
    return this.formCriterionFiles.get('dossier');
  }
  get numberFlyer() {
    return this.formCriterionFiles.get('numberFlyer');
  }
  get typeFlyer() {
    return this.formCriterionFiles.get('typeFlyer');
  }
  get listFiles() {
    return this.formCriterionFiles.get('listFiles');
  }
  get nameGiven() {
    return this.formCriterionFiles.get('nameGiven');
  }
  get numberCourt() {
    return this.formCriterionFiles.get('numberCourt');
  }
  get dateOficExt() {
    return this.formCriterionFiles.get('dateOficExt');
  }
  get publicMinistry() {
    return this.formCriterionFiles.get('publicMinistry');
  }
  get oficExtNo() {
    return this.formCriterionFiles.get('oficExtNo');
  }
  get opinion() {
    return this.formCriterionFiles.get('opinion');
  }
  get expoTrans() {
    return this.formCriterionFiles.get('expoTrans');
  }
  get amparo() {
    return this.formCriterionFiles.get('amparo');
  }
  get touchesPenal() {
    return this.formCriterionFiles.get('touchesPenal');
  }
  get preliminaryInvestigation() {
    return this.formCriterionFiles.get('preliminaryInvestigation');
  }
  get penalCause() {
    return this.formCriterionFiles.get('penalCause');
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.buildFormCriteria();
    this.buildFormCriterionFiles();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */

  private buildForm() {
    this.form = this.fb.group({
      tariffFraction: [null, [Validators.required]],
      goodsClassificationNumber: [null, [Validators.required]],
      alternateClassificationGood: [null, [Validators.required]],
      search: [null, [Validators.required]],
    });
  }

  private buildFormCriteria() {
    this.formCriteria = this.fb.group({
      numberGood: [null, [Validators.required]],
      listGoods: [null, [Validators.required]],
      inventorySAMI: [null, [Validators.required]],
      listInventory: [null, [Validators.required]],
      process: [null, [Validators.required]],
      targetIndicator: [null, [Validators.required]],
      status: [null, [Validators.required]],
      goods: [null, [Validators.required]],
      goodFatherMenssagge: [null, [Validators.required]],
      approisedValue: [null, [Validators.required]],
      to: [null, [Validators.required]],
      dateImg: [null, [Validators.required]],
      description: [null, [Validators.required]],
      attributes: [null, [Validators.required]],
      identifier: [null, [Validators.required]],
      furnitureInv: [null, [Validators.required]],
      siabiInv: [null, [Validators.required]],
      cisiInv: [null, [Validators.required]],
      socialCabinet: [null, [Validators.required]],
    });
  }

  private buildFormCriterionFiles() {
    this.formCriterionFiles = this.fb.group({
      dossier: [null, [Validators.required]],
      numberFlyer: [null, [Validators.required]],
      typeFlyer: [null, [Validators.required]],
      listFiles: [null, [Validators.required]],
      nameGiven: [null, [Validators.required]],
      numberCourt: [null, [Validators.required]],
      dateOficExt: [null, [Validators.required]],
      publicMinistry: [null, [Validators.required]],
      oficExtNo: [null, [Validators.required]],
      opinion: [null, [Validators.required]],
      expoTrans: [null, [Validators.required]],
      amparo: [null, [Validators.required]],
      touchesPenal: [null, [Validators.required]],
      preliminaryInvestigation: [null, [Validators.required]],
      penalCause: [null, [Validators.required]],
    });
  }
}
