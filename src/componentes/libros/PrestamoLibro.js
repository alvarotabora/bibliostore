import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Spinner from '../layout/Spinner';
import FichaSuscriptor from '../suscriptores/FichaSuscriptor';

//Redux Action
import { buscarUsuario } from '../../actions/buscarUsuariosActions';

class PrestamoLibro extends Component
{
    state = {
        noResultado: false,
        busqueda: ''
    }
    
    //Buscar Alumno por codigo
    buscarAlumno = e =>
    {
        e.preventDefault();

        //Obtener el valor a buscar
        const { busqueda } = this.state;

        //Extraer firestore
        const { firestore, buscarUsuario } = this.props;

        //Hacer la consulta
        const coleccion = firestore.collection('suscriptores');
        const consulta = coleccion.where("codigo", "==", busqueda).get();

        //Leer los resultados
        consulta.then(resultado =>
        {
            if (resultado.empty)
            {
                //No hay resultados
                
                //Almacenar en Redux un objeto vacio
                buscarUsuario({});

                this.setState({
                    noResultado: true
                    
                })
            }
            else
            {
                //Si hay resultados
                const datos = resultado.docs[0];

                //Colocar el resultado en el state de Redux
                buscarUsuario(datos.data());

                this.setState({
                    noResultado: false
                });
            }
        })

    }

    //Almancena datos del suscriptor para solicitar el libro
    solicitarPrestamo = () =>
    {
        const { usuario } = this.props;

        //Fecha de alta
        usuario.fecha_solicitud = new Date().toLocaleDateString();

        //Copia de props
        let prestados = [];

        prestados = [...this.props.libro.prestados, usuario];

        //Copiar el objeto y agregar los prestados
        const libro = { ...this.props.libro };

        //Eliminiar los prestados anteriores
        delete libro.prestados;

        //Asignar los prestados
        libro.prestados = prestados;

        //Obtener firestore y history de props
        const { firestore, history } = this.props;

        //Almacenar en la BD
        firestore.update({
            collection: 'libros',
            doc: libro.id
        }, libro).then(history.push('/'));
    }

    //Almacenar el codigo en el state
    leerDato = e =>
    {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render()
    {
        //Extraer el libro
        const { libro } = this.props;

        if (!libro) return <Spinner />;

        const { usuario } = this.props;

        let fichaAlumno, btnSolicitar;

        if (usuario.nombre)
        {
            fichaAlumno = <FichaSuscriptor suscriptor={usuario} />;
            btnSolicitar = <button type="button" className="btn btn-primary btn-block" onClick={this.solicitarPrestamo}>Solicitar Prestamo</button>;
        }
        else
        {
            fichaAlumno = null;
            btnSolicitar = null;
        }

        //Mostrar mensaje de Error
        const { noResultado } = this.state;

        let mensajeResultado = '';

        if (noResultado)
        {
            mensajeResultado = <div className="alert alert-danger text-center font-weight-bold">No hay resultados para este codigo.</div>
        }
        else
        {
            mensajeResultado = null;
        }

        return (
            <div className="row">
                <div className="col-12 mb-4">
                    <Link to="/" className="btn btn-secondary">
                        <i className="fas fa-arrow-circle-left"></i>{' '}Volver al Listado
                    </Link>
                </div>

                <div className="col-12">
                    <h2>
                        <i className="fas fa-book"></i>{' '}Solicitar Prestamo: {libro.titulo}
                    </h2>
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <form onSubmit={this.buscarAlumno} className="mb-4">
                                <legend className="color-primary text-center mt-5">Busca el suscriptor por Codigo</legend>
                                
                                <div className="form-group">
                                    <input type="text" className="form-control" name="busqueda" onChange={this.leerDato} />
                                </div>

                                <input type="submit" className="btn btn-success btn-block" value="Buscar Alumno" />
                            </form>

                            {fichaAlumno}
                            {btnSolicitar}
                            {mensajeResultado}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
PrestamoLibro.prpTypes = {
    firestore: PropTypes.object.isRequired
}
 
export default compose(
    firestoreConnect(props => [
        {
            collection: 'libros',
            storeAs: 'libro',
            doc: props.match.params.id
        }
    ]),
    connect(({ firestore: { ordered }, usuario }, props) => ({
        libro: ordered.libro && ordered.libro[0],
        usuario: usuario
    }), { buscarUsuario })
)(PrestamoLibro);