import { Component, Input, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import {
  IProccesNum,
  IRequestNumeraryEnc,
} from 'src/app/core/models/ms-numerary/numerary.model';
import { NumeraryService } from 'src/app/core/services/ms-numerary/numerary.service';
import { BasePage } from 'src/app/core/shared';
import { ProcessService } from '../process.service';
import { clearGoodCheck, goodCheck, REQUESTS_COLUMNS_MODAL } from './columns';

@Component({
  selector: 'app-modal-request',
  templateUrl: './modal-request.component.html',
  styles: [],
})
export class ModalRequestComponent extends BasePage implements OnInit {
  data1: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  @Input() process: IProccesNum;
  @Input() userAuth: string;
  @Input() type: string;
  requestNumeEnc: IRequestNumeraryEnc;
  columnFilters: any = [];

  constructor(
    private modalRef: BsModalRef,
    private readonly numeraryService: NumeraryService,
    private readonly processService: ProcessService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: REQUESTS_COLUMNS_MODAL,
    };
    this.settings.hideSubHeader = false;
  }

  ngOnInit(): void {
    this.data1
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'solnumId':
                searchFilter = SearchFilter.EQ;
                break;
              case 'solnumDate':
                if (filter.search != null) {
                  filter.search = this.returnParseDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
              this.params.value.page = 1;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getRequestNumeEnc();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getRequestNumeEnc());
  }

  onChangeSelect(event: IRequestNumeraryEnc) {
    console.log(event);
    this.requestNumeEnc = event;
  }

  getRequestNumeEnc() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.numeraryService.getNumeraryRequestNumeEnc(params).subscribe({
      next: resp => {
        console.log(resp.data);
        //this.data1 = resp.data;
        this.data1.load(resp.data);
        this.data1.refresh();
        this.totalItems = resp.count;
        this.loading = false;
      },
      error: err => {
        this.data1.load([]);
        this.data1.refresh();
        this.loading = false;
      },
    });
  }

  close() {
    clearGoodCheck();
    this.modalRef.hide();
  }

  handleSuccess() {
    const message: string = 'Guardado';
    this.alert('success', 'Registro de inventario', `${message} correctamente`);
    this.loading = false;
    this.modalRef.content.callback(goodCheck);
    clearGoodCheck();
    this.modalRef.hide();
  }

  async confirm() {
    if (this.process === undefined || this.process === null) {
      const resp = await this.alertQuestion(
        'question',
        '¿Desea continuar?',
        'Se generará un nuevo proceso'
      );
      if (resp.isConfirmed) {
        /// se genera el pre Inset
        this.process = await this.processService.createProccesNum(
          this.userAuth,
          this.type
        );
        console.log('SE CREO EL POCESO');
      } else {
        clearGoodCheck();
        this.modalRef.hide();
        return;
      }
    } else {
      const resp = await this.alertQuestion(
        'question',
        '¿Desea continuar?',
        'Se adicionará la solicitud al proceso'
      );
      if (!resp.isConfirmed) {
        clearGoodCheck();
        this.modalRef.hide();
        return;
      }
    }

    if (this.process) {
      /// AGREGARLE ESTO AL REGISTER DEL REGISTRO
      // :SOLICITUDES_NUME_ENC1.ID_PROCNUM := :PROCESOS_NUME.ID_PROCNUM;
      // :SOLICITUDES_NUME_ENC1.ESTATUS_SOLNUM := 'P';
      // Y GUARDAR ESTO
      this.requestNumeEnc.procnumId = this.process.procnumId;
      this.requestNumeEnc.solnumStatus = 'P';
      const resp: IRequestNumeraryEnc =
        await this.updateNumeraryRequestNumeEnc();
      this.requestNumeEnc = resp;
      console.log(resp);
      this.modalRef.content.callback([this.requestNumeEnc]);
      this.modalRef.hide();
    } else {
      this.alert(
        'warning',
        'Cálculo de numerario',
        'No se identificó el proceso.'
      );
      this.modalRef.hide();
    }
  }

  updateNumeraryRequestNumeEnc() {
    return new Promise<IRequestNumeraryEnc>((res, _rej) => {
      const model: IRequestNumeraryEnc = {
        delegationNumber: this.requestNumeEnc.delegationNumber,
        description: this.requestNumeEnc.description,
        procnumId: this.requestNumeEnc.procnumId,
        solnumDate: this.requestNumeEnc.solnumDate,
        solnumStatus: this.requestNumeEnc.solnumStatus,
        solnumType: this.requestNumeEnc.solnumType,
        user: this.requestNumeEnc.user,
        solnumId: this.requestNumeEnc.solnumId,
      };
      this.numeraryService.updateNumeraryRequestNumeEnc(model).subscribe({
        next: response => {
          res(response);
        },
        error: err => {
          res(null);
        },
      });
    });
  }
}
