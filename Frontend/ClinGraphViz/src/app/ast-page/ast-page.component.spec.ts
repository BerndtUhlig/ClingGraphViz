import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AstPageComponent } from './ast-page.component';

describe('AstPageComponent', () => {
  let component: AstPageComponent;
  let fixture: ComponentFixture<AstPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AstPageComponent]
    });
    fixture = TestBed.createComponent(AstPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
