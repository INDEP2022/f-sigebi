import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, map } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ILegalAffair } from 'src/app/core/models/catalogs/legal-affair-model';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { LegalAffairService } from 'src/app/core/services/catalogs/legal-affair.service';
import { LegalTradesService } from 'src/app/core/services/legal-trades/legal-trades.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { DELEGATION_COLUMNS_REPORT } from '../../../../../app/pages/siab-web/commercialization/report-unsold-goods/report-unsold-goods/columns';

@Component({
  selector: 'app-change-legal-status',
  templateUrl: './change-legal-status.component.html',
  styles: [],
})
export class ChangeLegalStatusComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  allotment: any;
  @Output() refresh = new EventEmitter<true>();

  affairs = new DefaultSelect<ILegalAffair>();

  taxPayer: string = '';
  trans: string = '';
  detona: string = '';

  recDoc: Object = null;

  private legalService = inject(LegalAffairService);
  private affairService = inject(AffairService);
  private legalTradeService = inject(LegalTradesService);

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {
    super();
    this.settingsTwo = {
      ...this.settings,
      selectMode: 'multi',
      actions: false,
      columns: { ...DELEGATION_COLUMNS_REPORT },
    };
  }

  @Input() isDelegationsVisible: boolean = true;
  @Input() requestId: number = null;

  isJuridicVisible: boolean = true;
  isSelected: boolean = false;

  settingsTwo: any;
  dataThree: LocalDataSource = new LocalDataSource();
  dataCheckDelegation: any[] = [];
  paramsDelegation = new BehaviorSubject(new ListParams());
  totalItemsDelegation: number = 0;

  private requestService = inject(RequestService);

  ngOnInit(): void {
    this.getRequestInfo();
    if (this.isDelegationsVisible) {
      this.isJuridicVisible = false;
    }

    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      corporate: [null, [Validators.required]],
      executive: [null, [Validators.required]],
      receiver: [null, [Validators.required]],
      position: [null, [Validators.required]],
      affair: [null, [Validators.required]],
      protection: [null, [Validators.required]],
      justify: [null, [Validators.required]],
      dateProvide: [null, [Validators.required]],
      orderProvide: [null, [Validators.required]],
      status: [null, [Validators.required]],
      signed: [null],
    });
    if (this.allotment != null) {
      console.log(this.allotment);
      this.form.patchValue(this.allotment);
    }
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
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error);
      },
      () => {}
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
          this.recDoc = resp;
          console.log(resp.indicatedTaxpayer);
          this.taxPayer = resp.indicatedTaxpayer;
          this.trans = resp.transferent.name;
          this.getDetona(resp.affair);
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
        this.getRequestInfo();
        this.onLoadToast('success', 'Oficio generado con éxito');
      },
      error: error => {
        this.onLoadToast('error', 'No se pudo generar el oficio');
      },
    });
  }

  save() {
    let object = this.form.getRawValue();
    this.createLegalDoc(object);
  }

  onAffairChange(subdelegation: any) {
    this.affairs = new DefaultSelect();
  }
}
