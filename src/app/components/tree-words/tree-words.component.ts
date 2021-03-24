import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { TreeWords, TreeWordsFlatNode } from 'src/app/utils/treeWords';

@Component({
  selector: 'app-tree-words',
  templateUrl: './tree-words.component.html',
  styleUrls: ['./tree-words.component.scss']
})
export class TreeWordsComponent implements OnInit {

  public TreeData: TreeWords[] = [];
  public match_regex = /(?<![\w\d])(declare|entero|cadena|logico|fecha|real|entonces|mq|finmq|para|finpara|haga|recibe|si|finsi|sino|function|Inicio|Fin|envia|recibe|llamar)(?![\w\d])/gm

  private _transformer = (node: TreeWords, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<TreeWordsFlatNode>(node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: TreeWordsFlatNode) => node.expandable;

  constructor() {

  }

  ngOnInit(): void {
  }

  matchedLine = (line: string, index: number) => {
    const matched = line.match(this.match_regex)
    if (matched) {
      this.TreeData.push({
        id: index,
        name: `${matched}`,
        children: [
          {
            id: 0,
            name: `Linea: ${index + 1}`
          }
        ]
      })
    }
  }

  groupMatched = () => {
    this.TreeData = this.TreeData.reduce((acc: TreeWords[], el: TreeWords) => {
      const index = acc.findIndex(item => item.name == el.name);
      if (index >= 0) {
        var childrens = acc[index].children;
        childrens = childrens.concat(el.children);
        acc[index].children = childrens;
      } else {
        acc.push(el);
      }
      return acc;
    }, []);

    this.dataSource.data = this.TreeData;
  }

}
