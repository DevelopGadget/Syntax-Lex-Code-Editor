import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorTypingComponent } from './editor-typing.component';

describe('EditorTypingComponent', () => {
  let component: EditorTypingComponent;
  let fixture: ComponentFixture<EditorTypingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorTypingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorTypingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
