import { Component, Input, OnInit } from '@angular/core';
import { IGood } from 'src/app/core/models/good/good.model';

@Component({
  selector: 'app-good-table-vals',
  templateUrl: './good-table-vals.component.html',
  styleUrls: ['./good-table-vals.component.css'],
})
export class GoodTableValsComponent implements OnInit {
  @Input() good: IGood;
  constructor() {}

  ngOnInit() {}
}
