import {pool} from '../config/db.config.js';

import {TIPOS_TRANSACCION} from '../constants/transaccion.constants.js';

import { randomBytes } from 'crypto';

import jwt from 'jsonwebtoken';

import {
    crearCompraComercioDB,
    crearCompraProductosDB,
} from './compra.model.js';

import {
    crearMensualidadDB
} from './mensualidad.model.js';

import {
    createReservaServicioDB,
    createReservaServicioHorasDB
} from './reservaServicio.model.js';

import {
    createReservaDB,
    createReservaHorasDB,
    createInvitadoDB,
    createInvitadosEnReservaDB,
    createReservaFamiliaresDB
} from './reservas.model.js';

import {
    obtenerSaldoBilleteraDB,
    actualizarBilleteraDB
} from './billetera.model.js';

import {
    getTransaccionesPendientesDB,
    getUltimasTransaccionesSocioDB,
    getTransaccionesSocioPorMesDB,
    getTransaccionesSocioCompletoPorMesDB,
    getTransaccionPorIdDB,
    getDatosMensualidadDB,
    getDatosReservacionDB,
    getDatosCompraDB,
    getDatosServicioDB,
    getDatosRecargaDB,
    pagarMensualidadDB,
    pagarReservacionDB,
    pagarCompraDB,
    pagarServicioDB,
    createTransaccionDB
} from './transacciones.model.js';

import {
    getQrTokenByUsuarioFamiliarDB,
    createQrTokenInvitadoDB,
    createQrTokenFamiliarDB,
    updateQrTokenFamiliarDB
} from './qrtoken.model.js'

// import transaccionesReservaController from '../controllers/transaccionesReserva.controller.js';

class Transaccion {


    constructor({
        id_usuario,
        id_billetera,
        monto,
        id_tipo_transaccion,
        id_pago_asociado
    }) {
        this.id_usuario = id_usuario;
        this.id_billetera = id_billetera;
        this.monto = monto;
        this.id_tipo_transaccion = id_tipo_transaccion;
        this.id_pago_asociado = id_pago_asociado; // Puede ser null para
        this.id_billetera_transaccion = null; // Será asignada al guardar la transacción
    }

    esIngreso(){
        this.monto = Math.abs(this.monto); // Asegura que el monto sea positivo
    }

    esEgreso(){
        this.monto = -Math.abs(this.monto); // Asegura que el monto sea negativo
    }

    async save(connection){

        try{
            const id_transaccion = await createTransaccionDB(
                this.id_billetera,
                this.id_tipo_transaccion,
                this.id_pago_asociado,
                this.monto,
                connection
            )

            this.id_billetera_transaccion = id_transaccion;
        } catch (error) {
            console.error('Error saving transaction:', error);
            throw error;
        }
    }

    async generate(connection){
        return
    }

    async pagar(connection){
        return
    }

    async verificarSaldoDisponible(connection) {
        const saldo = await obtenerSaldoBilleteraDB(this.id_billetera, connection);
        return saldo >= Math.abs(this.monto);
    }

    static async getTransaccionPorId(id_transaccion, connection) {
        const transaccion = await getTransaccionPorIdDB(id_transaccion, connection);

        //console.log('Transacción obtenida:', transaccion);

        transaccion.id_tipo_transaccion = parseInt(transaccion.id_tipo_transaccion);

        let datosTransaccion;

        if(transaccion.id_tipo_transaccion === TIPOS_TRANSACCION.MENSUALIDAD){
            datosTransaccion = await getDatosMensualidadDB(transaccion.id_pago_asociado);
        }else if(transaccion.id_tipo_transaccion === TIPOS_TRANSACCION.RESERVACION){
            datosTransaccion = await getDatosReservacionDB(transaccion.id_pago_asociado);
        }else if(transaccion.id_tipo_transaccion === TIPOS_TRANSACCION.COMPRA_COMERCIO){
            datosTransaccion = await getDatosCompraDB(transaccion.id_pago_asociado);
        }else if(transaccion.id_tipo_transaccion === TIPOS_TRANSACCION.SERVICIO){
            datosTransaccion = await getDatosServicioDB(transaccion.id_pago_asociado);
        }else if(transaccion.id_tipo_transaccion === TIPOS_TRANSACCION.RECARGA){
            datosTransaccion = await getDatosRecargaDB(transaccion.id_pago_asociado);
        }
        //console.log('Datos de la transacción:', datosTransaccion);
        return {transaccion, datosTransaccion};
    }

    static async getTransaccionesPendientes(id_socio, connection) {
        const transacciones = await getTransaccionesPendientesDB(id_socio, connection);
        return transacciones;
    }

    static async getUltimasTransaccionesSocio(id_socio, connection) {
        const transacciones = await getUltimasTransaccionesSocioDB(id_socio, connection);
        return transacciones;
    }

    static async getTransaccionesSocioPorMes(id_billetera, mes, connection) {
        const transacciones = await getTransaccionesSocioPorMesDB(id_billetera, mes, connection);
        return transacciones;
    }

    static async getTransaccionesSocioCompletoPorMes(id_billetera, mes, anho, connection) {
        const transacciones = await getTransaccionesSocioCompletoPorMesDB(id_billetera, mes, anho, connection);
        return transacciones;
    }

    static async pagarTransaccion({ id_billetera, id_tipo_transaccion, id_pago_asociado, monto }, connection) {
        let response;
        console.log('Datos:', { id_billetera, id_tipo_transaccion, id_pago_asociado, monto });
        if (parseInt(id_tipo_transaccion) === TIPOS_TRANSACCION.MENSUALIDAD) {
            response = await pagarMensualidadDB(id_pago_asociado, connection);
        } else if (parseInt(id_tipo_transaccion) === TIPOS_TRANSACCION.RESERVACION) {
            response = await pagarReservacionDB(id_pago_asociado, connection);
        } else if (parseInt(id_tipo_transaccion) === TIPOS_TRANSACCION.COMPRA_COMERCIO) {
            response = await pagarCompraDB(id_pago_asociado, connection);
        } else if (parseInt(id_tipo_transaccion) === TIPOS_TRANSACCION.SERVICIO) {
            response = await pagarServicioDB(id_pago_asociado, connection);
        }
        console.log('Response:', response);
        if (!response) {
            throw new Error('No se encontró el pago asociado o ya está pagado.');
        }
        await actualizarBilleteraDB(id_billetera, (monto), connection);
        return response;
    }




}

class TransaccionCompra extends Transaccion {
    constructor({
        id_usuario,
        id_billetera,
        monto,
        id_tipo_transaccion,
        compraData,
        listaItems
    }) {
        super({
            id_usuario,
            id_billetera,
            monto,
            id_tipo_transaccion
        });
        this.compraData = compraData;
        this.listaItems = listaItems;
        this.id_pago_asociado = null; // Será asignada al guardar la compra
        this.id_billetera_transaccion = null; // Será asignada al guardar la transacción
        this.id_compra_comercio = null; // Será asignada al guardar la compra
    }

    async save() {
        const connection = await pool.getConnection();

        try{

            await connection.beginTransaction();
            
            await this.generate(connection);

            await super.save(connection);

            const procederPago = await super.verificarSaldoDisponible(connection);

            if(procederPago) {
                await this.pagar(connection);
            }

            await connection.commit();

        } catch (error) {
            console.error('Error saving transaction:', error);
            await connection.rollback();
            throw error;
        }finally{
            connection.release();
        }
    }

    async generate(connection){
        const id_compra_comercio = await crearCompraComercioDB(this.compraData, connection);
        this.id_pago_asociado = id_compra_comercio;
        this.id_compra_comercio = id_compra_comercio;
        for (const item of this.listaItems) {
            await crearCompraProductosDB({...item, id_compra_comercio}, connection);
        }

        super.esEgreso();

    }

    async pagar(connection) {
        const response = await pagarCompraDB(this.id_pago_asociado, connection);
        if (response.affectedRows === 0) {
            throw new Error('No se pudo pagar la compra');
        }
        await actualizarBilleteraDB(this.id_billetera, this.monto, connection);
    }

}

class TransaccionMensualidad extends Transaccion {
    constructor({
        id_usuario,
        id_billetera,
        monto,
        id_tipo_transaccion,
        id_socio
    }) {
        super({
            id_usuario,
            id_billetera,
            monto,
            id_tipo_transaccion
        });
        this.id_socio = id_socio;
        this.id_pago_asociado = null; // Será asignada al guardar la mensualidad
        this.id_mensualidad_socio = null; // Será asignada al guardar la mensualidad
    }

    async save() {
        const connection = await pool.getConnection();

        try{
            await connection.beginTransaction();

            await this.generate(connection);

            await super.save(connection);

            const procederPago = await super.verificarSaldoDisponible(connection);

            if(procederPago) {
                await this.pagar(connection);
            }

            await connection.commit();

        } catch (error) {
            //console.error('Error saving transaction:', error);
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    
    async generate(connection){
        const {id, monto} = await crearMensualidadDB(this.id_socio, connection);
        if(!id || !monto) {
            throw new Error('Error al crear la mensualidad');
        }
        this.id_pago_asociado = id;
        this.monto = monto; // Negativo para reflejar el egreso

        super.esEgreso();
    }

    async pagar(connection) {
        const response = await pagarMensualidadDB(this.id_pago_asociado, connection);
        if (response.affectedRows === 0) {
            throw new Error('No se pudo pagar la mensualidad');
        }
        await actualizarBilleteraDB(this.id_billetera, this.monto, connection);
    }

}

class TransaccionReserva extends Transaccion {
    constructor({
        id_usuario,
        id_billetera,
        id_tipo_transaccion,
        monto,
        reservaData,
        listaInvitados,
        listaFamiliares,
        listaHoras
    }){
        super({
            id_usuario,
            id_billetera,
            monto,
            id_tipo_transaccion
        });
        this.reservaData = reservaData;
        this.listaInvitados = listaInvitados;
        this.listaFamiliares = listaFamiliares;
        this.listaHoras = listaHoras;
        this.id_pago_asociado = null; // Será asignada al guardar la reserva
    }

    async save(){
        const connection = await pool.getConnection();

        try{
            await connection.beginTransaction();

            await this.generate(connection);

            await super.save(connection);

            const procederPago = await super.verificarSaldoDisponible(connection);

            if(procederPago) {
                await this.pagar(connection);
            }

            await connection.commit();

        } catch (error) {

            console.error('Error saving transaction:', error);
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async generate(connection) {
        // Crear la reserva principal
        const idReserva = await createReservaDB(this.reservaData, connection);

        // Crear horas de reserva si existen
        if (this.listaHoras && this.listaHoras.length > 0) {
            await createReservaHorasDB(idReserva, this.listaHoras, connection);
        }

        // Crear invitados si existen
        if (this.listaInvitados && this.listaInvitados.length > 0) {
            const listaIdInvitados = await Promise.all(
                this.listaInvitados.map(invitado =>
                    createInvitadoDB(this.id_usuario, invitado, connection)
                )
            );
            const listaInvitadosMapeada = listaIdInvitados.map(id_invitado => ({
                id_rol: 4,
                id_invitado: id_invitado
            }));
            await createInvitadosEnReservaDB(idReserva, listaInvitadosMapeada, connection);
            await Promise.all(this.listaFamiliares.map(familiar => generateOrUpdateQrTokenFamiliar(familiar, this.id_usuario, connection)));

        }

        // Crear familiares si existen
        if (this.listaFamiliares && this.listaFamiliares.length > 0) {
            await createReservaFamiliaresDB(idReserva, this.listaFamiliares, connection);
            await Promise.all(this.listaInvitados.map(invitado => generateQrTokenInvitado(invitado, this.id_usuario, connection)));

        }

        this.id_pago_asociado = idReserva;

        super.esEgreso();
    }

    async pagar(connection) {
        const response = await pagarReservacionDB(this.id_pago_asociado, connection);
        if (response.affectedRows === 0) {
            throw new Error('No se pudo pagar la reserva');
        }
        await actualizarBilleteraDB(this.id_billetera, this.monto, connection);
    }

}


class TransaccionReservaServicio extends Transaccion {
    constructor({
        id_usuario,
        id_billetera,
        id_tipo_transaccion,
        monto,
        reservaServicioData,
        listaHoras
    }){
        super({
            id_usuario,
            id_billetera,
            id_tipo_transaccion,
            monto
        })
        this.reservaServicioData = reservaServicioData;
        this.listaHoras = listaHoras;
        this.id_pago_asociado = null; // Será asignada al guardar la reserva de servicio
    }

    async save(){
        const connection = await pool.getConnection();

        try{
            await connection.beginTransaction();

            super.esEgreso();

            await this.generate(connection);

            await super.save(connection);

            const procederPago = await super.verificarSaldoDisponible(connection);

            if(procederPago) {
                await this.pagar(connection);
            }

            await connection.commit();

        } catch (error) {
            console.error('Error saving transaction:', error);
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async generate(connection) {
        // Crear la reserva de servicio
        const idReserva = await createReservaServicioDB(this.reservaServicioData, connection);

        // Crear las horas asociadas
        if (this.listaHoras && this.listaHoras.length > 0) {
            await createReservaServicioHorasDB(idReserva, this.listaHoras, connection);
        }

        this.id_pago_asociado = idReserva;

        super.esEgreso();
    }

    async pagar(connection) {
        const response = await pagarServicioDB(this.id_pago_asociado, connection);
        if (response.affectedRows === 0) {
            throw new Error('No se pudo pagar la reserva de servicio');
        }
        await actualizarBilleteraDB(this.id_billetera, this.monto, connection);
    }
}

const generateOrUpdateQrTokenFamiliar = async (dataToken, id_usuario, connection) => {
    
    const { id_rol, id_familiar } = dataToken;
    try {
        const jti = randomBytes(16).toString('hex');
        const datosACodificar = {id_usuario: id_usuario, id_rol: id_rol, id_familiar: id_familiar};

        const token = jwt.sign(datosACodificar, process.env.JWT_SECRET, { expiresIn: '24h', jwtid: jti }); // Genera un token JWT con una expiración de 24h

        const {success, data} = await getQrTokenByUsuarioFamiliarDB(id_usuario, id_rol, id_familiar, connection);

        let result;
        if (!success) {
            // Si no existe el token, lo creamos
            result = await createQrTokenFamiliarDB(id_usuario, token, id_rol, id_familiar, connection);
        } else {
            // Si existe el token, lo actualizamos
            result = await updateQrTokenFamiliarDB(id_usuario, token, id_rol, id_familiar, connection);
        }
        return {token: result.data.token};
    } catch (error) {
        await connection.rollback();
        console.error('Error al generar o actualizar el token QR familiar:', error);
        throw error;
    }
}

const generateQrTokenInvitado = async (dataToken, id_usuario, connection) => {
    try {
        const dataInvitado = dataToken;
        const id_rol = 4;
        const jti = randomBytes(16).toString('hex');
        const datosACodificar = {id_usuario: id_usuario, id_rol: id_rol, dataInvitado: dataInvitado};

        const token = jwt.sign(datosACodificar, process.env.JWT_SECRET, { expiresIn: '24h', jwtid: jti }); // Genera un token JWT con una expiración de 24h

        let result = await createQrTokenInvitadoDB(id_usuario, token, id_rol, dataInvitado, connection);

        return {token: result.data.token};
    } catch (error) {
        await connection.rollback();
        console.error('Error al generar o actualizar el token QR invitado:', error);
        throw error;
    }
}

export {
    Transaccion,
    TransaccionCompra, 
    TransaccionMensualidad,
    TransaccionReserva,
    TransaccionReservaServicio
};