import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { LabelOkeyService } from 'src/app/core/services/catalogs/label-okey.service';
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
    private goodService: GoodService
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
      error: error => {},
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

    let objGood = {
      id: this.goodData.id,
      goodId: this.goodData.id,
      labelNumber: labelGood,
    };
    console.log('ObjGood', objGood);

    this.goodService.update(objGood).subscribe({
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
