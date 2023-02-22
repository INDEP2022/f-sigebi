import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { COLUMNS } from './columns';
//Models
import { IGood } from 'src/app/core/models/ms-good/good';
//Services
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
//Provisional Data
import { goodsData } from './data';

@Component({
  selector: 'app-returns-confications-list',
  templateUrl: './returns-confications-list.component.html',
  styles: [],
})
export class ReturnsConficationsListComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  formMA: FormGroup = new FormGroup({});

  data: LocalDataSource = new LocalDataSource();
  goodsD = goodsData;

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  rowSelected: boolean = false;
  selectedRow: any = null;

  //Columns
  columns = COLUMNS;

  constructor(
    private datePipe: DatePipe,
    private goodService: GoodService,
    private expedientService: ExpedientService,
    private fb: FormBuilder
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        ...this.settings.actions,
        add: false,
        edit: true,
        delete: false,
      },
      edit: {
        ...this.settings.edit,
        saveButtonContent: '<i class="bx bxs-save me-1 text-success mx-2"></i>',
        cancelButtonContent:
          '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
        confirmSave: true,
      },
      mode: '',
      rowClassFunction: (row: any) => {
        if (row.data.estatus.active === '1') {
          return 'text-success';
        } else {
          return 'text-danger';
        }
      },
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    //this.data.load(goodsData);
    /**
     * Instance renderComponent
     **/
    /*this.columns.dateConfiscation.editor={
      ...this.columns.dateConfiscation.editor,
      onComponentInitFunction: (instance: any) => {
        instance.toggle.subscribe((data: any) => {
          alert(data)
           //this.otherFn(data);
        });
      }
    }*/
  }

  private prepareForm(): void {
    //Form
    this.form = this.fb.group({
      idExpedient: [null, [Validators.required]],
      preliminaryInquiry: [
        { value: null, disabled: true },
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      criminalCase: [
        { value: null, disabled: true },
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      identifies: [{ value: null, disabled: true }],
      noCourt: [{ value: null, disabled: true }],
    });
    //Massive Application Form
    this.formMA = this.fb.group({
      dateConfiscation: [null],
      promoter: [null],
    });
  }

  getExpedientById(): void {
    let _id = this.form.controls['idExpedient'].value;
    this.loading = true;
    this.expedientService.getById(_id).subscribe(
      response => {
        console.log(response);
        //TODO: Validate Response
        if (response !== null) {
          this.form.patchValue(response);
          this.form.updateValueAndValidity();
          this.getGoodsByExpedient(response.id);
        } else {
          //TODO: CHECK MESSAGE
          this.alert('info', 'No se encontrarón registros', '');
        }

        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  getGoodsByExpedient(id: string | number): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoods(id));
  }

  getGoods(id: string | number): void {
    this.goodService.getByExpedient(id, this.params.getValue()).subscribe(
      response => {
        //console.log(response);
        let data = response.data.map((item: IGood) => {
          //console.log(item);
          item.promoter = item.userPromoterDecoDevo?.id;

          let dateDecoDev = item.scheduledDateDecoDev;
          item.dateRenderDecoDev = this.datePipe.transform(
            dateDecoDev,
            'yyyy-MM-dd'
          );

          let dateTeso = item.tesofeDate;
          item.tesofeDate = this.datePipe.transform(dateTeso, 'yyyy-MM-dd');
          return item;
        });
        this.data.load(data);
        this.totalItems = response.count;
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  massiveApplication(): void {
    let maVal = this.formMA.value;
    this.alertQuestion(
      'warning',
      'Actualización Masiva',
      'Desea actualizar todos los bienes?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        if (maVal.dateConfiscation !== null) {
          goodsData.map(good => {
            let date = `${maVal.dateConfiscation.getFullYear()}-
                ${maVal.dateConfiscation.getMonth() + 1}-
                ${maVal.dateConfiscation.getDate()}`;

            good.dateConfiscation = date;
          });
          //Update Table
          this.data.refresh();
        }

        if (maVal.promoter !== null) {
          goodsData.map(good => {
            good.promoter = maVal.promoter;
          });
          //Update Table
          this.data.refresh();
        }

        this.onLoadToast('success', 'Elementos Actualizados', '');
      }
    });
  }

  selectRow(row: any) {
    console.log(row);
    this.selectedRow = row;
    this.rowSelected = true;
  }

  onSaveConfirm(event: any) {
    console.log(event);
    event.confirm.resolve();
    //this.goodService.update()
    /**
     * Call Service
     * **/

    this.onLoadToast('success', 'Elemento Actualizado', '');
  }
}
