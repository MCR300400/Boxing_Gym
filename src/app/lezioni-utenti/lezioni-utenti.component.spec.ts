import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LezioniUtentiComponent } from './lezioni-utenti.component';

describe('LezioniUtentiComponent', () => {
  let component: LezioniUtentiComponent;
  let fixture: ComponentFixture<LezioniUtentiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LezioniUtentiComponent]
    });
    fixture = TestBed.createComponent(LezioniUtentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
