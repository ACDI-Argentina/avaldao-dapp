import React, { Component } from 'react';
import moment from 'moment';

/**
 * Presenta una fecha en formato DD/MM/YYYY HH:mm.
 * 
 */
class DateTimeViewer extends Component {

    constructor(props) {
        super(props);
        this.format = "DD/MM/YYYY HH:mm";
    }

    render() {
        let dateTime = this.props.value;
        return (
            <div style={this.props.style}>
                {!dateTime ? '(Sin fecha)' : moment.unix(dateTime).format(this.format)}
            </div>
        );
    }
}

DateTimeViewer.propTypes = {
};

DateTimeViewer.defaultProps = {
};

export default DateTimeViewer;