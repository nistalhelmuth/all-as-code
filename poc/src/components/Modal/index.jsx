import React from 'react';
import ModalComponent from 'react-modal';
import { connect } from 'react-redux';
import * as actions from '../../actions/vm';
import * as selectors from '../../reducers';
import Iframe from 'react-iframe'

import styles from './modal.module.css';

const Modal = ({
  closeModal,
  ip,
}) => (
  <ModalComponent
    isOpen={ip}
    onRequestClose={closeModal}
    className={styles.content}
    overlayClassName={styles.background}
    ariaHideApp={false}
    shouldCloseOnOverlayClick={true}
  >
    <Iframe url={`http://${ip}:8000/logs.txt`}
        id="myId"
        className={styles.code}
        display="initial"
        position="relative"
        
    />
  </ModalComponent>
);

export default connect(
  (state) => ({
    ip: selectors.getLog(state),
  }),
  (dispatch) => ({
    closeModal() {
      dispatch(actions.closeVmStatus());
    },
  }),
)(Modal);
