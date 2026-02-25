import { Component, OnInit, OnDestroy, inject, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDivider } from '@angular/material/divider';
import { MatListItem, MatList, MatListModule } from '@angular/material/list';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'user-info-box',
  templateUrl: './user-info-box.html',
  styleUrl: './user-info-box.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [MatExpansionModule, MatListModule],
})
export class InfoBox implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(SharedService);
  equipment!: string;
  period!: string;
  user_info: any = {
    structures: [{ name: '', district: { name: '', region: { name: '' } } }],
    role: { role: '' },
  };

  ngOnInit(): void {
    // Récupération de l'état
    this.route.queryParamMap.subscribe(params => {
      const data = JSON.parse(params.get('data')!);
      if (data) {
        this.equipment = data.equipment;
        this.period = data.period;
        if (this.auth.isUserAdminOrSupervisor()) {
          this.auth.userStructureByReportId(Number(data.id.split('-')[1])).subscribe((res: any) => {
            if (res.data && res.data.report) {
              this.user_info = res.data.report.account;
            }
          });
        } else {
          this.auth.userInformation().subscribe((res: any) => {
            if (res.data && res.data.account) {
              this.user_info = res.data.account;
            }
          });
        }
      }
    });
  }
}
