
import React from "react";
import { connect } from 'react-redux';
import { reduxForm, Field  } from 'redux-form';
import * as actions from '../../actions/cards';
import * as selectors from '../../reducers';
// import * as modalActions from '../../actions/modal';
// import Modal from '../Modal';

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  FormGroup,
  Input,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";

const FormInput = ({
  input: { onChange },
  placeholder,
  type,
  value,
}) => (
  <Input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={({ target }) => onChange(target.value)}
    formNoValidate
  />
);

const header = [

 
  {
    text: 'Tarjeta', 
    column: 'name', 
    //className: 'text-center',
  },
  {
    text: 'Percentage', 
    column: 'percentage', 
    //className: 'text-center',
  },
]

class CardsCore extends React.Component {

  componentDidMount() {
    const {
      fetchCards,
    } = this.props;
    fetchCards();
  }

  render() {
    const {
      cards,
      deleteCards,
      handleSubmit,
      postCards,
      permissions,
      showUpdateModal,
    } = this.props;
    return (
      <div className="content">
        {/**<Modal updateAction={updateCard.bind(this)}/>*/}
        <Card>
          <CardBody>
          <form onSubmit={handleSubmit(postCards.bind(this))}>
            <CardTitle>
              Agregar Tarjetas
            </CardTitle>
            <Row>
                <Col sm="11">
                  <Row>
                    <Col>
                      <FormGroup >
                        <Field
                          name='card'
                          component={FormInput}
                          type="text"
                          placeholder="Tarjeta"
                        />
                      </FormGroup>
                    </Col>
                    <Col >
                      <FormGroup>
                        <Field
                          name='percentage'
                          component={FormInput}
                          type="decimal"
                          placeholder="0.0"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={{offset:1}}>
                    <Button 
                      color="info"
                      type="submit"
                    >
                      Agregar
                    </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </form>
          </CardBody>
        </Card>
        {/**
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">
                  Tabla de Tarjetas
                </CardTitle>
              </CardHeader>
              <CardBody>
                <Table  >
                  <thead className="text-primary">
                    <tr>
                      {
                        header.map((column) => (
                          <th className={column.className}>{column.text}</th>
                        ))
                      }
                      {
                        (permissions.cards && (permissions.cards.delete || permissions.cards.edit)) && (
                          <th className="text-right">Actions</th>
                        )
                      }
                    </tr>
                  </thead>
                  <tbody>
                    {
                      cards.map((row) => (
                        <tr>
                          { 
                            header.map((column) => (
                              <td className={column.className}>
                                {column.extra}
                                {row[column.column]}
                              </td>
                            ))
                          }
                          <td className="text-right">
                            <Button
                              className="btn-link"
                              color="success"
                              id="tooltip1"
                              size="sm"
                              onClick={() => showUpdateModal(row.id, row)}
                            >
                              <i className="tim-icons icon-pencil" />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              target="tooltip1"
                            >
                              Actualizar
                            <Button
                              className="btn-link"
                              color="danger"
                              id="tooltip2"
                              size="sm"
                              onClick={() => deleteCards(row.id)}
                            >
                              <i className="tim-icons icon-simple-remove" />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              target="tooltip2"
                            >
                              Eliminar
                            </UncontrolledTooltip>
                        </td>
                      </tr>
                      ))
                    }
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
         */}
      </div>
    )
  }
}

const Cards = reduxForm({
  form: "Cards"
})(CardsCore)


export default connect(
  (state) => ({
    // cards: selectors.getAllCards(state),
  }),
  (dispatch) => ({
    
    fetchCards(){
      dispatch(actions.fetchCards());
    },
    
  }),
)(Cards);