import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { firestoreConnect } from 'react-redux-firebase';
import PropTypes from 'prop-types';

class NuevoLibro extends Component
{
    state = {
        titulo: '',
        ISBN: '',
        editorial: '',
        existencia: ''
    }

    //Agrega nuevo Libro
    agregarLibro = e =>
    {
        e.preventDefault();

        //Extraer valores del State
        const nuevoLibro = this.state;

        //Agregar prestados al arreglo
        nuevoLibro.prestados = [];

        //Extraer firestore de props
        const { firestore, history } = this.props;
 
        //Guardar en la base de datos
        firestore.add({ collection: 'libros' }, nuevoLibro)
            .then(() => history.push('/'));        
    }

    //Extrae los valores del input y los coloca en el State
    leerDato = (e) =>
    {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    
    render()
    {
        return (
            <div className="row">
                <div className="col-12 mb-4">
                    <Link to="/" className="btn btn-secondary">
                        <i className="fas fa-arrow-circle-left"></i>{' '}Volver al Listado
                    </Link>
                </div>

                <div className="col-12">
                    <h2>
                        <i className="fas fa-book"></i>{' '}Nuevo Libro
                    </h2>

                    <div className="row justify-content-center">
                        <div className="col-md-8 mt-5">
                            <form onSubmit={this.agregarLibro}>
                                <div className="form-group">
                                    <label>Titulo: </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="titulo"
                                        placeholder="Titulo o Nombre de Libro"
                                        required
                                        value={this.state.titulo}
                                        onChange={this.leerDato}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Editorial: </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="editorial"
                                        placeholder="Editorial de Libro"
                                        required
                                        value={this.state.editorial}
                                        onChange={this.leerDato}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>ISBN: </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="ISBN"
                                        placeholder="ISBN de Libro"
                                        required
                                        value={this.state.ISBN}
                                        onChange={this.leerDato}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Existencia: </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="existencia"
                                        placeholder="Cantidad en Existencia"
                                        required
                                        value={this.state.existencia}
                                        onChange={this.leerDato}
                                    />
                                </div>

                                <input type="submit" value="Agregar Libro" className="btn btn-success"/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
NuevoLibro.propTypes = {
    firestore: PropTypes.object.isRequired
}
 
export default firestoreConnect()(NuevoLibro);