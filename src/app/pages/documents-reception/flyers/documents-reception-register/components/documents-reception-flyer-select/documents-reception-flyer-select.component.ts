import { Location } from '@angular/common';
import { Component,OnInit } from '@angular/core';
import { FormBuilder,FormControl,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
FilterParams,
ListParams
} from 'src/app/common/repository/interfaces/list-params';
import { INotification } from 'src/app/core/models/ms-notification/notification.model';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ITmpGestRegDoc } from '../../../../../../core/models/ms-flier/tmp-doc-reg-management.model';
import { DocumentsReceptionDataService } from '../../../../../../core/services/document-reception/documents-reception-data.service';
import { TmpGestRegDocService } from '../../../../../../core/services/ms-flier/tmp-gest-reg-doc.service';
import { ProcedureManagementService } from '../../../../../../core/services/proceduremanagement/proceduremanagement.service';

@Component({
  selector: 'app-documents-reception-flyer-select',
  templateUrl: './documents-reception-flyer-select.component.html',
  styles: [],
})
export class DocumentsReceptionFlyerSelectComponent
  extends BasePage
  implements OnInit
{
  flyerForm = this.fb.group({
    flyerNumber: new FormControl<INotification>(null, [Validators.required]),
  });
  flyers = new DefaultSelect<INotification>();
  callback?: (next: INotification) => void;
  constructor(
    private fb: FormBuilder,
    private location: Location,
    private modalRef: BsModalRef,
    private notifService: NotificationService,
    private procedureManageService: ProcedureManagementService,
    private tmpGestRegDocService: TmpGestRegDocService,
    private docsDataService: DocumentsReceptionDataService,
    private router: Router
  ) {
    super();
  }

  get flyerNumber() {
    return this.flyerForm.controls['flyerNumber'];
  }

  ngOnInit(): void {}

  close() {
    this.modalRef.hide();
  }

  exit() {
    this.modalRef.hide();
    this.router.navigateByUrl('/');
  }

  confirm() {
    const flyerNumber = this.flyerForm.controls.flyerNumber.value;
    this.modalRef.content.callback(flyerNumber);
    this.modalRef.hide();
  }

  getNotifications(lparams: ListParams) {
    this.loading = true;
    const params = new FilterParams();
    params.page = lparams.inicio;
    params.limit = 10;
    if (lparams.text.length > 0) params.addFilter('wheelNumber', lparams.text);
    this.notifService.getAllFilter(params.getParams()).subscribe({
      next: data => {
        this.flyers = new DefaultSelect(data.data, data.count);
        this.loading = false;
      },
      error: err => {
        console.log(err);
        this.flyers = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  parseDatepickerFormat(date: Date, format?: string): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    let dateString = `${day}/${month}/${year}`;
    if (format == 'EN') {
      dateString = `${month}/${day}/${year}`;
    }
    return dateString;
  }

  simulateOffice(type?: string) {
    const params = new FilterParams();
    params.addFilter('status', 'OPI');
    if (type == 'SAT') {
      params.addFilter('typeManagement', '2');
    }
    if (type == 'PGR') {
      params.addFilter('typeManagement', '3');
    }
    // console.log(params.getParams());
    this.procedureManageService.getAllFiltered(params.getParams()).subscribe({
      next: data => {
        console.log(data);
        const idx = Math.floor(Math.random() * 10);
        const proc = data.data[idx];
        let satIndicator = 0;
        if (type == '2') satIndicator = 1;
        let wheelNumber = proc.wheelNumber;
        if (proc.wheelNumber == 0) wheelNumber = null;
        let expType = 'PAMA';
        if (type == 'PGR') expType = 'PAE';
        console.log(proc.wheelNumber, wheelNumber);
        this.docsDataService.flyersRegistrationParams = {
          pIndicadorSat: satIndicator, // 0 / 1
          pGestOk: 1,
          pNoVolante: wheelNumber, //  !== null
          pNoTramite: proc.id,
          pSatTipoExp: expType, // != null
          noTransferente: null,
        };
        let uniqueKey = '10997';
        if (type == 'PGR') uniqueKey = '10006';
        if (type == 'SAT') uniqueKey = '12191';
        const body: ITmpGestRegDoc = {
          description: proc.observation,
          affair: proc.affair,
          senderExt: null,
          affairKey: null,
          typeProcedure: null,
          cityNumber: null,
          stationNumber: null,
          onlyKey: uniqueKey,
          taxpayerNumber: null,
          courtNumber: null,
          authorityNumber: null,
          typeJudgment: null,
          officeNumber: proc.officeNumber,
          entfedKey: null,
          officeExternalDate: this.parseDatepickerFormat(
            new Date(proc.actualDate)
          ),
          transfereeFinalNumber: null,
          affairSijNumber: proc.affairSij,
          affairDijpNumber: null,
          city: null,
          transferent: null,
          station: null,
          authority: null,
          status: proc.status,
          affairDetail: null,
        };
        if (type == 'PGR' || type == 'SAT') {
          // this.tmpGestRegDocService.create(body).subscribe({
          //   next: () => {},
          //   error: () => {},
          // });
        }
        this.close();
        this.alert(
          'info',
          'Recordatorio',
          'Se le dirigirá a la pantalla de inicio, recuerde navegar de regreso a Registro de Volantes para ver cambios.'
        );
        this.router.navigateByUrl('/');
      },
      error: () => {},
    });
  }
}
