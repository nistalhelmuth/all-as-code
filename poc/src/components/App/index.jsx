import React from 'react';
import { connect } from "react-redux";
import { reduxForm, Field  } from 'redux-form';
import Select from "react-select";
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
import Modal from '../Modal';
import * as selector from '../../reducers';
import * as actions from '../../actions/vm';
import styles from './app.module.css';

const required = (value) => (value ? undefined : 'Requerido*');

const FormInput = ({
  input: { onChange },
  placeholder,
  type,
  value,
  meta: {
    error,
    touched,
  }
}) => (
  <>
    <Input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={({ target }) => onChange(target.value)}
    />
    <label className="error">{touched && error}</label>
  </>
);

const typeGas = [
  {
    text:'g1-small',
    column:'g1-small',
  },
  {
    text: 'g1-small',
    column: 'g1-small',
  },
  {
    text: 'g1-small',
    column: 'g1-small',
  },
]

const FormSelect = ({
  input: { onChange },
  placeholder,
  value,
  options,
  meta: {
    error,
    touched,
  }
}) => (
  <>
    <Select
      className="react-select info"
      classNamePrefix="react-select"
      onChange={value => onChange(value.name)}
      value={value}
      options={typeGas.map(column => {
        return {
          name: column,
          label: column.text,
        }
      })}
      placeholder={placeholder}
    />
    <label className="error">{touched && error}</label>
  </>
);

const header = [
  /**
  {
    text: 'ID', 
    column: 'id', 
  },
   */
  {
    text: 'Nombre',
    column: 'name',
  },
  {
    text: 'Tipo',
    column: 'machineType',
  },
  {
    text: 'IP',
    column: 'publicIp',
    link: true,
  },
  {
    text: 'día creado',
    column: 'dateCreated',
  },
]

class AppCore extends React.Component {
  componentDidMount() {
    const {
      fetchVms,
    } = this.props;
    fetchVms();
  }

  render () {
    const {
      createVm,
      deleteVm,
      handleSubmit,
      fetchVms,
      vms,
      fetchVmStatus,
    } = this.props;
    return (
      <div 
        className={`main-panel ${styles.app}`}
        data="blue"
      >
        <Modal />
          <Card>
            <CardBody>
            <form onSubmit={handleSubmit(createVm.bind(this))}>
              <CardTitle>
                Crear Instancia
              </CardTitle>
              <Row>
                  <Col sm="11">
                    <Row>
                      <Col>
                        <FormGroup >
                          <Field
                            name='name'
                            component={FormInput}
                            placeholder="nombre"
                            validate={[required]}
                          />
                        </FormGroup>
                      </Col>
                      <Col >
                        <FormGroup>
                          <Field
                            name='tipo'
                            component={FormSelect}
                            placeholder="tipo"
                            validate={[required]}
                          />
                        </FormGroup>
                      </Col>
                      <Col >
                        <FormGroup>
                          <Field
                            name='repo'
                            component={FormInput}
                            placeholder="repo"
                            validate={[required]}
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
                        <Button 
                          color="info"
                          onClick={fetchVms.bind(this)}
                        >
                          Cargar
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </form>
            </CardBody>
          </Card>
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">
                    Instancias:
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Table>
                    <thead className="text-primary">
                      <tr>
                        {
                          header.map((column) => (
                            <th className={column.className}>
                              <p>
                                {column.text}
                              </p>
                            </th>
                          ))
                        }
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        vms.map((row) => (
                          <tr>
                            { 
                              header.map((column) => (
                                <td className={column.className}>
                                  {
                                    column.link ? (
                                      <a
                                        href={`http://${row[column.column]}:8080/blue/organizations/jenkins/pipelines`}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                          http://{row[column.column]}
                                        </a>
                                    ) : (
                                      <p>
                                        {row[column.column]}
                                      </p>
                                    )
                                  }
                                </td>
                              ))
                            }
                            <td className="text-right">
                              <Button
                                className="btn-link"
                                color="success"
                                id="tooltip1"
                                size="sm"
                                onClick={() => fetchVmStatus(row.publicIp)}
                              >
                                <i className="tim-icons icon-pencil" />
                              </Button>
                              <UncontrolledTooltip
                                delay={0}
                                target="tooltip1"
                              >
                                Revisar
                              </UncontrolledTooltip>
                              <Button
                                className="btn-link"
                                color="danger"
                                id="tooltip2"
                                size="sm"
                                onClick={() => deleteVm(row.name)}
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
      </div>
    )
  }
}

const App = reduxForm({
  form: "App"
})(AppCore)

export default connect(
  (state) => ({
    vms: selector.getAllVMS(state),
  }),
  (dispatch) => ({
    fetchVms(){
      dispatch(actions.fetchVms());
    },
    fetchVmStatus(ip){
      dispatch(actions.fetchVmStatus({
        ip,
      }));
    },
    createVm(values){
      dispatch(actions.createVm(({
        ...values,
        type: values.tipo.column,
      })));
    },
    deleteVm(name){
      dispatch(actions.deleteVm({
        name
      }));
    },
  }),
)(App);
