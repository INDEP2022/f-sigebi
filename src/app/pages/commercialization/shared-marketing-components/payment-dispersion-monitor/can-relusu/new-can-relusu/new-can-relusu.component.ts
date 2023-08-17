import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IComerReldisDisp } from 'src/app/core/services/ms-payment/payment-service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-new-can-relusu',
  templateUrl: './new-can-relusu.component.html',
  styleUrls: [],
})
export class NewCanRelusuComponent extends BasePage implements OnInit {
  form: FormGroup;

  dataUser = new DefaultSelect();

  constructor(
    private bsModal: BsModalRef,
    private fb: FormBuilder,
    private securityService: SecurityService,
    private paymentService: PaymentService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getDataUser();
  }

  private prepareForm() {
    this.form = this.fb.group({
      user: [null, Validators.required],
      indDis: [null, Validators.required],
      indSirsae: [null, Validators.required],
    });
  }

  //gets
  get user() {
    return this.form.get('user');
  }

  get indDis() {
    return this.form.get('indDis');
  }

  get indSirsae() {
    return this.form.get('indSirsae');
  }

  close() {
    this.bsModal.hide();
  }

  getDataUser(e?: ListParams) {
    const paramsF = new FilterParams();
    if (e) {
      paramsF.addFilter('user', e.text, SearchFilter.ILIKE);
    }
    this.securityService
      .getAllUsersTracker(e ? paramsF.getParams() : '')
      .subscribe(
        res => {
          console.log(res);
          const newData = res.data.map((e: any) => {
            return {
              ...e,
              labelData: `${e.user} - ${e.name}`,
            };
          });

          this.dataUser = new DefaultSelect(newData, res.count);
        },
        err => {
          console.log(err);
          this.dataUser = new DefaultSelect();
        }
      );
  }

  saveNew() {
    if (this.user.value != null) {
      if (
        [null, false].includes(this.indSirsae.value) &&
        [null, false].includes(this.indDis.value)
      ) {
        this.alert('warning', 'Debe Seleccionar por lo Menos una Opción', '');
        this.indSirsae.markAsTouched();
        this.indDis.markAsTouched();
      } else {
        const body: IComerReldisDisp = {
          user: this.user.value.user,
          inddistance: this.indDis.value ? 1 : 0,
          indsirsae: this.indSirsae.value ? 1 : 0,
          numberRecord: 0,
          indlibpg: 0,
        };

        this.paymentService.postComerReldisDiso(body).subscribe(
          res => {
            console.log(res);
            this.alert('success', 'Registro Creado', '');
            this.bsModal.content.callback(true);
            this.bsModal.hide();
          },
          err => {
            console.log(err);
            this.alert(
              'error',
              'Se Presentó un Error Inesperado',
              'Por favor Intentelo Nuevamente'
            );
          }
        );
      }
    } else {
      this.alert('warning', 'No Seleccionó Usuario', '');
      this.user.markAsTouched();
    }
  }
}
