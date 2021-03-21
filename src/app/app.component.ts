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
      for (let index = 0; index < lines.length; index++) {

        if (index === 0) {
          this.validateIncio(lines);
          continue;
        }

        if (index === (lines.length - 1)) {
          this.validateFin(lines);
          continue;
        }

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
      this.createSpan('color-omited', 'Se omite la linea ' + (index + 1));
    }
  }

  validateIncio(lines: string[]) {
    if (lines[0].trim() !== 'Inicio') {
      this.createSpan('color-red', 'La linea 1 debe ser "Inicio" ');
    } else {
      this.createSpan('color-blue', 'Compilación exitosa de la linea 1');
    }
  }

  validateFin(lines: string[]) {
    if (lines[lines.length - 1].trim() !== 'Fin') {
      this.createSpan('color-red', 'La ultima linea ' + lines.length + ' debe ser "Fin" ');
    } else {
      this.createSpan('color-blue', 'Compilación exitosa de la linea ' + lines.length);
    }
  }



  createSpan = (color: string = 'color-blue', text: string): void => {
    const span: HTMLSpanElement = this.renderer.createElement('span');
    span.className = color + ' span-pre';
    span.innerHTML = text;
    this.renderer.appendChild(this.consoleComponent.consoleCode.nativeElement, span);
  }

}
