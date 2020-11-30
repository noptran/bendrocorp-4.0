import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FlightLogsPage } from './flight-logs.page';

describe('FlightLogsPage', () => {
  let component: FlightLogsPage;
  let fixture: ComponentFixture<FlightLogsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightLogsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FlightLogsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
