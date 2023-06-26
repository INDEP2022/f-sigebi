import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, firstValueFrom, of, takeUntil } from 'rxjs';
import { map } from 'rxjs/operators';
import { Iidentifier } from 'src/app/core/models/ms-good-tracker/identifier.model';
import { ITmpTracker } from 'src/app/core/models/ms-good-tracker/tmpTracker.model';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { COLUMNS } from '../goods-management-social-table/columns';

@Component({
  selector: 'app-goods-management-social-cabinet',
  templateUrl: './goods-management-social-cabinet.component.html',
  styleUrls: ['./goods-management-social-cabinet.component.scss'],
})
export class GoodsManagementSocialCabinetComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  selectedGoodstxt: number[] = [];
  clearFlag = 0;
  identificator: number;
  constructor(
    private fb: FormBuilder,
    private goodTrackerService: GoodTrackerService
  ) {
    super();
    this.settings.columns = COLUMNS;
  }

  ngOnInit(): void {
    /*this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());*/
    this.prepareForm();
  }

  get option() {
    return this.form
      ? this.form.get('option')
        ? this.form.get('option').value
        : null
      : null;
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      option: [null, [Validators.required]],
      excuse: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      file: [null, [Validators.required]],
      //message: [null, [Validators.required]]
    });
  }

  showInfo() {}

  clear() {
    this.form.reset();
    this.clearFlag++;
  }

  private getSeqRastreador() {
    return this.goodTrackerService.getIdentifier().pipe(
      takeUntil(this.$unSubscribe),
      catchError(x => of(null as Iidentifier)),
      map(x => (x ? x.nextval : null))
    );
  }

  private saveInTemp(identificator: number, good: string) {
    const body: ITmpTracker = {
      identificator,
      goodNumber: +good,
    };
    this.goodTrackerService
      .createTmpTracker(body)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe();
  }

  async onFileChange(event: any) {
    const file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = async e => {
      const result = fileReader.result as string;
      const array = result.replace(',', '').split('\r\n'); // saltos de linea
      const newArray: number[] = [];
      console.log(array);
      if (array.length === 0) {
        return;
      }
      this.identificator = await firstValueFrom(this.getSeqRastreador());
      if (!this.identificator) {
        this.alert('error', 'Secuencia Rastreador', 'No encontrada');
        return;
      }
      array.forEach(row => {
        const array2 = row.split(' ');
        console.log(array2);
        array2.forEach(item => {
          if (item.length > 0 && !isNaN(+item)) {
            newArray.push(+item);
            this.saveInTemp(this.identificator, item);
          }
        });
      });
      this.selectedGoodstxt = [...newArray];
      console.log(this.selectedGoodstxt);
      // const filterParams = new FilterParams();
      // filterParams.addFilter(
      //   'goodNumber',
      //   this.selectedGoodstxt.toString(),
      //   SearchFilter.IN
      // );
      // const response = await firstValueFrom(
      //   this.goodTrackerService
      //     .getAll(filterParams.getParams())
      //     .pipe(catchError(x => of({ count: 0, data: [] })))
      // );
      // if (response.data.length === 0) {
      //   this.alert('error', 'Error', 'Bienes no encontrados');
      // } else {
      //   this.totalItems = response.count;
      //   this.data = response.data;
      // }
      // console.log(this.selectedGoodstxt);
      // console.log(response);
    };
    fileReader.readAsText(file);
  }

  delete(data: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }
}
