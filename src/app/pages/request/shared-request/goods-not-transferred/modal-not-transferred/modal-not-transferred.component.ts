import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { INoTransfer } from 'src/app/core/models/no-transfer/no-transfer';
import { NoTransferService } from 'src/app/core/services/no-transfer/no-transfer.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { isNullOrEmpty } from '../../../request-complementary-documentation/request-comp-doc-tasks/request-comp-doc-tasks.component';

@Component({
  selector: 'app-modal-not-transferred',
  templateUrl: './modal-not-transferred.component.html',
  styles: [],
})
export class ModalNotTransferredComponent extends BasePage implements OnInit {
  title: string = 'Bienes no transferidos';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  allotment: any;
  @Output() refresh = new EventEmitter<true>();

  @Input() requestId: number;

  private tranferService = inject(NoTransferService);

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  createTransfer(obj: Object) {
    return new Promise((resolve, reject) => {
      this.tranferService.createNoTransfer(obj).subscribe({
        next: resp => {
          this.onLoadToast('success', 'Bien no transferido creado con éxito');
          resolve(resp);
        },
        error: error => {
          this.onLoadToast('error', 'No se pudo crear el Bien no transferido');
          reject(error);
        },
      });
    });
  }

  updateTransfer(obj: INoTransfer) {
    return new Promise((resolve, reject) => {
      this.tranferService.updateNoTransfer(obj).subscribe({
        next: resp => {
          this.onLoadToast(
            'success',
            'Bien no transferido actualizado con éxito'
          );
          resolve(resp);
        },
        error: error => {
          this.onLoadToast(
            'error',
            'No se pudo actualizar el Bien no transferido'
          );
          reject(error);
        },
      });
    });
  }

  private prepareForm() {
    this.form = this.fb.group({
      relevantType: [null, [Validators.required]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      unitExtent: [null, [Validators.required]],
      amount: [null, [Validators.required]],
    });
    if (this.allotment != null) {
      this.edit = true;
      this.form.patchValue(this.allotment);
    }
  }

  async save() {
    let object = this.form.getRawValue();
    if (this.allotment != null) {
      object['goodNumbertransferredId'] =
        this.allotment.goodNumbertransferredId;
    }

    let fechaActual = new Date();
    let fechaEntero = fechaActual.getTime();
    let fechaCadena = fechaEntero.toString();
    let fechaCortada = fechaCadena.substring(3);
    let fechaFinal = parseInt(fechaCortada);

    if (isNullOrEmpty(this.allotment)) {
      object['applicationId'] = this.requestId;
      object['goodNumbertransferredId'] = fechaFinal;

      await this.createTransfer(object);
    } else {
      await this.updateTransfer(object);
    }

    this.refresh.emit(true);
    this.close();
  }

  close() {
    this.modalRef.hide();
  }
}
