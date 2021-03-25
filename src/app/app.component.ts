import { Component, Renderer2, ViewChild } from '@angular/core';
import { EditorConsoleComponent } from './components/editor-console/editor-console.component';
import { EditorTypingComponent } from './components/editor-typing/editor-typing.component';
import { TreeWordsComponent } from './components/tree-words/tree-words.component';
import { VariableUtil } from './utils/variableUtil';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild(EditorTypingComponent, { static: false })
  monacoComponent: EditorTypingComponent;


  @ViewChild(EditorConsoleComponent, { static: false })
  consoleComponent: EditorConsoleComponent;

  @ViewChild(TreeWordsComponent, { static: false })
  treeComponent: TreeWordsComponent;

  variableDefinitions: VariableUtil;

  public makers: any[] = [];

  constructor(private renderer: Renderer2) {
    this.variableDefinitions = VariableUtil.Instance(this.createSpan, this.setModelMaker, this.getModelMaker);
  }

  buildText() {
    if (this.monacoComponent.code) {
      for (let child of this.consoleComponent.consoleCode.nativeElement.children) {
        this.renderer.removeChild(this.consoleComponent.consoleCode.nativeElement, child);
      }
      this.makers = [];
      monaco.editor.setModelMarkers(this.monacoComponent.getModel(), 'test', []);
      this.treeComponent.TreeData = [];
      this.treeComponent.groupMatched();
      const lines = this.monacoComponent.code.split('\n');
      if (!/\b(Inicio)\b/.test(this.monacoComponent.code)) this.createSpan('color-red', '[fecha] El código no contiene la sentencia de "Inicio" ');
      if (!/\b(Fin)\b/.test(this.monacoComponent.code)) this.createSpan('color-red', '[fecha] El código no contiene la sentencia de "Fin" ');
      for (let index = 0; index < lines.length; index++) {
        this.treeComponent.matchedLine(lines[index], index);
        this.validateLine(lines[index], index);
      }
      this.treeComponent.groupMatched();
      monaco.editor.setModelMarkers(this.monacoComponent.getModel(), 'test', this.makers);
    }
  }

  validateLine(line: string, index: number) {
    line = line.replace(/^(\s*)#(.*)$/, '');
    if (line.toString().trim() !== '') {
      const splited = line.toString().split(' ').filter(tes => tes.trim() !== '');
      if(/^(entero|cadena|logico|fecha|real|entonces)$/) {
        this.createSpan('color-red', '[fecha] sentencia no valida');
        this.setModelMaker(this.getModelMaker(index + 1, 'sentencia no valida'));
      }
      switch (splited[0]) {
        case 'declare':
          this.variableDefinitions.validateVariable(line, index);
          break;
      }
    } else {
      this.createSpan('color-omited', '[fecha] Se omite la linea ' + (index + 1));
    }
  }

  createSpan = (color: string = 'color-blue', text: string): void => {
    const span: HTMLSpanElement = this.renderer.createElement('span');
    span.className = color + ' span-pre';
    text = text.replace('[fecha] ', `[${(new Date()).toLocaleString()}]`)
    span.innerHTML = text;
    this.renderer.appendChild(this.consoleComponent.consoleCode.nativeElement, span);
  }

  getModelMaker = (index: number, message: string) => {
    return {
      startLineNumber: index,
      startColumn: 1,
      endLineNumber: index,
      endColumn: 1000,
      message: message,
      severity: monaco.MarkerSeverity.Error
    };
  };

  setModelMaker = (maker: any) => this.makers.push(maker);

}
