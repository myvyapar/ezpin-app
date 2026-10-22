import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';
import { PermissionResolverService } from '../services/resolver/permission-resolver.service';

@Pipe({
  name: 'convertTimezone',
})
export class ConvertTimezone implements PipeTransform {
  public time;
  public date;
  constructor(private permissionResolver: PermissionResolverService) {}

  transform(value: any, args?: any) {
    if (!value) return null;
    let timeZone = this.permissionResolver.permissionInitInfo.profile
      .timezone_data
      ? this.permissionResolver.permissionInitInfo.profile.timezone_data.code
      : '';
    this.time = moment.tz(value, timeZone).format('H:mm:ss');
    this.date = moment.tz(value, timeZone).format('MM/DD/YYYY');

    return { date: this.date, time: this.time };
  }
}
