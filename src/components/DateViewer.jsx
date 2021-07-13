import React, { Component } from 'react';
import moment from 'moment';

/**
 * Presenta una fecha en formato DD/MM/YYYY.
 * 
 */
class DateViewer extends Component {

    constructor(props) {
        super(props);
        this.format = "DD/MM/YYYY";
    }

    render() {
        let date = this.props.value;
        return (
            <span>{!date ? '(Sin fecha)' : moment.utc(date).format(this.format)}</span>
        );
    }
}

DateViewer.propTypes = {
};

DateViewer.defaultProps = {
};

export default DateViewer;