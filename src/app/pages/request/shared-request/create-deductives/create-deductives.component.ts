import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-deductives',
  templateUrl: './create-deductives.component.html',
  styles: [],
})
export class CreateDeductivesComponent implements OnInit {
  @Input() deductives: any[] = [];
  constructor() {}

  ngOnInit(): void {
    console.log(this.deductives);
  }
}
