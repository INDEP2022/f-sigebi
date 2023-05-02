import { Component, Input, OnInit } from '@angular/core';
import { TreeViewService } from 'src/app/@standalone/tree-view/tree-view.service';
import { ITreeItem } from 'src/app/core/interfaces/menu.interface';

@Component({
  selector: 'app-partialized-tree-view',
  templateUrl: './partialized-tree-view.component.html',
  styles: [
    `
      .scroll-tree {
        height: 323px;
        overflow: auto;
      }

      .tree-loading {
        position: relative;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.2);
        background-image: url('../../../../../assets/images/loader-button.gif');
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100px 100px;
        z-index: 100;
        content: '';
        height: 323px;
      }

      .tree-description {
        margin-top: 10px;
        height: 137px;
        overflow: auto;
        border: 1px solid #b3b3b3;
        padding: 15px;
      }
    `,
  ],
})
export class PartializedTreeViewComponent implements OnInit {
  @Input() items: ITreeItem[] = [];
  @Input() loading: boolean = false;
  constructor(private treeViewService: TreeViewService) {}

  ngOnInit(): void {}

  get descriptionSelectedTree() {
    return this.treeViewService.selected
      ? this.treeViewService.selected.description
      : '';
  }
}
