import React from 'react';
import '../assets/css/MerchantSupport.css';
import { Grid, Row } from 'react-bootstrap';

const MerchantSupport = () => {
  return (
    <div>
      <div className='content second-portion'>
        <Grid fluid>
          <Row>
            <div className='box text-center'>
              <div className='icon'>
                <div className='info'>
                  <h3 className='title' style={{ fontSize: '25px' }}>
                    Mail us here
                  </h3>
                  <p style={{ fontSize: '20px' }}>
                    <i className='fa fa-envelope' aria-hidden='true' /> &nbsp;
                    Support@support.com
                    <br />
                    <br />
                  </p>
                </div>
              </div>
              <div className='space' />
            </div>
          </Row>
        </Grid>
      </div>
    </div>
  );
};
export default MerchantSupport;
