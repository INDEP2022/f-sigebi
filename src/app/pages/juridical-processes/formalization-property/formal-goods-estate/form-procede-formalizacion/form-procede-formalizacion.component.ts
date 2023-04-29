import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-form-procede-formalizacion',
  templateUrl: './form-procede-formalizacion.component.html',
  styles: [],
})
export class FormProcedeFormalizacionComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  form: FormGroup = new FormGroup({});
  string_PTRN: `[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ@\\s\\.,_\\-¿?\\\\/()%$#¡!|]*'; [a-zA-Z0-9áéíóúÁÉÍÓÚñÑ@\\s\\.,_\\-¿?\\\\/()%$#¡!|]`;
  @Output() refresh = new EventEmitter<true>();
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef
  ) // private comerNotariesTercsService: ComerNotariesTercsService,
  {
    super();
  }

  ngOnInit(): void {}

  prepareForm(): void {
    this.form = this.fb.group({
      idEvent: [''],
      goodNumber: [''],
      oficioDCBI: [
        '',
        [Validators.pattern(this.string_PTRN), Validators.required],
      ],
    });
  }

  close() {
    this.modalRef.hide();
  }

  handleSuccess() {
    this.onLoadToast(
      'success',
      'PROCEDE FORMALIZACIÓN',
      `Oficio DCBI insertado correctamente`
    );
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }
}
