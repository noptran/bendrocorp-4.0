import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BendroSafePage } from './bendro-safe.page';

describe('BendroSafePage', () => {
  let component: BendroSafePage;
  let fixture: ComponentFixture<BendroSafePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BendroSafePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BendroSafePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
