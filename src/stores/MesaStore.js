import { defineStore } from "pinia"

export const useMesaStore = defineStore('mesa', {
  state: () => ({
        id: 'WRMcpIk7',
      comensales: [],
      items: [],
      totales: {
        general: 0,
        propina: 0.1,
      },
      newComensal: '',
      newItem: {
        cant: null,
        desc: null,
        precio: null,
        paga: [],
      }
  }),

  actions: {
    addItem(){
      let newItem = {
        id: parseInt(this.items.length + 1),
        cant: parseInt(this.newItem.cant),
        desc: this.newItem.desc.trim(),
        precio: parseFloat(this.newItem.precio),
        paga: Array.from(this.newItem.paga),
      };
      this.items.push(newItem);
      this.newItem = {
        cant: 0,
        desc: ' ',
        precio: 0,
        paga: [],
      }
      this.calcularSaldos();
    },
    removeItem(id){
      this.items = this.items.filter(item => item.id != id);
      this.calcularSaldos();
    },
    addComensal(nombre){
      if (nombre != '') {
        let newComensal = {
          id: this.comensales.length,
          nombre: nombre.trim(),
          saldo: 0,
        }
        this.comensales.push(newComensal);
        this.newComensal = '';
      }
      this.calcularSaldos();
    },
    removeComensal(id){
      this.comensales = this.comensales.filter(comensal => comensal.id != id);
      this.items.forEach(item => {
          item.paga = item.paga.filter(comensalId => comensalId != id);
      });
      this.calcularSaldos();
    },
    calcularSaldos(){
      this.comensales.forEach(comensal => {
        comensal.saldo = 0;
      });
      this.items.forEach(item => {
          let parcial = item.precio / item.paga.length;
          item.paga.forEach(comensal => {
            this.comensales.forEach(comensales => {
              if (comensales.id == comensal) {
                comensales.saldo = comensales.saldo + parcial;
              }
            })
          })
      })
    }
  }
})
