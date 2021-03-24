import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeWordsComponent } from './tree-words.component';

describe('TreeWordsComponent', () => {
  let component: TreeWordsComponent;
  let fixture: ComponentFixture<TreeWordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreeWordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeWordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
