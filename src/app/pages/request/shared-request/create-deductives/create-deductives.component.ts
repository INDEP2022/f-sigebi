import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-deductives',
  templateUrl: './create-deductives.component.html',
  styles: [],
})
export class CreateDeductivesComponent implements OnInit {
  @Input() deductives: any[] = [];
  @Input() typeComponent: string = '';
  isReadOnly: boolean = false;

  constructor() {}

  ngOnInit(): void {
    console.log(this.typeComponent);
    console.log(this.deductives);
    this.setInputs();
  }

  setInputs() {
    if (this.typeComponent === 'revition-results') {
      this.isReadOnly = false;
    }
  }
}
