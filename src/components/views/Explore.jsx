import React from 'react';
/*import DACs from './DACs';*/
import Campaigns from './Campaigns';
import Milestones from './Milestones';
import JoinGivethCommunity from '../JoinGivethCommunity';


const Explore = ({ history }) => (
  <div>
    <JoinGivethCommunity history={history} />
    {/*<DACs />*/}
    Blances
    <Campaigns />
    {/*<Milestones />*/}
    
    

  </div>
);

Explore.propTypes = {};


export default Explore