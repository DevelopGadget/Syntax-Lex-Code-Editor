import { Component, OnInit, ViewChild } from '@angular/core';
import { MonacoEditorComponent, MonacoEditorConstructionOptions, MonacoEditorLoaderService } from '@materia-ui/ngx-monaco-editor';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-editor-typing',
  templateUrl: './editor-typing.component.html',
  styleUrls: ['./editor-typing.component.scss']
})
export class EditorTypingComponent implements OnInit {

  @ViewChild('editor', { static: false })
  public monacoComponent: MonacoEditorComponent;

  public editorOptions: MonacoEditorConstructionOptions = {
    theme: 'PseudoCodigoTheme',
    language: 'PseudoCodigo',
    roundedSelection: true,
    autoIndent: 'full',
    tabSize: 24,
    automaticLayout: true,
    dragAndDrop: true,
    formatOnPaste: true,
    formatOnType: true,
    minimap: {
      enabled: false,
    },
    fontSize: 25,
    mouseWheelZoom: true,
    renderIndentGuides: false,
    selectOnLineNumbers: true,
    insertSpaces: true
  };

  public code = this.getCode();

  constructor(private monacoLoaderService: MonacoEditorLoaderService) { }

  ngOnInit(): void {
    this.monacoLoaderService.isMonacoLoaded$
    .pipe(
      filter(isLoaded => isLoaded),
      take(1)
    )
    .subscribe(() => {

      // Register a new language
      monaco.languages.register({ id: 'PseudoCodigo' });

      // Register a tokens provider for the language
      monaco.languages.setMonarchTokensProvider('PseudoCodigo', {
        tokenizer: {
          root: [
            [/^(.*)#(.*)$/, 'comments'],
            [/'(?:[^\\]|\\.)*?(?:'|$)/, 'string'],
            [/(?:function|Inicio|Fin)\b/, 'keyword'],
            [/(?:declare|entero|cadena|logico|fecha|real|entonces|mq|finmq|para|finpara|haga|recibe|si|finsi|sino)\b/, 'declarators'],
            [/(?:envia|recibe|llamar)\b/, 'methods'],
            [/[-+/*=<>!]+/, 'operator']
          ]
        }
      });

      monaco.editor.defineTheme('PseudoCodigoTheme', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          {
            token: 'comment',
            foreground: 'ffa500',
            fontStyle: 'italic underline'
          },
          { token: 'string', foreground: 'c2cd7b' },
          { token: 'keyword', foreground: 'cb7732' },
          { token: 'declarators', foreground: 'e26eb2' },
          { token: 'methods', foreground: '49d76f' },
          { token: 'comments', foreground: '6f6d64', fontStyle: 'italic underline' },
          { token: 'operator', foreground: '038cfc' },
        ],
        colors: {}
      });

    });
  }

  getCode() {
    return (
            `Inicio
        declare a,1b entero;
        declare x real;
        declare i real;
        recibe(x);
        a = 5;
        b = 2;
        si x >= (b + 1c) entonces
            # a = a +1
            envia ( 'HOLA MUNDO');
        sino
            envia ( 'ESTO ES UNA PRUEBA');
        finsi;
      Fin`
    );
  }

}
