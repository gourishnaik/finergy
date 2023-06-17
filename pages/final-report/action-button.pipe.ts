import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'actionButton'
})
export class ActionButtonPipe implements PipeTransform {

  transform(key: unknown, value: boolean): unknown {
    switch (key){
      case "healthInsurance":
      return value ? 'Help me audit my plan' : 'Help me find a policy'
      case "ppf": 
      return value ? 'Help me audit my plan' : 'Help me audit my plan'
      case "sip": 
      return value ? 'Help me analyse my SIP' : 'Help me find a SIP'
      case "termPlan": 
      return value ? 'Help me audit my plan' : 'Help me audit my plan'
      case "termPlan": 
      return value ? 'Help me audit my plan' : 'Help me audit my plan'
      case "childEducationPlan": 
      return value ? 'Help me audit my plan' : 'Help me audit my plan'
      case "emi":
      return value ? 'Get a personalised plan' : 'Get a personalised plan'
      case "accidentPlan":
      return value ? 'Help me audit my plan' : 'Help me find a plan'
    }

    return false;

  }

}
