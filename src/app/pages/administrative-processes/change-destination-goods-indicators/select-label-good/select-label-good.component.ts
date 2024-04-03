import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
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
  userName: string = '';
  validUser: boolean = false;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private labelOkeyService: LabelOkeyService,
    private goodService: GoodService,
    private goodProcessService: GoodProcessService,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log('labelNumber', this.labelNumber);

    const user = this.authService.decodeToken();
    this.userName = user.username;
    console.log('user.username', this.userName);

    if (this.userName.startsWith('TLP')) {
      this.validUser = false;
    } else {
      this.validUser = true;
    }
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
    const statusGood = this.goodData.status;
    const noTransferGood = this.goodData.transferNumberExpedient;
    const noClasifGood = this.goodData.goodClassNumber;
    console.log('ID de etiqueta seleccionado:_ ', labelGood);
    console.log('Estatus del Bien', statusGood);

    if (labelGood == null) {
      this.alert('warning', 'Atención', 'No se ha seleccionado un indicador');
      return;
    }

    if (
      this.validUser != true &&
      !['ROP', 'STA', 'STI', 'VXR', 'VXP'].includes(statusGood)
    ) {
      this.alert('warning', 'Atención', 'No puede realizar cambio de destino');
      return;
    }

    if ((noTransferGood == 1 || noTransferGood == 3) && labelGood != 3) {
      this.alert(
        'warning',
        'Atención',
        'Destino erróneo, necesariamente debe ser Resguardo'
      );
      return;
    }

    if (
      (noTransferGood == 121 ||
        noTransferGood == 123 ||
        noTransferGood == 124 ||
        noTransferGood == 536) &&
      noClasifGood != 1600
    ) {
      this.alert(
        'warning',
        'Atención',
        'Destino erróneo, necesariamente debe ser Venta.'
      );
      return;
    }

    /*if(![1,3,121,123,124,536].includes(noTransferGood)){






      this.alert('warning','Atención','Destino erróneo, necesariamente debe ser Venta.');
      return

    }*/

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
