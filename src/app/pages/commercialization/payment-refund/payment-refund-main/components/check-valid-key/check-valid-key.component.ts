import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ViewCell } from 'ng2-smart-table';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-check-valid-key',
  templateUrl: './check-valid-key.component.html',
  styles: [],
})
export class CheckValidKeyComponent
  extends BasePage
  implements ViewCell, OnInit, AfterViewInit
{
  checkForm: FormGroup = new FormGroup({});
  checkState: boolean = false;
  checkbox: any;
  checkId: string = 'checkbox';
  @Input() value: string | number;
  @Input() rowData: any;

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.checkId = this.checkId + this.rowData.id.toString();
  }

  ngAfterViewInit(): void {
    this.changeState();
  }

  private prepareForm(): void {
    this.checkForm = this.fb.group({
      type: [''],
    });
  }

  changeState() {
    this.checkbox = document.querySelector(
      '#' + this.checkId
    ) as HTMLInputElement;
    if (this.value == 'true') {
      this.checkState = true;
      this.checkbox.checked = this.checkState;
    } else {
      this.checkState = false;
      this.checkbox.checked = this.checkState;
    }
  }

  change(event: Event) {
    this.checkbox.checked = this.checkState;
  }
}
