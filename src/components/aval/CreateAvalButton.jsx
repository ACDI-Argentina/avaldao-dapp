import React from 'react'
import Fab from '@material-ui/core/Fab';
import { history } from '@acdi/efem-dapp';
import { makeStyles } from '@material-ui/core';
import CardMembershipIcon from '@material-ui/icons/CardMembership';
import { useTranslation } from 'react-i18next';



const styles = theme => ({
    solicitarAval: {
        float: 'right'
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    }
});

const useStyles = makeStyles(styles);

const CreateAvalButton = () => {
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <Fab color="primary"
            variant="extended"
            size="medium"
            onClick={() => history.push(`/aval/solicitud`)}
            className={classes.solicitarAval}>
            <CardMembershipIcon className={classes.extendedIcon} />
            {t("avalSolicitarBtn")}
        </Fab>

    )
}

export default CreateAvalButton;