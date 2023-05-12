/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { MJobManagementService } from 'src/app/core/services/ms-office-management/m-job-management.service';
/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-generation-files-trades',
  templateUrl: './generation-files-trades.component.html',
  styleUrls: ['./generation-files-trades.component.scss'],
})
export class GenerationFilesTradesComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  public form: FormGroup;
  selectWheel = new DefaultSelect<any>();

  constructor(
    private mJobManagementService: MJobManagementService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private token: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    // this.listWheels(new ListParams())
    this.prepareForm();
    this.loading = true;
  }
  private prepareForm() {
    this.form = this.fb.group({
      noVolante: ['', [Validators.required]],
      noExpediente: [''],
      noOficio: [''],
      tipoOficio: [''],
      estatus: [''],
      cveOficio: [''],
      oficioPor: [''],
      remitente: [''],
      destinatario: [''],
      nomPerExt: [''],
    });
  }

  listWheels(params?: ListParams) {
    params['filter.flyerNumber'] = `$eq:${params.text}`;
    delete params['search'];
    this.mJobManagementService.getAll(params).subscribe({
      next: (data: any) => {
        console.log('RESP', data);

        this.selectWheel = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.cleanForm();
        this.selectWheel = new DefaultSelect();
      },
    });
  }

  getWheel(item: any) {
    this.loading = true;

    console.log('DATA', item);
    if (item.managementNumber) {
      if (item != undefined) {
        this.loading = false;
        this.form.get('noExpediente').setValue(item.recordNumber);
        this.form.get('noExpediente').setValue(item.recordNumber);
        this.form.get('noOficio').setValue(item.managementNumber);
        this.form.get('tipoOficio').setValue(item.jobType);
        this.form.get('estatus').setValue(item.statusOf);
        this.form.get('oficioPor').setValue(item.jobBy);
        this.form.get('remitente').setValue(item.sender);
        this.form.get('destinatario').setValue(item.addressee);
        this.form.get('nomPerExt').setValue(item.nomPersExt);
        this.form.get('cveOficio').setValue(item.cveManagement);
      } else {
        this.cleanForm();
      }
    } else {
      this.onLoadToast('warning', 'No se ha especificado el Dictamen', '');
    }
  }

  cleanForm() {
    this.form.get('noVolante').setValue('');
    this.form.get('noExpediente').setValue('');
    this.form.get('noOficio').setValue('');
    this.form.get('tipoOficio').setValue('');
    this.form.get('estatus').setValue('');
    this.form.get('oficioPor').setValue('');
    this.form.get('remitente').setValue('');
    this.form.get('destinatario').setValue('');
    this.form.get('nomPerExt').setValue('');
    this.form.get('cveOficio').setValue('');
  }

  btnGenerarOficio(): any {
    this.loading = true;

    let STATUS = this.form.get('estatus').value;

    // let params = {
    //   NO_OF_GES: this.form.get('noOficio').value,
    //   TIPO_OF: this.form.get('tipoOficio').value,
    //   VOLANTE: this.form.get('noVolante').value,
    //   EXP: this.form.get('noExpediente').value
    // };

    let params = {
      P_USR: 'ZLB11_128',
      P_CUMP: 1,
      P_T_NO_CUMP: 2,
      P_T_CUMP: 3,
    };

    // let params = {
    //   P_USR: this.form.get('noOficio').value,
    //   P_CUMP: this.form.get('tipoOficio').value,
    //   P_T_NO_CUMP: this.form.get('noVolante').value,
    //   P_T_CUMP: this.form.get('noExpediente').value,
    // };

    if (STATUS == 'INTERNO') {
      this.siabService
        .fetchReport('RINDICA_0001', params)
        .subscribe(response => {
          if (response !== null) {
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            let config = {
              initialState: {
                documento: {
                  urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                  type: 'pdf',
                },
                callback: (data: any) => {},
              }, //pasar datos por aca
              class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
              ignoreBackdropClick: true, //ignora el click fuera del modal
            };
            this.onLoadToast('success', '', 'Reporte generado');
            this.cleanForm();
            this.modalService.show(PreviewDocumentsComponent, config);
          }
        });
    } else {
      this.siabService
        .fetchReport('RINDICA_0002', params)
        .subscribe(response => {
          if (response !== null) {
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            console.log('AQUI', url);
            let config = {
              initialState: {
                documento: {
                  urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                  type: 'pdf',
                },
                callback: (data: any) => {},
              }, //pasar datos por aca
              class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
              ignoreBackdropClick: true, //ignora el click fuera del modal
            };
            this.onLoadToast('success', '', 'Reporte generado');
            this.cleanForm();
            this.modalService.show(PreviewDocumentsComponent, config);
          }
        });
    }

    this.loading = false;
  }
}
