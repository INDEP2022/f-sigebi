import { DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, map, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ILegalAffair } from 'src/app/core/models/catalogs/legal-affair-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { LegalAffairService } from 'src/app/core/services/catalogs/legal-affair.service';
import { LegalTradesService } from 'src/app/core/services/legal-trades/legal-trades.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { DELEGATION_COLUMNS_REPORT } from '../../../../../app/pages/siab-web/commercialization/report-unsold-goods/report-unsold-goods/columns';
import { isNullOrEmpty } from '../../request-complementary-documentation/request-comp-doc-tasks/request-comp-doc-tasks.component';

@Component({
  selector: 'app-change-legal-status',
  templateUrl: './change-legal-status.component.html',
  styles: [],
})
export class ChangeLegalStatusComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  allotment: any;
  @Output() refresh = new EventEmitter<true>();

  @Output() delegtion = new EventEmitter<Object>();

  affairs = new DefaultSelect<ILegalAffair>();

  taxPayer: string = 'a';
  trans: string = 'a';
  detona: string = 'a';

  recDoc: any = null;
  numAparo = '1234';

  private legalService = inject(LegalAffairService);
  private affairService = inject(AffairService);
  private legalTradeService = inject(LegalTradesService);
  private serviceDelegations = inject(DelegationService);

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private readonly authService: AuthService
  ) {
    super();
    this.settingsTwo = {
      ...this.settings,
      selectMode: 'single',
      actions: false,
      columns: { ...DELEGATION_COLUMNS_REPORT },
    };
  }

  @Input() isDelegationsVisible: boolean = true;
  @Input() isJuridicVisible: boolean = true;

  @Input() requestId: number = null;
  @Input() docTypeId: string = null;

  isSelected: boolean = false;

  settingsTwo: any;
  dataThree: any[] = [];
  dataCheckDelegation: any[] = [];
  paramsDelegation = new BehaviorSubject<ListParams>(new ListParams());

  totalItemsDelegation: number = 0;

  private requestService = inject(RequestService);

  ngOnInit(): void {
    if (this.isJuridicVisible) {
      console.log('entra a juridico');
      this.getAllTrades();
      this.getRequestInfo();
    }

    if (this.isDelegationsVisible) {
      this.isJuridicVisible = false;
      console.log('entra a delegaciones');
      this.paramsDelegation
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(data => {
          console.log('entra a delegaciones 2' + data);
          this.getData(data);
        });
    }

    this.getAffair(new ListParams());
    this.prepareForm();
  }

  /*queryDelegation() {
    let params = {
      ...this.paramsDelegation.getValue(),
    };
    this.serviceDelegations.getAllTwo(params).subscribe({
      next: response => {
        if (Array.isArray(response.data)) {
          this.dataThree.load(response.data);
          this.totalItemsDelegation = response.count || 0;
          this.dataThree.refresh();
        }
      },
      error: error => (this.loading = false),
    });
  }*/

  getData(params: ListParams) {
    this.serviceDelegations.getAllTwo(params).subscribe({
      next: resp => {
        console.log('Respuesta del servidor:', resp); // Imprime la respuesta completa
        const result = resp.data.map(async (item: any) => {
          this.loading = false;
        });
        this.loading = true;

        Promise.all(result).then(data => {
          this.dataThree = resp.data;
          console.log('dataThree: ', this.dataThree);
          this.totalItemsDelegation = resp.count;
          setTimeout(() => {
            this.loading = false;
          }, 300);
        });
      },
    });
  }

  private prepareForm() {
    this.form = this.fb.group({
      dirCorporateLegal: [null, [Validators.required]],
      dirExecutiveLegal: [null, [Validators.required]],
      nameAddressee: [null, [Validators.required]],
      postAddressee: [null, [Validators.required]],
      affair: [null, [Validators.required]],
      fundamentals: [null, [Validators.required]],
      providedDate: [null, [Validators.required]],
      inchargeProvided: [null, [Validators.required]],
      statusSuspension: [null, [Validators.required]],
      signatureBySubstitution: [null],
    });
  }

  checkAcceptDelegations(event: any) {
    if (event.isSelected) {
      this.dataCheckDelegation.push(event);
    } else {
      this.dataCheckDelegation = this.removeRow(
        this.dataCheckDelegation,
        event,
        'id'
      );
    }
  }

  removeRow(array: any[], register: any, id: any) {
    console.log('El array aca abajo: ', array[0]?.data);
    return array.filter(item => item?.data[id] !== register?.data[id]);
  }

  close() {
    this.modalRef.hide();
  }

  getAffair(params: ListParams) {
    this.legalService.getAll(params).subscribe(
      data => {
        this.affairs = new DefaultSelect(data.data, data.count);
      },
      err => {
        let error = 'a';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.affairs = new DefaultSelect();

        //this.onLoadToast('error', 'Error', error);
      },
      () => { }
    );
  }

  getRequestInfo() {
    // Llamar servicio para obtener informacion de la documentacion de la solicitud
    const params = new ListParams();
    params['filter.id'] = `$eq:${this.requestId}`;
    this.requestService
      .getAll(params)
      .pipe(
        map(x => {
          return x.data[0];
        })
      )
      .subscribe({
        next: resp => {
          if (this.isDelegationsVisible) {
            this.recDoc = resp;
          }
          this.taxPayer = resp.indicatedTaxpayer;
          this.trans = resp.transferent.name;
          this.getDetona(resp.affair);
          this.numAparo = resp.protectNumber;
        },
      });
  }

  getDetona(id: string | number) {
    this.affairService.getByIdAndOrigin(id, 'SAMI').subscribe({
      next: data => {
        this.detona = data.processDetonate;
      },
    });
  }

  createLegalDoc(object: Object) {
    this.legalTradeService.createLegalTrades(object).subscribe({
      next: resp => {
        this.refresh.emit(true);
        this.modalRef.hide();
        this.onLoadToast('success', 'Oficio generado con éxito');
      },
      error: error => {
        this.onLoadToast('error', 'No se pudo generar el oficio');
      },
    });
  }

  updatedLegalDoc(object: ILegalAffair) {
    this.legalTradeService.updateLegalTrades(object).subscribe({
      next: resp => {
        this.refresh.emit(true);
        this.modalRef.hide();
        this.onLoadToast('success', 'Oficio actualizado con éxito');
      },
      error: error => {
        this.onLoadToast('error', 'No se pudo actualizar el oficio');
      },
    });
  }

  getAllTrades() {
    const params = new ListParams();
    params['filter.applicationId'] = `$eq:${this.requestId}`;
    this.legalTradeService
      .getAllLegalTrades(params)
      .pipe(
        map(x => {
          return x.data[0];
        })
      )
      .subscribe({
        next: resp => {
          this.recDoc = resp;
          resp['providedDate'] = moment(resp['providedDate']).format('DD/MM/YYYY')

          this.recDoc['affair'] = resp['affair']['affairId'].toString();

          this.recDoc.signatureBySubstitution =
            resp.signatureBySubstitution === '1';
          this.form.patchValue(this.recDoc);
        },
        error: error => {
          this.recDoc = null;
        },
      });
  }

  //Table

  save() {
    if (this.isJuridicVisible) {
      if (this.form.valid) {
        let object = this.form.getRawValue();

        object.signatureBySubstitution = object.signatureBySubstitution
          ? '1'
          : '0';

        object['applicationId'] = this.requestId;

        let splitId = this.getTime();

        const user: any = this.authService.decodeToken();

        object['creationUser'] = user.username;
        object['modificationDate'] = moment(new Date()).format('YYYY-MM-DD');
        object['modificationUser'] = user.username;
        object['creationDate'] = moment(new Date()).format('YYYY-MM-DD');
        object['version'] = 1;
        object['documentTypeId'] = this.docTypeId;

        if (isNullOrEmpty(this.recDoc)) {
          object['jobLegalId'] = splitId;
          this.createLegalDoc(object);
        } else {
          if (typeof object['providedDate'] === 'string') {
            let date = object['providedDate'].split('/');
            object['providedDate'] = date[2] + '-' + date[1] + '-' + date[0];
          }
          object['jobLegalId'] = this.recDoc['jobLegalId'];
          this.updatedLegalDoc(object);
        }
      }
    } else {
      if (!isNullOrEmpty(this.dataCheckDelegation)) {
        this.delegtion.emit(this.dataCheckDelegation[0].data);
        this.refresh.emit(true);
        this.modalRef.hide();
      } else {
        this.showWarning('Seleccione una delegación');
      }
    }
  }

  showWarning(text) {
    this.onLoadToast('warning', 'Advertencia', text);
  }

  onAffairChange(subdelegation: any) {
    //this.affairs = new DefaultSelect();
  }

  getTime(): string {
    const time: number = Date.now();
    const result: string = time.toString();
    return result.slice(-5);
  }
}
