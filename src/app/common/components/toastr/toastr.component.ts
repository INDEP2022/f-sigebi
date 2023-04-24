import { Component } from '@angular/core';
import { Toast, ToastPackage, ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-toastr',
  templateUrl: './toastr.component.html',
  styles: [``],
  animations: [],
  preserveWhitespaces: false,
})
export class ToastrComponent extends Toast {
  undoString = 'undo';
  constructor(toastrService: ToastrService, toastPackage: ToastPackage) {
    super(toastrService, toastPackage);
  }

  ngOnInit(): void {}

  action(event: Event) {
    event.stopPropagation();
    this.undoString = 'undid';
    this.toastPackage.triggerAction();
    return false;
  }
}
