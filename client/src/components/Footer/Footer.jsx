import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';

class Footer extends Component {
  render() {
    return (
      <footer className='footer'>
        <Grid fluid>
          <p className='copyright text-center'>
            &copy; {new Date().getFullYear()} <a href=''>Melisxpress</a>, all
            rights reserved
          </p>
        </Grid>
      </footer>
    );
  }
}

export default Footer;
