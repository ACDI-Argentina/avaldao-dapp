import BigNumber from 'bignumber.js'
import { paramsForServer } from 'feathers-hooks-common'
import { feathersClient } from '../lib/feathersClient'
import DAC from '../models/DAC'
import Campaign from '../models/Campaign'
import Donation from '../models/Donation'
import crowdfundingContractApi from '../lib/blockchain/CrowdfundingContractApi'

BigNumber.config({ DECIMAL_PLACES: 18 });

const dacs = feathersClient.service('dacs');

class DACService {
  /**
   * Get a DAC defined by ID
   *
   * @param id   ID of the DAC to be retrieved
   */
  static get(id) {
    return crowdfundingContractApi.getDAC(id);
  }

  /**
   * Get DACs
   *
   * @param $limit    Amount of records to be loaded
   * @param $skip     Amounds of record to be skipped
   * @param onSuccess Callback function once response is obtained successfylly
   * @param onError   Callback function if error is encountered
   */
  static getDACs($limit = 100, $skip = 0, onSuccess = () => {}, onError = () => {}) {
    return feathersClient
      .service('dacs')
      .find({
        query: {
          status: DAC.ACTIVE,
          $limit,
          $skip,
          $sort: { campaignsCount: -1 },
        },
      })
      .then(resp => onSuccess(resp.data.map(d => new DAC(d)), resp.total))
      .catch(onError);
  }

  /**
   * Lazy-load DAC Campaigns by subscribing to campaigns listener
   *
   * @param delegateId Dekegate ID of the DAC which campaigns should be retrieved
   * @param onSuccess  Callback function once response is obtained successfylly
   * @param onError    Callback function if error is encountered
   */
  static subscribeCampaigns(delegateId, onSuccess, onError) {
    return feathersClient
      .service('donations')
      .watch({ listStrategy: 'always' })
      .find({
        query: {
          $select: ['delegateId', 'intendedProjectId', 'amount'],
          delegateId,
          $limit: 200,
        },
      })
      .subscribe(async resp => {
        const projectIDs = {};
        resp.data.forEach(d => {
          if (d.intendedProjectId && d.amount) {
            projectIDs[d.intendedProjectId] = (
              projectIDs[d.intendedProjectId] || new BigNumber(0)
            ).plus(new BigNumber(d.amount));
          }
        });

        const campaignsResp = await feathersClient.service('campaigns').find({
          query: {
            projectId: { $in: Object.keys(projectIDs) },
            $limit: 200,
          },
        });

        const campaigns = campaignsResp.data.map(d => new Campaign(d));
        onSuccess(campaigns);
      }, onError);
  }

  /**
   * Get DAC donations
   *
   * @param id        ID of the DAC which donations should be retrieved
   * @param $limit    Amount of records to be loaded
   * @param $skip     Amounds of records to be skipped
   * @param onSuccess Callback function once response is obtained successfully
   * @param onError   Callback function if error is encountered
   */
  static getDonations(id, $limit = 100, $skip = 0, onSuccess = () => {}, onError = () => {}) {
    return feathersClient
      .service('donations')
      .find(
        paramsForServer({
          query: {
            status: { $ne: Donation.FAILED },
            delegateTypeId: id,
            isReturn: false,
            intendedProjectId: { $exists: false },
            $sort: { createdAt: -1 },
            $limit,
            $skip,
          },
          schema: 'includeTypeAndGiverDetails',
        }),
      )
      .then(resp => onSuccess(resp.data.map(d => new Donation(d)), resp.total))
      .catch(onError);
  }

  /**
   * Subscribe to count of new donations. Initial resp will always be 0. Any new donations
   * that come in while subscribed, the onSuccess will be called with the # of newDonations
   * since initial subscribe
   *
   * @param id        ID of the Campaign which donations should be retrieved
   * @param onSuccess Callback function once response is obtained successfully
   * @param onError   Callback function if error is encountered
   */
  static subscribeNewDonations(id, onSuccess, onError) {
    let initalTotal;
    return feathersClient
      .service('donations')
      .watch()
      .find(
        paramsForServer({
          query: {
            status: { $ne: Donation.FAILED },
            delegateTypeId: id,
            isReturn: false,
            intendedProjectId: { $exists: false },
            $sort: { createdAt: -1 },
            $limit: 0,
          },
          schema: 'includeTypeAndGiverDetails',
        }),
      )
      .subscribe(resp => {
        if (initalTotal === undefined) {
          initalTotal = resp.total;
          onSuccess(0);
        } else {
          onSuccess(resp.total - initalTotal);
        }
      }, onError);
  }

  /**
   * Get the user's DACs ??
   *
   * @param userAddress   Address of the user whose DAC list should be retrieved
   * @param skipPages     Amount of pages to skip
   * @param itemsPerPage  Items to retreive
   * @param onSuccess     Callback function once response is obtained successfully
   * @param onError       Callback function if error is encountered
   */
  static getUserDACs(userAddress, skipPages, itemsPerPage, onSuccess, onError) {
    return dacs
      .watch({ listStrategy: 'always' })
      .find({
        query: {
          ownerAddress: userAddress,
          $sort: {
            createdAt: -1,
          },
          $limit: itemsPerPage,
          $skip: skipPages * itemsPerPage,
        },
      })
      .subscribe(resp => {
        const newResp = Object.assign({}, resp, {
          data: resp.data.map(d => new DAC(d)),
        });
        onSuccess(newResp);
      }, onError);
  }

}

export default DACService;
