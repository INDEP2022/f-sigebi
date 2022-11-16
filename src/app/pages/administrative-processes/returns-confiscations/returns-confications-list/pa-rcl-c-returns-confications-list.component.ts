import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
//Provisional Data
import { goodsData } from './data';

@Component({
  selector: 'app-pa-rcl-c-returns-confications-list',
  templateUrl: './pa-rcl-c-returns-confications-list.component.html',
  styles: [],
})
export class PaRclCReturnsConficationsListComponent
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

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: { ...this.settings.actions, add: false, edit: true, delete: false },
      edit: {
        ...this.settings.edit,
        saveButtonContent: '<i class="bx bxs-save me-1 text-success mx-2"></i>',
        cancelButtonContent:
          '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
        confirmSave: true,
      },
      mode: '',
      rowClassFunction: (row: any) => {
        if (row.data.available) {
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
    this.data.load(goodsData);
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
      record: [null, [Validators.required]],
      preliminaryInquiry: [null, [Validators.required]],
      criminalCase: [null, [Validators.required]],
    });
    //Massive Application Form
    this.formMA = this.fb.group({
      dateConfiscation: [null],
      promoter: [null],
    });
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
    this.selectedRow = row;
    this.rowSelected = true;
  }

  onSaveConfirm(event: any) {
    //console.log(event);
    event.confirm.resolve();
    /**
     * Call Service
     * **/

    this.onLoadToast('success', 'Elemento Actualizado', '');
  }
}
