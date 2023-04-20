import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { debounceTime, Subscription } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { INotification } from 'src/app/core/models/ms-notification/notification.model';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { AppState } from '../../../../../../app.reducers';
import { ITmpGestRegDoc } from '../../../../../../core/models/ms-flier/tmp-doc-reg-management.model';
import { IProceduremanagement } from '../../../../../../core/models/ms-proceduremanagement/ms-proceduremanagement.interface';
import { DocumentsReceptionDataService } from '../../../../../../core/services/document-reception/documents-reception-data.service';
import { TmpGestRegDocService } from '../../../../../../core/services/ms-flier/tmp-gest-reg-doc.service';
import { ProcedureManagementService } from '../../../../../../core/services/proceduremanagement/proceduremanagement.service';
import { IGlobalVars } from '../../../../../../shared/global-vars/models/IGlobalVars.model';
import { GlobalVarsService } from '../../../../../../shared/global-vars/services/global-vars.service';

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
    // flyerNumber: new FormControl<INotification>(null, [Validators.required]),
    flyerNumber: new FormControl<string | number>(null, [Validators.required]),
  });
  flyers = new DefaultSelect<INotification>();
  callback?: (next: INotification) => void;
  globalVars: IGlobalVars;
  obs: Subscription;
  selectedFlyer: INotification = null;
  notificationExists: boolean = false;
  constructor(
    private fb: FormBuilder,
    private location: Location,
    private modalRef: BsModalRef,
    private notifService: NotificationService,
    private procedureManageService: ProcedureManagementService,
    private tmpGestRegDocService: TmpGestRegDocService,
    private docsDataService: DocumentsReceptionDataService,
    private router: Router,
    private store: Store<AppState>,
    private globalVarsService: GlobalVarsService
  ) {
    super();
  }

  get flyerNumber() {
    return this.flyerForm.controls['flyerNumber'];
  }

  ngOnInit(): void {
    this.getGlobalVars();
    this.obs = this.flyerNumber.valueChanges
      .pipe(debounceTime(700))
      .subscribe(data => this.getNotification(data));
  }

  close() {
    this.modalRef.hide();
  }

  exit() {
    this.modalRef.hide();
    if (!this.docsDataService.flyerEditMode) {
      this.router.navigateByUrl('/');
    }
  }

  confirm() {
    // const flyerNumber = this.flyerForm.controls.flyerNumber.value;
    // this.modalRef.content.callback(flyerNumber);
    if (this.selectedFlyer == null) return;
    this.modalRef.content.callback(this.selectedFlyer);
    this.modalRef.hide();
  }

  confirmKey(event: KeyboardEvent) {
    const { key } = event;
    if (key == 'Enter') {
      if (!this.loading && this.flyerForm.valid) {
        this.confirm();
      }
    }
  }

  getNotification(flyer: number | string) {
    if (flyer == null) return;
    this.loading = true;
    const flyerNumber = Number(flyer);
    const params = new FilterParams();
    params.addFilter('wheelNumber', flyerNumber);
    this.hideError();
    this.notifService.getAllFilter(params.getParams()).subscribe({
      next: data => {
        if (data.count > 0) {
          this.selectedFlyer = data.data[0];
          this.flyerForm.controls['flyerNumber'].setErrors(null);
          this.notificationExists = true;
          this.loading = false;
        } else {
          this.selectedFlyer = null;
          this.flyerForm.controls['flyerNumber'].setErrors({ notFound: true });
          this.notificationExists = false;
          this.loading = false;
          this.onLoadToast(
            'warning',
            'Volante no encontrado',
            `No se encontró el volante.`
          );
        }
      },
      error: () => {
        this.selectedFlyer = null;
        this.flyerForm.controls['flyerNumber'].setErrors({ notFound: true });
        this.notificationExists = false;
        this.loading = false;
        this.onLoadToast(
          'warning',
          'Volante no encontrado',
          `No se encontró el volante.`
        );
      },
    });
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

  getGlobalVars() {
    this.globalVarsService
      .getGlobalVars$()
      .subscribe((globalVars: IGlobalVars) => {
        this.globalVars = globalVars;
      });
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
    if (type == 'SAT-MAS') {
      this.procedureManageService.getById(986243).subscribe({
        next: data => {
          this.sendProcedureData(data, type);
        },
        error: () => {},
      });
    }
    if (type == 'PGR-MAS') {
      this.procedureManageService.getById(1044123).subscribe({
        next: data => {
          this.sendProcedureData(data, type);
        },
        error: () => {},
      });
    }
    // console.log(params.getParams());
    if (['STANDARD', 'PGR', 'SAT'].includes(type)) {
      this.procedureManageService.getAllFiltered(params.getParams()).subscribe({
        next: data => {
          console.log(data);
          let idx = Math.floor(Math.random() * 10);
          let proc;
          if (type == 'STANDARD') {
            while (
              [2, 3, '2', '3'].includes(data.data[idx].typeManagement) ||
              proc == undefined
            ) {
              idx = idx = Math.floor(Math.random() * 10);
              proc = data.data[idx];
              console.log(proc);
            }
          } else {
            while (proc == undefined) {
              idx = idx = Math.floor(Math.random() * 10);
              proc = data.data[idx];
              console.log(proc);
            }
          }
          console.log(proc);
          let satIndicator = null;
          if (type == 'SAT') satIndicator = 0;
          let wheelNumber;
          if (proc.flierNumber) {
            wheelNumber = proc.flierNumber;
          } else {
            wheelNumber = null;
          }
          if (proc.flierNumber == 0) wheelNumber = null;
          let expType = 'PAMA';
          if (type == 'PGR') expType = null;
          console.log(proc.flierNumber, wheelNumber);
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
          this.globalVarsService.updateSingleGlobal(
            'pIndicadorSat',
            satIndicator,
            this.globalVars
          );
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

  sendProcedureData(data: IProceduremanagement, type: string) {
    let proc = data;
    let satIndicator = null;
    if (type == 'SAT-MAS') satIndicator = 0;
    let wheelNumber;
    if (proc.flierNumber) {
      wheelNumber = proc.flierNumber;
    } else {
      wheelNumber = null;
    }
    if (proc.flierNumber == 0) wheelNumber = null;
    let expType = 'PAMA';
    if (type == 'PGR-MAS') expType = null;
    console.log(proc.flierNumber, wheelNumber);
    this.docsDataService.flyersRegistrationParams = {
      pIndicadorSat: satIndicator, // 0 / 1
      pGestOk: 1,
      pNoVolante: wheelNumber, //  !== null
      pNoTramite: proc.id,
      pSatTipoExp: expType, // != null
      noTransferente: null,
    };
    let uniqueKey = '10997';
    if (type == 'PGR-MAS') uniqueKey = '10006';
    if (type == 'SAT-MAS') uniqueKey = '12191';
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
      officeExternalDate: this.parseDatepickerFormat(new Date(proc.actualDate)),
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
    if (type == 'PGR-MAS' || type == 'SAT-MAS') {
      // this.tmpGestRegDocService.create(body).subscribe({
      //   next: () => {},
      //   error: () => {},
      // });
    }
    this.globalVarsService.updateSingleGlobal(
      'pIndicadorSat',
      satIndicator,
      this.globalVars
    );
    this.close();
    this.alert(
      'info',
      'Recordatorio',
      'Se le dirigirá a la pantalla de inicio, recuerde navegar de regreso a Registro de Volantes para ver cambios.'
    );
    this.router.navigateByUrl('/');
  }
}
