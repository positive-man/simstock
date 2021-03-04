import React from 'react';
import {createMuiTheme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import {ThemeProvider} from '@material-ui/styles';
import {blue} from "@material-ui/core/colors";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="/">
                SIMSTOCK
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    '@global': {
        ul: {
            margin: 0,
            padding: 0,
            listStyle: 'none',
        },
    },
    appBar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    toolbar: {
        flexWrap: 'wrap',
    },
    link: {
        margin: theme.spacing(1, 1.5),
    },
    footer: {
        borderTop: `1px solid ${theme.palette.divider}`,
        marginTop: theme.spacing(8),
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
        [theme.breakpoints.up('sm')]: {
            paddingTop: theme.spacing(6),
            paddingBottom: theme.spacing(6),
        },
    },
}));

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: blue
    }
})

export default function MainLayout(props) {
    const classes = useStyles();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <Typography style={{fontWeight: 800, fontSize:24, flexGrow:1}} >
                        SIMSTOCK
                    </Typography>
                    <nav>
                        <Link variant="button" color="textPrimary" href="#" className={classes.link}>
                            Simulations
                        </Link>
                        <Link variant="button" color="textPrimary" href="#" className={classes.link}>
                            Quick Start
                        </Link>
                        <Link variant="button" color="textPrimary" href="#" className={classes.link}>
                            Pricing
                        </Link>
                        <Link variant="button" color="textPrimary" href="#" className={classes.link}>
                            About
                        </Link>
                    </nav>
                    <Button href="#" color="primary" variant="outlined" className={classes.link}>
                        Login
                    </Button>
                </Toolbar>
            </AppBar>
            {/* End hero unit */}
            {props.children}
            <Container maxWidth="md" component="footer" className={classes.footer}>
                <Box>
                    <Copyright/>
                </Box>
            </Container>
        </ThemeProvider>
    );
}