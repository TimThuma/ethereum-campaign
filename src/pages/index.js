import React, { Component } from 'react';
import factory from '../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes';

class KaiIndex extends Component {

  render() {
    return (
      <Layout>
        <div style={{ marginTop: 20 }}>
          <h3>Nothing to see here. Check out other tabs.</h3>
        </div>
      </Layout>
    );
  }
}

export default KaiIndex;
