import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfileShipsAddUpdateComponent } from './profile-ships-add-update.component';

describe('ProfileShipsAddUpdateComponent', () => {
  let component: ProfileShipsAddUpdateComponent;
  let fixture: ComponentFixture<ProfileShipsAddUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileShipsAddUpdateComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileShipsAddUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
