import React, { Component } from 'react';
import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import ItemList from './ItemList';
import AddItemDialog from './AddItemDialog';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';

BigNumber.config({ DECIMAL_PLACES: 18 });

class MilestoneProof extends Component {

  constructor(props) {
    super(props);
    this.state = {
      items: props.items
    };
  }

  componentDidMount() {
    this.setState({
      items: this.props.items
    });
  }

  addItem(item) {
    this.setState(
      prevState => ({
        items: prevState.items.concat(item)
      }),
      () => this.props.onItemsChanged(this.state.items),
    );
  }

  removeItem(index) {
    const { items } = this.state;
    delete items[index];
    this.setState({
      items: items.filter(() => true)
    },
      () => this.props.onItemsChanged(this.state.items),
    );
  }

  render() {
    const { items } = this.state;
    const { isEditMode, classes, t } = this.props;
    //const canEdit = isEditMode || ['Proposed', 'Pending'].includes(milestoneStatus);
    const canEdit = isEditMode;
    return (
      <div>
        <div className="form-group row dashboard-table-view">
          <div className="col-12">
            <div className="card milestone-items-card">
              <div className="card-body">
                <ItemList items={items}></ItemList>
                {items.length > 0 && canEdit && (
                  <AddItemDialog onAddItem={item => this.addItem(item)} />
                )}
                {items.length === 0 && canEdit && (
                  <div>
                    <Typography variant="body1" gutterBottom>
                      {t('milestoneProofDescription')}
                    </Typography>
                    <AddItemDialog onAddItem={item => this.addItem(item)} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


const styles = theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  }
});

MilestoneProof.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onItemsChanged: PropTypes.func,
  isEditMode: PropTypes.bool.isRequired
};

MilestoneProof.defaultProps = {
  onItemsChanged: () => { }
};

export default withStyles(styles)(
  withTranslation()(MilestoneProof)
);
