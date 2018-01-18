import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ManagedChart } from '../market-list/managedChart';
import { MarketService } from '../market.service';
import { SocketService } from '../../shared/socket/socket.service';
import { UserService, IUpgrade } from '../../shared/user/user.service';
import { UpgradeType } from '../../ship/upgrade-class/upgrade';
import { SharedModule } from '../../shared/shared.module';
import { UpgradeService } from '../../ship/upgrade.service';
import { OreService, IOreInfo } from '../../ore/ore.service';


@Component({
  selector: 'app-market-view',
  templateUrl: './market-view.component.html',
  styleUrls: ['./market-view.component.scss']
})
export class MarketInfoComponent implements OnInit {

  @Input('oreName') oreName: string;
  @Input('color') color: string;


  public value: number;

  public isModalOpen: boolean = false;
  public recentValues: number[];
  public histoValues: number[];

  public unitValue: string;
  public valuesTotal: any;
  public valuesTotalWithTaxe: any;
  public boolOreUnlock: boolean;

  public hasMoney: boolean;
  public hasOreLeft: boolean;
  public hasSpaceLeft: boolean;

  public maxSliderValue: number;
  public amountToSell: number = 1;

  public oreInfo: IOreInfo;
  public oreAmount: number;

  public userStorageLvl:number=1;

  //Utiliser oreservcie pour recup bystring
  constructor(private marketS: MarketService, private socketS: SocketService,
    private userS: UserService, private upgradeS: UpgradeService, private oreS: OreService) {

  }

  ngOnInit() {



    this.oreS.getOreInfoByString(this.oreName).take(1).subscribe((oreInfo: IOreInfo) => {
      this.oreInfo = oreInfo;

      this.userS.getUpgradeByName("research").subscribe((upgrade:IUpgrade)=>{
        this.boolOreUnlock = upgrade.lvl >=this.oreInfo.searchNewOre;
      });

      this.oreS.getOreAmountByString(this.oreName).subscribe((oreAmount: number) => {

        this.hasMoney = this.userS.currentUser.credit > 0;
        this.hasOreLeft = oreAmount > 0;
        this.hasSpaceLeft = oreAmount
          < this.upgradeS.storage[this.userStorageLvl].capacity;



        this.value = this.marketS.oreCosts[this.oreName]
        [Object.keys(this.marketS.oreCosts[this.oreName])[Object.keys(this.marketS.oreCosts[this.oreName]).length - 1]];

        this.unitValue = SharedModule.calculeMoneyWithSpace(this.value);
        this.maxSliderValue = (this.upgradeS.storage[this.userStorageLvl].capacity * 0.02
          * this.oreInfo.miningSpeed);
        this.maxSliderValue = ((Math.floor(this.maxSliderValue / 50)) + 1) * 50

        this.amountToSell = parseFloat((this.maxSliderValue / 2).toFixed(1));

        this.valuesTotal = SharedModule.calculeMoneyWithSpace(this.value * this.amountToSell);
        this.valuesTotalWithTaxe = SharedModule.calculeMoneyWithSpace(this.value * this.amountToSell * 1.025);

        this.recentValues = this.marketS.oreCosts[this.oreName];
        this.histoValues = this.marketS.oreHistory[this.oreName];

        this.marketS.oreCostsSubject[this.oreName].subscribe((tab: number[]) => {
          this.value = tab[Object.keys(tab)[Object.keys(tab).length - 1]];
          this.unitValue = SharedModule.calculeMoneyWithSpace(this.value);

          this.valuesTotal = SharedModule.calculeMoneyWithSpace(this.value * this.amountToSell);
          this.valuesTotalWithTaxe = SharedModule.calculeMoneyWithSpace(this.value * this.amountToSell * 1.025);
          this.recentValues = tab;
        });

        this.marketS.oreHistorySubject[this.oreName].subscribe((tab: number[]) => {
          this.histoValues = tab;
        });

        this.userS.getUpgradeByName("storage").subscribe((upgrade:IUpgrade) => {

          this.hasSpaceLeft = oreAmount
          < this.upgradeS.storage[this.userStorageLvl].capacity;

          this.userStorageLvl=upgrade.lvl;
          this.maxSliderValue = (this.upgradeS.storage[upgrade.lvl].capacity * 0.02
            * this.oreInfo.miningSpeed);
          this.maxSliderValue = ((Math.floor(this.maxSliderValue / 50)) + 1) * 50;

          this.valuesTotal = SharedModule.calculeMoneyWithSpace(this.value * this.amountToSell);
          this.valuesTotalWithTaxe = SharedModule.calculeMoneyWithSpace(this.value * this.amountToSell * 1.025);
        });

        this.userS.credit.subscribe((credit:number) => {
          this.hasMoney = credit > 0;
        });
      });
    });

    //To Transform in a setter of oreAmount
    /* this.userS.oreSubject.subscribe((user) => {

     });*/

     /*
     ==> updateCargoTimer => quand on a un cargo en marche
         setInterval(() => {
      this.socketS.updateCargoTimer(this.userS.currentUser.uid);
    }, 1000);

    */
  }

  public SellOre/*moon*/(amount: number) {
    this.socketS.sellOre(this.userS.currentUser.uid, this.oreName, amount);
  }

  public BuyOre(amount: number) {
    this.socketS.buyOre(this.userS.currentUser.uid, this.oreName, amount);
  }

  OpenHistory() {
    this.isModalOpen = true;
  }

  CloseHistory() {
    this.isModalOpen = false;
  }
}
