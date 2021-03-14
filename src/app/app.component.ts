import { Component, ViewChild } from '@angular/core';
import { MonacoEditorComponent, MonacoEditorConstructionOptions, MonacoEditorLoaderService, MonacoStandaloneCodeEditor } from '@materia-ui/ngx-monaco-editor';
import { take, filter } from 'rxjs/operators'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild(MonacoEditorComponent, { static: false })
  monacoComponent: MonacoEditorComponent;

  editorOptions: MonacoEditorConstructionOptions = {
    theme: 'myCustomTheme',
    language: 'mySpecialLanguage',
    roundedSelection: true,
    autoIndent: 'full'
  };
  code = this.getCode();

  constructor(private monacoLoaderService: MonacoEditorLoaderService) {
    this.monacoLoaderService.isMonacoLoaded$
      .pipe(
        filter(isLoaded => isLoaded),
        take(1)
      )
      .subscribe(() => {

        // Register a new language
        monaco.languages.register({ id: 'mySpecialLanguage' });

        // Register a tokens provider for the language
        monaco.languages.setMonarchTokensProvider('mySpecialLanguage', {
          tokenizer: {
            root: [
              [/"(?:[^\\]|\\.)*?(?:"|$)/, 'string'],
              [/(?:function|Inicio|Fin)\b/, 'keyword'],
              [/(?:declare|entero|cadena|logico|fecha|real|entonces|mq|finmq|para|finpara|haga|recibe|si|finsi|sino)\b/, 'declarators'],
              [/(?:envia|recibe|llamar)\b/, 'methods']
            ]
          }
        });

        monaco.editor.defineTheme('myCustomTheme', {
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
          ],
          colors: {}
        });

        monaco.editor.create(document.getElementById('editor'), {
          theme: 'myCustomTheme',
          value: this.getCode(),
          language: 'mySpecialLanguage'
        });

      });
  }

  editorInit(editor: MonacoStandaloneCodeEditor) {
    // monaco.editor.setTheme('vs');
    editor.setSelection({
      startLineNumber: 1,
      startColumn: 1,
      endColumn: 50,
      endLineNumber: 3
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
      envia ( "HOLA MUNDO");
  sino
      envia ( "ESTO ES UNA PRUEBA");
  finsi;
Fin`
    );
  }
}
