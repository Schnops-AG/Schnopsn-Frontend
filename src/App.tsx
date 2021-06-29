import './App.scss';
import { LandingPage } from './pages/LandingPage/landingPage';
import { StartGame } from './pages/StartGame/startGame';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Switch>
                    {/* <Route exact path="/" component={StartPage}/> */}
                    <Route exact path="/">
                        <LandingPage />
                    </Route>
                    <Route path="/2erSchnopsn">
                        <StartGame title='2er Schnopsn' gameType="_2ERSCHNOPSN"/>
                    </Route>
                    <Route path="/4erSchnopsn">
                        <StartGame title='4er Schnopsn' gameType="_4ERSCHNOPSN"/>
                    </Route>
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default App;
