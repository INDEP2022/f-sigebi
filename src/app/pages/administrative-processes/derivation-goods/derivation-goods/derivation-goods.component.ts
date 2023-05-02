import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { GoodsComponent } from '../goods/goods.component';

@Component({
  selector: 'app-derivation-goods',
  templateUrl: './derivation-goods.component.html',
  styles: [],
})
export class DerivationGoodsComponent implements OnInit {
  //Reactive Forms
  form: FormGroup;

  // Variable para la contraseña
  private _password: string;

  get idConversion() {
    return this.form.get('idConversion');
  }
  get numberGoodFather() {
    return this.form.get('numberGoodFather');
  }
  get tipo() {
    return this.form.get('tipo');
  }
  get numberDossier() {
    return this.form.get('numberDossier');
  }
  get status() {
    return this.form.get('status');
  }
  get situation() {
    return this.form.get('situation');
  }
  get actConvertion() {
    return this.form.get('actConvertion');
  }
  get description() {
    return this.form.get('description');
  }
  get numberGoodSon() {
    return this.form.get('numberGoodSon');
  }
  get observation() {
    return this.form.get('observation');
  }
  get descriptionSon() {
    return this.form.get('descriptionSon');
  }
  get quantity() {
    return this.form.get('quantity');
  }
  get classifier() {
    return this.form.get('classifier');
  }
  get unitOfMeasure() {
    return this.form.get('unitOfMeasure');
  }
  get destinationLabel() {
    return this.form.get('destinationLabel');
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      idConversion: [null, [Validators.required]],
      numberGoodFather: [null, [Validators.required]],
      tipo: [null, [Validators.required]],
      numberDossier: [null, [Validators.required]],
      status: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      situation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      actConvertion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      numberGoodSon: [null, [Validators.required]],
      observation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      descriptionSon: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      quantity: [null, [Validators.required]],
      classifier: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      unitOfMeasure: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      destinationLabel: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  searchGoods() {}

  updateStatus() {
    //this.showToast('success')
  }

  actConversionBtn() {}

  finishConversion() {}

  bulkUpload() {
    this.router.navigate([
      'pages/administrative-processes/derivation-goods/bulk-upload',
    ]);
  }

  imgUpload() {}

  openModal(): void {
    this.modalService.show(GoodsComponent, {
      initialState: {},
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  /* showToast(status: NbComponentStatus) {
    this.toastrService.show(status, 'Estado cambiado exitosamente !!', { status });
  } */
}
