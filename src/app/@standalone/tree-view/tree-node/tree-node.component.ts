import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ITreeItem } from 'src/app/core/interfaces/menu.interface';
import { TreeViewService } from '../tree-view.service';

@Component({
  selector: 'app-tree-node',
  standalone: true,
  imports: [CommonModule, TreeNodeComponent],
  templateUrl: './tree-node.component.html',
  styles: [
    `
      ul {
        margin: 0 0 0 1em;
        padding: 0;
        list-style: none;
        position: relative;
        line-height: 2em;
        color: #369;
      }
      ul ul {
        margin-left: 0.5em;
      }
      ul:before {
        content: '';
        display: block;
        width: 0;
        position: absolute;
        top: 0;
        bottom: 14px;
        left: 0;
        border-left: 1px solid;
      }
      li {
        margin: 0;
        padding: 0 1em;
        line-height: 2em;
        color: #369;
        font-weight: 500;
        position: relative;
        i {
          cursor: pointer;
          margin-left: 5px;
        }
      }
      ul li:before {
        content: '';
        display: block;
        width: 10px;
        height: 0;
        border-top: 1px solid;
        margin-top: -1px;
        position: absolute;
        top: 1em;
        left: 0;
      }
      ul li:last-child:before {
        background: #fff;
        height: auto;
        top: 1em;
        bottom: 0;
      }
    `,
  ],
})
export class TreeNodeComponent implements OnInit {
  @Input() hasChild: boolean;
  @Input() menuChild: ITreeItem[];
  @Input() label: string = 'label';
  constructor(private service: TreeViewService) {}

  ngOnInit(): void {}

  hasItems(item: ITreeItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }

  selectItem(item: ITreeItem) {
    this.service.selected = item;
  }
}
