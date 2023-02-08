import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IDetailProceedingsDevolution } from 'src/app/core/models/ms-proceedings/detail-proceedings-devolution.model';
import { IProceedings } from 'src/app/core/models/ms-proceedings/proceedings.model';
import { DetailProceedingsDevolutionService } from 'src/app/core/services/ms-proceedings/detail-proceedings-devolution';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings/proceedings.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { IUpdateProceedings } from './../../../../core/models/ms-proceedings/update-proceedings.model';
import { CLOSING_RECORDS_COLUMNS } from './closing-records-columns';

@Component({
  selector: 'app-closing-records',
  templateUrl: './closing-records.component.html',
  styles: [],
})
export class ClosingRecordsComponent extends BasePage implements OnInit {
  form: FormGroup;
  statusAct: string = 'ABIERTA';
  flag: boolean = false;
  record: IUpdateProceedings;
  dataResp: IProceedings;
  dataTable: any[] = [];
  proceedingsNumb: number;
  proceedingsCve: string;
  private route: Router;

  constructor(
    private fb: FormBuilder,
    private proceedingsService: ProceedingsService,
    private detailProceedingsDevolutionService: DetailProceedingsDevolutionService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: CLOSING_RECORDS_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  search(fileNumber: string) {
    this.getInfo(parseInt(fileNumber));
  }

  getInfo(fileNumber: number) {
    this.flag = false;
    this.proceedingsService
      .getActByFileNumber(fileNumber)
      .pipe(
        switchMap((proceedings: IListResponse<IProceedings>) =>
          this.detailProceedingsDevolutionService
            .getDetailProceedingsDevolutionByExpedient(fileNumber)
            .pipe(
              map((goods: any) => ({
                proceedings,
                goods,
              }))
            )
        )
      )
      .subscribe({
        next: data => {
          this.prepareData(data);
        },
        error: error => {
          console.log(error);
        },
      });
  }

  prepareData(data: {
    proceedings: IListResponse<IProceedings>;
    goods: IListResponse<IDetailProceedingsDevolution>;
  }) {
    let goodsData: any[] = [];
    this.dataResp = data.proceedings.data[0];
    this.statusAct = 'ABIERTA';
    // this.statusAct = this.dataResp.proceedingStatus;          //DESCOMENTAR ESTO
    this.proceedingsNumb = data.proceedings.data[0].id;
    this.proceedingsCve = data.proceedings.data[0].proceedingsCve;
    let dataForm = {
      previewFind: this.dataResp.fileNumber.previewFind,
      penaltyCause: this.dataResp.fileNumber.penaltyCause,
      elaborationDate: this.convertDate(this.dataResp.elaborationDate),
      authorityOrder: this.dataResp.authorityOrder,
      proceedingsType: this.dataResp.proceedingsType,
      universalFolio: this.dataResp.universalFolio,
      observations: this.dataResp.observations,
    };
    for (let good of data.goods.data) {
      let data: any = {
        goodsId: good.good[0].goodsID,
        description: good.good[0].description,
        quantity: good.good[0].quantity,
        amountReturned: good.amountReturned,
      };
      goodsData.push(data);
    }
    this.form.patchValue(dataForm);
    this.dataTable = goodsData;
    this.flag = true;
  }

  enableDisableFields(option: string) {
    //habilitar / deshabilitar formulario
    Object.keys(this.form.controls).forEach(key => {
      if (option === 'CERRADA') this.form.controls[key].disable();
      else this.form.controls[key].enable();
    });
  }

  convertDate(date: Date) {
    return new Date(date).toLocaleDateString().toString();
  }

  goToProceedingsValidations() {
    this.route.navigate(['./records-validation']);
  }

  update() {
    this.buildObjectToUpdate();
  }

  close() {}

  //se construye el objeto necesario para actualizar el acta
  buildObjectToUpdate() {
    let dataToUpdate: any = {};
    for (let key in this.dataResp) {
      if (key == 'transferNumber') {
        dataToUpdate[key] = this.dataResp[key].id;
      } else {
        if (key == 'fileNumber') {
          dataToUpdate[key] = this.dataResp[key].filesId;
        } else {
          if (key != 'delegationNumber')
            dataToUpdate[key] = this.dataResp[key as keyof IProceedings];
        }
      }
    }
    this.copyFormValues(dataToUpdate);
    console.log(dataToUpdate);
    this.proceedingsService
      .update(dataToUpdate.id, dataToUpdate)
      .subscribe((resp: IListResponse<IProceedings>) => {
        console.log(resp);
      });
  }

  copyFormValues(dataToUpdate: IUpdateProceedings) {
    dataToUpdate.proceedingsCve = this.form.value.proceedingsCve;
    dataToUpdate.observations = this.form.value.observations;
    dataToUpdate.authorityOrder = this.form.value.authorityOrder;
    dataToUpdate.universalFolio = this.form.value.universalFolio;
  }

  prepareForm() {
    this.form = this.fb.group({
      proceedingsCve: [null, [Validators.required]],
      previewFind: [null, [Validators.required]],
      penaltyCause: [null, []],
      proceedingsType: [null, [Validators.required]],
      elaborationDate: [null, [Validators.required]],
      authorityOrder: [null, [Validators.required]],
      universalFolio: [null, [Validators.required]],
      observations: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }
}
