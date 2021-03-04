import './App.css';

import MainLayout from './layouts/MainLayout'
import {Container} from "@material-ui/core";
import {QuickStart} from "./screens/QuickStart";
import {SnackbarProvider} from "notistack";


function App() {
    return (
        <SnackbarProvider maxSnack={5}>
            <MainLayout>
                <Container>
                    <QuickStart/>
                </Container>
            </MainLayout>
        </SnackbarProvider>
    );
}

export default App;
