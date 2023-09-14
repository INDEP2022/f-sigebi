import { Component, Input, OnInit } from '@angular/core';
import { format } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import {
  IMassiveReqNumEnc,
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
  process: string;
  @Input() userAuth: string;
  type: string;
  typeMoney: string;
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
    console.log(this.process);
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

  onChangeSelect(event: any) {
    console.log(event);
    this.requestNumeEnc = {
      solnumId: event.solnumid,
      delegationNumber: event.delegationnumber,
      description: event.description,
      procnumId: event.procnumId,
      solnumDate: event.solnumdate,
      solnumStatus: event.solnumstatus,
      solnumType: event.solnumtype,
      user: event.user,
    };
  }

  getRequestNumeEnc() {
    const paramsF = new FilterParams();
    paramsF.addFilter('tCoin', this.typeMoney);
    paramsF.addFilter('solNumType', this.type);
    console.log(this.columnFilters);
    this.numeraryService.reqNumEnc(paramsF.getParams()).subscribe({
      next: resp => {
        console.log(resp);
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

  async confirm() {
    if (this.process === undefined || this.process === null) {
      const resp = await this.alertQuestion(
        'question',
        '¿Desea continuar?',
        'Se generará un nuevo proceso'
      );
      if (resp.isConfirmed) {
        /// se genera el pre Inset
        const model: IProccesNum = {
          procnumDate: format(new Date(), 'yyyy-MM-dd'),
          description: null,
          user:
            localStorage.getItem('username') == 'sigebiadmon'
              ? localStorage.getItem('username')
              : localStorage.getItem('username').toLocaleUpperCase(),
          procnumType: this.type,
          interestAll: 0,
          numeraryAll: 0,
        };

        this.numeraryService.createProccesNum(model).subscribe(
          res => {
            this.process = JSON.parse(JSON.stringify(res)).procnumId;

            const arraySolId = goodCheck.map((e: any) => {
              return e.id_solnum;
            });

            const model: IMassiveReqNumEnc = {
              solnumId: arraySolId,
              procnumId: this.process,
            };

            this.numeraryService.updateMasiveReqNumEnc(model).subscribe(
              res => {
                this.alert('success', 'Se agregó la Solicitud al Proceso', '');
                this.modalRef.content.callback(this.process);
                this.modalRef.hide();
                console.log('SE CREO EL PROCESO');
              },
              err => {
                this.alert(
                  'error',
                  'Se presentó un Error al agregar la Solicitud al Proceso',
                  ''
                );
                console.log(err);
              }
            );
          },
          err => {
            this.alert(
              'error',
              'Se presentó un Error Inesperado',
              'No se creó el Proceso, intentelo nuevamente'
            );
          }
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
      } else {
        const arraySolId = goodCheck.map((e: any) => {
          return e.id_solnum;
        });

        const model: IMassiveReqNumEnc = {
          solnumId: arraySolId,
          procnumId: this.process,
        };

        this.numeraryService.updateMasiveReqNumEnc(model).subscribe(
          res => {
            this.alert('success', 'Se agregó la Solicitud al Proceso', '');
            this.modalRef.content.callback(this.process);
            this.modalRef.hide();
            console.log('SE ACTUALIZO EL PROCESO');
          },
          err => {
            this.alert(
              'error',
              'Se presentó un Error al agregar la Solicitud al Proceso',
              ''
            );
            console.log(err);
          }
        );
      }
    }
  }
}
