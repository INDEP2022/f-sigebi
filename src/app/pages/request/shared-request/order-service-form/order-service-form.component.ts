import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

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
export class OrderServiceFormComponent implements OnInit {
  showOrderservice: boolean = true;
  disableAllChecks: boolean = false;
  @Input() op: number;
  @Input() showForm: boolean;
  @Input() ordServform?: FormGroup = new FormGroup({});
  @Input() total: string = null;
  @Input() orderService: any = {};
  visitEye: boolean = false;
  consolideContainer: boolean = false;

  constructor() {}

  ngOnInit(): void {
    console.log('Data order', this.orderService);
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
