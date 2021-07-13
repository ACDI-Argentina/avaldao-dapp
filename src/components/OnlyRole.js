import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectRoles } from '../redux/reducers/currentUserSlice';

class OnlyRole extends Component {

    render() {
        const currentRoles = this.props.currentRoles;
        const allowToRol = this.props.role;

        if (currentRoles.includes(allowToRol)) {
            return this.props.children;
        } else {
            return null;
        }
    }
}

const mapStateToProps = (state, ownProps) => ({currentRoles: selectRoles(state)});

export default connect(mapStateToProps,{})(OnlyRole);