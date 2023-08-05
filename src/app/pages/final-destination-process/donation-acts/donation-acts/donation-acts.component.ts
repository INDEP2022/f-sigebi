import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BehaviorSubject, filter, Observable, switchMap } from 'rxjs';
import { ExpedientService } from 'src/app/core/services/expedients/expedient.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ListParams } from './../../../../common/repository/interfaces/list-params';
import { COLUMNS1 } from './columns1';
import { COLUMNS2 } from './columns2';

@Component({
  selector: 'app-donation-acts',
  templateUrl: './donation-acts.component.html',
  styles: [],
})
export class DonationActsComponent extends BasePage implements OnInit {
  //

  actForm: FormGroup;
  formTable1: FormGroup;
  form: FormGroup;
  settings2: any;
  response: boolean = false;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  bsValueFromMonth: Date = new Date();
  minModeFromMonth: BsDatepickerViewMode = 'month';
  bsConfigFromMonth: Partial<BsDatepickerConfig>;
  bsValueFromYear: Date = new Date();
  minModeFromYear: BsDatepickerViewMode = 'year';
  bsConfigFromYear: Partial<BsDatepickerConfig>;
  noExpe: string = '';
  avPrevia: string = '';
  caPenal: string = '';
  noTranferente: string = '';
  tiExpe: string = '';
  columns: any[] = [];
  columns2: any[] = [];
  private numSubject: BehaviorSubject<number> = new BehaviorSubject<number>(
    null
  );
  num$: Observable<number> = this.numSubject.asObservable();
  datas: LocalDataSource = new LocalDataSource();
  data2: LocalDataSource = new LocalDataSource();

  //

  constructor(
    private fb: FormBuilder,
    private expedientService: ExpedientService,
    private serviceGood: GoodService,
    private serviceDetailProceeding: DetailProceeDelRecService,
    private datePipe: DatePipe,
    private cd: ChangeDetectorRef
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: COLUMNS1,
    };
    this.settings2 = { ...this.settings, actions: false, columns: COLUMNS2 };
  }

  ngOnInit(): void {
    this.initForm();
    // this.startCalendars();
  }

  //

  initForm() {
    this.form = this.fb.group({
      no_expediente: [],
      no_transferente: [],
      av_previa: [],
      ca_penal: [],
      ti_expediente: [],
    });

    this.actForm = this.fb.group({
      actSelect: [],
      status: [],
      trans: [],
      don: [],
      es_acta: [],
      cv_acta: [],
      observations: [],
      fec_elaboracion: [],
      nom_entrega: [],
      fec_don: [],
      nom_rec: [],
      dir: [],
      audit: [],
      fol_esc: [],
      tes_con: [],
    });
  }

  settingsChange(event: any, op: number) {
    op === 1 ? (this.settings = event) : (this.settings2 = event);
  }

  getAllBLKByFilters() {
    if (this.noExpe == '' || undefined || null) {
      this.form.reset();
    }
    let params = new HttpParams();
    if (this.noExpe != null) {
      params = params.append('filter.id', this.noExpe);
      this.expedientService.getExpeidentByFilters(params).subscribe({
        next: response => {
          this.form.controls['av_previa'].setValue(
            response.data[0].preliminaryInquiry
          );
          this.form.controls['no_transferente'].setValue(
            response.data[0].transferNumber
          );
          this.form.controls['ca_penal'].setValue(
            response.data[0].criminalCase
          );
          this.form.controls['ti_expediente'].setValue(
            response.data[0].expedientType
          );
        },
        error: error => {
          console.log('Esto arroja un error');
        },
      });

      let paramsGood = new HttpParams();
      paramsGood = paramsGood.append('filter.fileNumber', this.noExpe);
      this.serviceGood.getByFilter(paramsGood).subscribe({
        next: response => {
          this.columns = response.data;
          this.datas.load(this.columns);
          this.totalItems = response.count | 0;
          this.datas.refresh();
          this.loading = false;
        },
        error: error => {
          console.log('Esto arroja un error en el segundo');
        },
      });

      let paramsRecep = new HttpParams();
      paramsRecep = paramsRecep.append('filter.numFile', this.noExpe);
      this.serviceDetailProceeding.getGoodsByProceeding(paramsRecep).subscribe({
        next: response => {
          this.actForm.controls['actSelect'].setValue(
            response.data[0].keysProceedings
          );
          this.actForm.controls['status'].setValue(response.data[0].id);
          this.numSubject.next(response.data[0].id);
          // this.actForm.controls['trans'].setValue(response.data[0].numTransfer);
          this.actForm.controls['don'].setValue(response.data[0].receiptKey);
          this.actForm.controls['es_acta'].setValue(
            response.data[0].statusProceedings
          );
          this.actForm.controls['cv_acta'].setValue(
            response.data[0].keysProceedings
          );
          this.actForm.controls['observations'].setValue(
            response.data[0].observations
          );

          let elaborationDate = new Date(response.data[0].elaborationDate);
          let formattedDate = this.datePipe.transform(
            elaborationDate,
            'dd/MM/yyyy'
          );
          this.actForm.controls['fec_elaboracion'].setValue(formattedDate);
          this.actForm.controls['nom_entrega'].setValue(
            response.data[0].witness1
          );

          let elaborationDateTwo = new Date(response.data[0].elaborationDate);
          let formattedDateTwo = this.datePipe.transform(
            elaborationDateTwo,
            'dd/MM/yyyy'
          );
          this.actForm.controls['fec_don'].setValue(formattedDateTwo);

          this.actForm.controls['nom_rec'].setValue(response.data[0].witness2);
          this.actForm.controls['dir'].setValue(response.data[0].address);
          this.actForm.controls['audit'].setValue(response.data[0].responsible);
          this.actForm.controls['fol_esc'].setValue(
            response.data[0].universalFolio
          );
          this.actForm.controls['tes_con'].setValue(
            response.data[0].comptrollerWitness
          );
        },
        error: error => {
          console.log('Esto arroja un error el tercero');
        },
      });

      // Te suscribes al observable donde quieres reaccionar al cambio:
      this.num$
        .pipe(
          // Ignora los valores null
          filter(num => num !== null),
          // Usa el valor num para hacer la petición
          switchMap(num =>
            this.serviceDetailProceeding.getGoodsByProceedings(num)
          )
        )
        .subscribe({
          next: response => {
            this.columns2 = response.data;
            this.data2.load(this.columns2);
            this.totalItems2 = response.count | 0;
            this.data2.refresh();
            this.loading = false;
          },
          error: error => {
            console.log('Esto arroja un error el tercero');
          },
        });
    }
  }
}
