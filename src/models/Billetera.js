import {
    obtenerSaldoBilleteraDB,
    crearRecargaDB,
    actualizarBilleteraDB,
    getBilleteraSocioDB,
    getBilleteraIdDB,
    crearBilleteraDB,
    validarRecargaDB
} from './billetera.model.js';

import {    
    createTransaccionDB
} from './transacciones.model.js'

import { TIPOS_TRANSACCION } from '../constants/transaccion.constants.js';

class Billetera {
    constructor({id_billetera, id_socio, saldo_actual, id_usuario}) {
        this.id_billetera = id_billetera;
        this.id_socio = id_socio;
        this.saldo_actual = saldo_actual;
        this.id_usuario = id_usuario;
    }

    static async obtenerBilleteraSocio(id_socio, connection){
        const data = await getBilleteraSocioDB(id_socio, connection);
        if (!data) throw new Error('Billetera no encontrada');
        data.saldo_actual = parseFloat(data.saldo_actual);
        return new Billetera({
            id_billetera: data.id_billetera,
            id_socio: data.id_socio,
            saldo_actual: data.saldo_actual,
            id_usuario: data.id_usuario
        });
    }

    static async obtenerBilleteraId(id_billetera, connection){
        const data = await getBilleteraIdDB(id_billetera, connection);
        if (!data) throw new Error('Billetera no encontrada');
        data.saldo_actual = parseFloat(data.saldo_actual);
        console.log(data)
        return new Billetera({
            id_billetera: data.id_billetera,
            id_socio: data.id_socio,
            saldo_actual: data.saldo_actual,
            id_usuario: data.id_usuario
        });
    }

    async recargarSaldo(monto, id_metodo_pago, connection) {
        const montoNum = Number(monto);
        if (isNaN(montoNum) || montoNum <= 0) {
            throw new Error('Monto inválido');
        }

        const nuevoSaldo = this.saldo_actual + montoNum;

        const id_recarga = await crearRecargaDB(this.id_billetera, id_metodo_pago, connection);
        await createTransaccionDB(
            this.id_billetera,
            TIPOS_TRANSACCION.RECARGA,
            id_recarga,
            montoNum,
            connection
        );
        this.saldo_actual = nuevoSaldo;
    }

    async validarRecarga(id_recarga, monto, connection) {
        const montoNum = Number(monto);
        await validarRecargaDB(id_recarga, connection);
        await actualizarBilleteraDB(this.id_billetera, montoNum, connection);
    }

    async debitarSaldo(monto) {
        const montoNum = Number(monto);
        if (isNaN(montoNum) || montoNum <= 0) {
            throw new Error('Monto inválido');
        }
        if (montoNum > this.saldo_actual) {
            throw new Error('Saldo insuficiente');
        }
        this.saldo_actual -= montoNum;
        await actualizarBilleteraDB(this.id_billetera, this.saldo_actual);
    }

    async getSaldo() {
        const data = await obtenerSaldoBilleteraDB(this.id_billetera);
        if (!data) throw new Error('Billetera no encontrada');
        this.saldo_actual = data.saldo_actual;
        return data.saldo_actual;
    }

    static async crearBilletera({id_socio,id_usuario,}, connection){

        const id_billetera = await crearBilleteraDB(id_socio, id_usuario, connection);

        return new Billetera({ id_billetera, id_socio, saldo_actual: 0, id_usuario });
    }
}

export { Billetera };