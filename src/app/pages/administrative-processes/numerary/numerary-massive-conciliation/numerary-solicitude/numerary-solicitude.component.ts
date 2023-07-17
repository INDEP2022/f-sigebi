import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { NumeraryService } from 'src/app/core/services/ms-numerary/numerary.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { columnsDetail, columnsProposal } from './columns';
import { BehaviorSubject } from 'rxjs';
import { FilterParams, ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-numerary-solicitude',
  templateUrl: './numerary-solicitude.component.html',
  styleUrls: [],
})
export class NumerarySolicitudeComponent extends BasePage implements OnInit {
  form: FormGroup;

  propouseData: LocalDataSource = new LocalDataSource();
  detailData: LocalDataSource = new LocalDataSource();

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;

  dataSelect:any

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
    private bsModel: BsModalRef,
  ) {
    super();
  }

  ngOnInit(): void {
    this.getProposalData()
  }

  private prepareForm() {
    this.form = this.fb.group({});
  }

  getProposalData() {
    this.numeraryService.getAllRequestNume().subscribe(
      res => {
        console.log(res);
        this.propouseData.load(res.data)
        this.totalItems = res.count
      },
      err => {
        console.log(err);
      }
    );
  }

  getDetailData(e:any){
    if(e != null){
        console.log(e)
        const paramsF = new FilterParams()
        paramsF.addFilter('applicationId',e.data.applicationId)
        this.numeraryService.getAllRequestNumMov(paramsF.getParams()).subscribe(
            res => {
                console.log(res)
                this.detailData.load(res.data)
                this.totalItems2 = res.count
            },
            err => {
                console.log(err)
            }
        )
    }
  }

  selectDetail(e:any){
    if(e != null){
        this.dataSelect = e.data
    }
  }

  applyButton(){
    if(this.dataSelect != null || this.dataSelect != undefined){
        this.bsModel.content.callback(this.dataSelect)
        this.bsModel.hide()
    }else{
        this.alert('warning','No seleccionó ningun detalle','')
    }
  }

  close() {
    this.bsModel.hide();
  }
}
