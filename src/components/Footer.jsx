import React from 'react';
import { Link } from 'react-router-dom';

/* Le cambio el nombre por conflicto con Footer anterior */
const OldFooter = props => (
    <div
        style={{
            marginTop: '5px',
            marginBottom: '5px',
            marginLeft: '5%',
            height: '1px',
            width: '90%',
            borderTop: '1px solid #CCC',
        }}
    >
        <footer className="page-footer" style={{ padding: '.5rem' }} >
            <small>
                <ul
                    style={{
                        display: 'flex',
                        listStyle: 'none',
                        paddingInlineStart: '0px',
                        justifyContent: 'center',
                    }}
                >
                    <li>
                        <a href="http://acdi.org.ar" target="_blank">
                            <img src="/img/acdi-logo.png" width="60px" alt="ACDI logo" />
                        </a> 
                    </li>
                </ul>
            </small>
        </footer>
    </div >
);

export default OldFooter;