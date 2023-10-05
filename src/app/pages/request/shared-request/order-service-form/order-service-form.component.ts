import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-order-service-form',
  templateUrl: './order-service-form.component.html',
  styles: [
    `
      a.text-color:hover,
      a.text-color:active {
        color: #9d2449;
        cursor: pointer;
      }
    `,
  ],
})
export class OrderServiceFormComponent implements OnInit, OnChanges {
  showOrderservice: boolean = true;
  disableAllChecks: boolean = false;
  @Input() op: number;
  @Input() showForm: boolean;
  @Input() ordServform?: FormGroup = new FormGroup({});
  @Input() total: string = null;
  readonly: boolean = true;
  visitEye: boolean = false;
  consolideContainer: boolean = false;

  orderService: any = {};

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    //this.prepareForm();
    this.formReadOnly();
  }

  formReadOnly() {
    if (this.op == 9) {
      this.readonly = false;
    }
    /*this.readonly = this.op == 1 ? false : true;
    this.readonly = this.op == 9 ? false : true; */
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.showForm == true) {
      this.readonly = false;
    }

    if (
      (this.showForm == true && this.op == 2) ||
      (this.showForm == true && this.op == 3) ||
      (this.showForm == true && this.op == 4) ||
      (this.showForm == true && this.op == 5) ||
      (this.showForm == true && this.op == 6) ||
      (this.showForm == true && this.op == 7) ||
      (this.showForm == true && this.op == 8)
    )
      this.readonly = true;
    this.orderService = this.ordServform.getRawValue();

    this.visitEye = this.orderService.eyeVisit == 'Y' ? true : false;
    this.consolideContainer =
      this.orderService.userContainers == 'Y' ? true : false;
  }

  changeVisitEye(event: any) {
    if (event.target.checked == true) {
      this.ordServform.controls['eyeVisit'].setValue('Y');
    } else {
      this.ordServform.controls['eyeVisit'].setValue('N');
    }
  }

  changeConsolidate(event: any) {
    if (event.target.checked == true) {
      this.ordServform.controls['userContainers'].setValue('Y');
    } else {
      this.ordServform.controls['userContainers'].setValue('N');
    }
  }
}
