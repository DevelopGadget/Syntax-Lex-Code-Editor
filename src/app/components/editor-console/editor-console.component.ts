import { Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
@Component({
  selector: 'app-editor-console',
  templateUrl: './editor-console.component.html',
  styleUrls: ['./editor-console.component.scss']
})
export class EditorConsoleComponent implements OnInit {

  @ViewChild('console', { static: true }) consoleCode: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

}
