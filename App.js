import React, {Component } from 'react';
import Aux from '../src/hoc/Aux';
import Layout from '../src/components/Layout/Layout';
import BurgerBuilder from  '../src/containers/BurgerBuilder/BurgerBuilder';

class App extends Component{
  render(){
    return(
      <div>
          <Layout>
            <BurgerBuilder />
          </Layout>
      </div>
    );
  }
}

export default App;