import { Component,  ViewChild,  ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { EditorConsoleComponent } from './components/editor-console/editor-console.component';
import { EditorTypingComponent } from './components/editor-typing/editor-typing.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild(EditorTypingComponent, { static: false })
  monacoComponent: EditorTypingComponent;

  constructor(private vcRef: ViewContainerRef, private resolver: ComponentFactoryResolver) {

  }

  buildText() {
    if (this.monacoComponent.code) {
      const lines = this.monacoComponent.code.split('\n');
      for (let index = 0; index < lines.length; index++) {
        console.log(lines[index]);
      }
    }
  }

}
