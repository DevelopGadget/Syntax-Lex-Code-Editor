import { Component, OnInit, ViewChild } from '@angular/core';
import { MonacoEditorComponent, MonacoEditorConstructionOptions, MonacoEditorLoaderService } from '@materia-ui/ngx-monaco-editor';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-editor-console',
  templateUrl: './editor-console.component.html',
  styleUrls: ['./editor-console.component.scss']
})
export class EditorConsoleComponent implements OnInit {

  @ViewChild(MonacoEditorComponent, { static: false })
  monacoComponent: MonacoEditorComponent;

  editorConsoleOptions: MonacoEditorConstructionOptions = {
    theme: 'ConsoleSpecialTheme',
    language: 'ConsoleSpecial',
    autoIndent: 'full',
    tabSize: 24,
    automaticLayout: true,
    dragAndDrop: true,
    formatOnPaste: true,
    mouseWheelZoom: true,
    insertSpaces: true,
    readOnly: false
  };

  constructor(private monacoLoaderService: MonacoEditorLoaderService) { }

  ngOnInit(): void {
    this.monacoLoaderService.isMonacoLoaded$
    .pipe(
      filter(isLoaded => isLoaded),
      take(1)
    )
    .subscribe(() => {

      // Register a new language
      monaco.languages.register({ id: 'ConsoleSpecial' });

      // Register a tokens provider for the language
      monaco.languages.setMonarchTokensProvider('ConsoleSpecial', {
        tokenizer: {
          root: [
            [/\[error.*/, 'custom-error'],
            [/\[notice.*/, 'custom-notice'],
            [/\[info.*/, 'custom-info'],
            [/\[[a-zA-Z 0-9:]+\]/, 'custom-date'],
          ]
        }
      });

      monaco.editor.defineTheme('ConsoleSpecialTheme', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          {
            token: 'comment',
            foreground: 'ffa500',
            fontStyle: 'italic underline'
          },
          { token: 'custom-info', foreground: '808080' },
          { token: 'custom-error', foreground: 'ff0000', fontStyle: 'bold' },
          { token: 'custom-notice', foreground: 'FFA500' },
          { token: 'custom-date', foreground: '008800' },
        ],
        colors: {}
      });

    });
  }

}
