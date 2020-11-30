import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SystemMapPage } from './system-map.page';

describe('SystemMapPage', () => {
  let component: SystemMapPage;
  let fixture: ComponentFixture<SystemMapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemMapPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SystemMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
