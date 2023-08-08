import { Stage } from 'sms-api-commons';

import FakeSolarEnergyGateway from '../../infra/solar-energy-gateway/fake-solar-energy-gateway';
import PortalSolarEnergyGateway from '../../infra/solar-energy-gateway/portal-solar-gateway';
import type SolarEnergyGateway from '../../infra/solar-energy-gateway/solar-energy-gateway';

export default class SolarEnergyGatewayFactory {
  constructor(readonly stage: Stage) {}

  getSolarEnergyGateway(): SolarEnergyGateway {
    switch (this.stage) {
      case Stage.Staging:
        return new FakeSolarEnergyGateway();
    }
    return new PortalSolarEnergyGateway();
  }
}
