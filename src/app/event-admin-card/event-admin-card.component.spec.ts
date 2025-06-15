import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventAdminCardComponent } from './event-admin-card.component';

describe('EventAdminCardComponent', () => {
  let component: EventAdminCardComponent;
  let fixture: ComponentFixture<EventAdminCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventAdminCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventAdminCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
