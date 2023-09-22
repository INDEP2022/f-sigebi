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
  readonly: boolean = false;
  visitEye: boolean = false;
  consolideContainer: boolean = false;

  orderService: any = {};

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    //this.prepareForm();
    this.readonly = this.op == 1 ? false : true;
  }

  ngOnChanges(changes: SimpleChanges): void {
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
