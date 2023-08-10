import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import {
  IRequesNum,
  IRequesNumMov,
} from 'src/app/core/models/ms-numerary/numerary.model';
import { NumeraryService } from 'src/app/core/services/ms-numerary/numerary.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { columnsDetail, columnsProposal } from './columns';

@Component({
  selector: 'app-numerary-solicitude',
  templateUrl: './numerary-solicitude.component.html',
  styleUrls: [],
})
export class NumerarySolicitudeComponent extends BasePage implements OnInit {
  form: FormGroup;
  form2: FormGroup;

  propouseData: LocalDataSource = new LocalDataSource();
  detailData: LocalDataSource = new LocalDataSource();

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  limit = new FormControl(10);
  limit2 = new FormControl(10);

  dataSelect: any;

  newProposal: boolean = false;
  newDetail: boolean = false;

  id: string = null;

  public override settings: any = {
    actions: false,
    hideSubHeader: true,
    columns: columnsProposal,
    noDataMessage: 'No se encontraron registros',
  };

  settings2 = {
    actions: false,
    hideSubHeader: true,
    columns: columnsDetail,
    noDataMessage: 'No se encontraron registros',
  };

  constructor(
    private fb: FormBuilder,
    private numeraryService: NumeraryService,
    private bsModel: BsModalRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.getProposalData();
    this.prepareForm();
    this.prepareForm2();

    //Paginador
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      console.log(params);
      this.limit = new FormControl(params.limit);
      this.getProposalData();
    });

    this.params2.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      console.log(params);
      this.limit2 = new FormControl(params.limit);
      this.getDetailDataPag(this.id);
    });
  }

  private prepareForm() {
    this.form = this.fb.group({
      deposit: [null],
      currency: [null],
    });
  }

  private prepareForm2() {
    this.form2 = this.fb.group({
      movement: [null],
      deposit: [null],
    });
  }

  getProposalData() {
    const paramsF = new FilterParams();
    paramsF.page = this.params.value.page;
    paramsF.limit = this.params.value.limit;
    this.numeraryService.getAllRequestNume(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        this.propouseData.load(res.data);
        this.totalItems = res.count;
      },
      err => {
        console.log(err);
      }
    );
  }

  getDetailDataPag(e: any) {
    if (e != null) {
      console.log(e);
      const paramsF = new FilterParams();
      paramsF.addFilter('applicationId', e);
      paramsF.page = this.params2.value.page;
      paramsF.limit = this.params2.value.limit;
      this.numeraryService.getAllRequestNumMov(paramsF.getParams()).subscribe(
        res => {
          console.log(res);
          this.detailData.load(res.data);
          this.totalItems2 = res.count;
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  getDetailData(e: any) {
    if (e != null) {
      console.log(e);
      this.id = e.data.applicationId;
      const paramsF = new FilterParams();
      paramsF.addFilter('applicationId', e.data.applicationId);
      paramsF.page = this.params2.value.page;
      paramsF.limit = this.params2.value.limit;
      this.numeraryService.getAllRequestNumMov(paramsF.getParams()).subscribe(
        res => {
          console.log(res);
          this.detailData.load(res.data);
          this.totalItems2 = res.count;
        },
        err => {
          console.log(err);
          this.detailData.load([]);
          this.totalItems2 = 0;
        }
      );
    }
  }

  selectDetail(e: any) {
    if (e != null) {
      this.dataSelect = e.data;
    }
  }

  applyButton() {
    if (this.dataSelect != null || this.dataSelect != undefined) {
      this.bsModel.content.callback(this.dataSelect);
      this.bsModel.hide();
    } else {
      this.alert('warning', 'No seleccionó ningun detalle', '');
    }
  }

  close() {
    this.bsModel.hide();
  }

  openNewProposal() {
    this.newProposal = true;
  }

  closeNewProposal() {
    this.newProposal = false;
  }

  newProposalFn() {
    this.loading = true;
    console.log(this.id);
    const model: IRequesNum = {
      deposit: this.form.get('deposit').value,
      relayTesofDate: null,
      currencyKey: this.form.get('currency').value,
    };

    this.numeraryService.createRequestNume(model).subscribe(
      res => {
        this.getProposalData();
        this.detailData.load([]);
        this.totalItems2 = 0;
        this.newProposal = false;
        this.loading = false;
        this.alert('success', 'Propuesta creada', '');
      },
      err => {
        this.loading = false;
        this.alert('error', 'Se presentó un error inesperado', '');
      }
    );
  }

  openNewDetail() {
    this.newDetail = true;
  }

  closeNewDetail() {
    this.newDetail = false;
  }

  newDetailFn() {
    console.log('Sí entra');
    console.log(this.id);

    if(this.id != null){
      const model: IRequesNumMov = {
        applicationId: parseInt(this.id),
        motionNumber: this.form2.get('movement').value,
        amountAssign: this.form2.get('deposit').value,
      };
  
      this.numeraryService.createRequestNumMov(model).subscribe(
        res => {
          const paramsF = new FilterParams();
          paramsF.addFilter('applicationId', this.id);
          this.numeraryService.getAllRequestNumMov(paramsF.getParams()).subscribe(
            res => {
              console.log(res);
              this.loading = false;
              this.detailData.load(res.data);
              this.totalItems2 = res.count;
              this.form2.get('movement').reset();
              this.form2.get('deposit').reset();
              this.newDetail = false;
              this.alert('success', 'Detalle creado', '');
            },
            err => {
              console.log(err);
            }
          );
        },
        err => {
          this.loading = false;
          console.log(err)
          console.log(err.error.message)
          if(err.error.message == 'duplicate key value violates unique constraint "nume_solicitud_movi_pk"'){
            this.alert('error',`El Movimiento ${this.form2.get('movement').value} ya ha sido Registrado`,'')
          }else{
            this.alert('error', 'Se presentó un error inesperado', '');
          }
        }
      );
    }else{
      this.alert('warning','No selecccionó Propuesta','')
    }

    
  }
}
