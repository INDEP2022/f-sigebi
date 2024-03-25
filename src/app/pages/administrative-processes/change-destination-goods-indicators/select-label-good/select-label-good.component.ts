import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { LabelOkeyService } from 'src/app/core/services/catalogs/label-okey.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-select-label-good',
  templateUrl: './select-label-good.component.html',
  styleUrls: ['./select-label-good.component.css'],
})
export class SelectLabelGoodComponent extends BasePage implements OnInit {
  form: ModelForm<any>;
  labelNumber: any;
  path: string = '';
  title: string = '';
  goodData: any;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private labelOkeyService: LabelOkeyService,
    private goodService: GoodService,
    private goodProcessService: GoodProcessService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log('labelNumber', this.labelNumber);

    this.labelOkeyService.getById(this.labelNumber).subscribe({
      next: resp => {
        console.log('Respuesta etiqueta: ', resp);
        this.title = resp.description;
      },
      error: error => {
        this.title = '(Sin indicador)';
      },
    });

    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      labelGood: [null],
    });
    /*if (this.affair != null) {
      this.edit = true;
      this.affairForm.patchValue(this.affair);
    }*/
  }

  changeIndicataors() {
    const labelGood = this.form.controls['labelGood'].value;

    console.log('ID de etiqueta seleccionado:_ ', labelGood);

    let objGood1 = {
      goodNumber: Number(this.goodData.id),
      label: Number(labelGood),
      classificationOfGoodsNumber: Number(this.goodData.goodClassNumber),
    };
    console.log('ObjGood', objGood1);

    this.goodProcessService.validInitiationLabel(objGood1).subscribe({
      next: resp => {
        console.log('respuesta de validinitiationLabel', resp);
        //this.alert('warning','Atención',resp.data);
        this.changeLabel();
      },
      error: error => {
        console.log('respuesta de error validinitiationLabel', error);
        this.alert('warning', 'Atención', error.error.message);
      },
    });
  }

  changeLabel() {
    const labelGood = this.form.controls['labelGood'].value;

    let objGood2 = {
      id: this.goodData.id,
      goodId: this.goodData.id,
      labelNumber: labelGood,
    };
    console.log('ObjGood', objGood2);

    this.goodService.update(objGood2).subscribe({
      next: resp => {
        console.log('Actualizado: ', resp);
        this.alert('success', 'Etiqueta Actualizada', '');
        this.modalRef.hide();
        this.modalRef.content.callback(true);
      },
      error: error => {
        console.log('No se actualizó: ', error);
        this.alert(
          'warning',
          'No se logró cambiar la etiqueta',
          'Revisar la información del Bien a modificar'
        );
        this.modalRef.hide();
      },
    });
  }

  close() {
    this.modalRef.hide();
  }
}
