import { motion } from 'framer-motion';
import React, { useState } from 'react';
import RegisterUser from '../../components/modalUser';

const RegisterModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      y: '-100%'
    },
    visible: {
      opacity: 1,
      y: '0',
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <>
      <motion.div        
        initial="hidden"
        animate={isOpen ? 'visible' : 'hidden'}
        variants={modalVariants}
        style={{
          position: 'fixed',
          inset: '0px',
          zIndex: 1000,
          backgroundColor: 'rgba(0,0,0,0.8)'
        }}
      >
        <div className="background-modal" onClick={closeModal}></div>
        <div className="modal-user">
          <div style={{border: '1px solid #00a4d9'}}>
            {isOpen && <RegisterUser />}
          </div>
        </div>      
      </motion.div>
    
      <div className="header header-user">
        <h1>Lista de usuários</h1>
        <button onClick={openModal}>Cadastrar</button>
      </div>
      <div className="table-head-background"></div>
      <table className="study-list">
        <thead className="study-list-header">
          <tr>
            <th>
              <label>Nome</label>
            </th>
            <th>
              <label>Email</label>
            </th>
            <th>
              <label>Senha</label>
            </th>
          </tr>
        </thead>
        <tbody className="study-list-body">
          <tr>
            <td>
              Fulano
            </td>
            <td>fulano@hotmail.com</td>
            <td>*******</td>              
          </tr>
          <tr>
            <td>
              Fulano
            </td>
            <td>fulano@hotmail.com</td>
            <td>*******</td>              
          </tr>
          <tr>
            <td>
              Fulano
            </td>
            <td>fulano@hotmail.com</td>
            <td>*******</td>              
          </tr>
        </tbody>
      </table>
    </>      
  );
};

export default RegisterModal;