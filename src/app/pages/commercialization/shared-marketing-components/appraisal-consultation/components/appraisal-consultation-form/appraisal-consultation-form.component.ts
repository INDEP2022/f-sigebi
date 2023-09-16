import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { BasePage } from 'src/app/core/shared';
import {
  ApppraisalConsultationSumForm,
  AppraisalConsultationForm,
} from '../../utils/appraisal-consultation-form';

const ALLOWED_EXTENSIONS = ['txt'];

@Component({
  selector: 'appraisal-consultation-form',
  templateUrl: './appraisal-consultation-form.component.html',
  styles: [],
})
export class AppraisalConsultationFormComponent
  extends BasePage
  implements OnInit
{
  @Input() form: FormGroup<AppraisalConsultationForm>;
  @Input() $search: Subject<void>;
  @Input() sumForm: FormGroup<ApppraisalConsultationSumForm>;
  @ViewChild('goodsInput', { static: true })
  goodsInput: ElementRef<HTMLInputElement>;
  goodsControl = new FormControl(null);

  constructor() {
    super();
  }

  ngOnInit(): void {}

  cleanForm() {
    this.form.reset();
    this.$search.next();
  }

  isValidFile(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target.files.length) {
      return false;
    }
    if (target.files.length > 1) {
      this.alert('error', 'Error', 'Solo puede seleccionar un Archivo');
      return false;
    }
    const file = target.files[0];
    const filename = file.name;
    const extension = filename.split('.').at(-1);
    if (!extension) {
      this.alert('error', 'Error', 'Archivo Inválido');
      return false;
    }
    if (!ALLOWED_EXTENSIONS.includes(extension.toLowerCase())) {
      this.alert('error', 'Error', 'Archivo Inválido');
      return false;
    }
    return true;
  }

  private getFileFromEvent(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files[0];
    return file;
  }

  invFileChange(event: Event) {
    if (!this.isValidFile(event)) {
      this.goodsControl.reset();
      return;
    }
    const file = this.getFileFromEvent(event);
    const fileReader = new FileReader();
    fileReader.onload = e => {
      this.readTxtInv(e.target.result);
    };
    this.goodsControl.reset();
    fileReader.readAsText(file);
  }

  readTxtInv(txt: string | ArrayBuffer) {
    if (typeof txt != 'string') {
      this.alert('error', 'Error', 'Archivo Inválido');
      return;
    }
    const goodNumbersArrPlain = txt.split(',');

    const goodNumbers = goodNumbersArrPlain.map(goodNum => goodNum.trim());
    if (!goodNumbers.length) {
      this.alert(
        'error',
        'Error',
        'El Archivo esta vació o tiene elementos inválidos'
      );
      return;
    }

    this.form.controls.noGood.setValue(goodNumbers);
  }

  search() {
    if (!this.hasFilters()) {
      this.alert('warning', 'Debe ingresar un parámetro de búsqueda', '');
      return;
    }
    this.$search.next();
  }

  hasFilters() {
    const formValue: any = this.form.value;
    const filled = Object.keys(formValue).filter(
      key => formValue[key]?.length > 0
    );
    return filled.length;
  }
}
