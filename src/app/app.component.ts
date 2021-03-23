import { Component, Renderer2, ViewChild } from '@angular/core';
import { EditorConsoleComponent } from './components/editor-console/editor-console.component';
import { EditorTypingComponent } from './components/editor-typing/editor-typing.component';
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

  variableDefinitions: VariableUtil;

  constructor(private renderer: Renderer2) {
    this.variableDefinitions = VariableUtil.Instance(this.createSpan);
  }

  buildText() {
    if (this.monacoComponent.code) {
      for (let child of this.consoleComponent.consoleCode.nativeElement.children) {
        this.renderer.removeChild(this.consoleComponent.consoleCode.nativeElement, child);
      }
      const lines = this.monacoComponent.code.split('\n');
      if(!/\b(Inicio)\b/.test(this.monacoComponent.code)) this.createSpan('color-red', '[fecha] El código no contiene la sentencia de "Inicio" ');
      if(!/\b(Fin)\b/.test(this.monacoComponent.code)) this.createSpan('color-red', '[fecha] El código no contiene la sentencia de "Fin" ');
      for (let index = 0; index < lines.length; index++) {
        this.validateLine(lines[index], index);
      }
    }
  }

  validateLine(line: string, index: number) {
    line = line.replace(/^(\s*)#(.*)$/, '');
    if (line.toString().trim() !== '') {
      const splited = line.toString().split(' ').filter(tes => tes.trim() !== '');
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
    text = text.replace('[fecha]', `[${(new Date()).toLocaleString()}]`)
    span.innerHTML = text;
    this.renderer.appendChild(this.consoleComponent.consoleCode.nativeElement, span);
  }

}
