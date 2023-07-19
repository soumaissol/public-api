import Location from './location';
import PowerDistributor from './power-distributor';

class PowerDistributorListing {
  constructor(readonly location: Location, readonly powerDistributors: PowerDistributor[]) {
  }
}

export default PowerDistributorListing;

