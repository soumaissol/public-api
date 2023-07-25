import Location from './location';
import type PowerDistributor from './power-distributor';

class PowerDistributorListing {
  constructor(
    readonly location: Location,
    readonly powerDistributors: PowerDistributor[],
  ) {}
}

export default PowerDistributorListing;
