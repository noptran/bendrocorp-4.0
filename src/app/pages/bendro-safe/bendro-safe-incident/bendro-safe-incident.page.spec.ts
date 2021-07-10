import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BendroSafeIncidentPage } from './bendro-safe-incident.page';

describe('BendroSafeIncidentPage', () => {
  let component: BendroSafeIncidentPage;
  let fixture: ComponentFixture<BendroSafeIncidentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BendroSafeIncidentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BendroSafeIncidentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
