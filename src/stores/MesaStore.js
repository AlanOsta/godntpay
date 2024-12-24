import { defineStore } from "pinia"

export const useMesaStore = defineStore('mesa', {
  state: () => ({
        id: 1,
      comensales: [
        {
          id: 0,
          nombre: "Alan",
          saldo: 0,
        },
        {
          id: 1,
          nombre: "Rusa",
          saldo: 0,
        },

      ],
      items: [
        {
          id: 0,
          cant: 1,
          desc: "Coca Cola",
          precio: 2000,
          paga: [0,1],
        },
        {
          id: 1,
          cant: 1,
          desc: "Pancakes",
          precio: 3000,
          paga: [1],
        },
      ],
      totales: {
        general: 0,
        propina: 0.1,
      },
      newComensal: '',
      newItem: {
        cant: 0,
        desc: '',
        precio: 0,
        paga: [],
      }
  }),

  actions: {
    addItem(){
      let newItem = {
        id: parseInt(this.items.length + 1),
        cant: parseInt(this.newItem.cant),
        desc: this.newItem.desc,
        precio: parseFloat(this.newItem.precio),
        paga: Array.from(this.newItem.paga),
      };
      this.items.push(newItem);
      this.newItem = {
        cant: '',
        desc: '',
        precio: '',
        paga: '',
      }
    },
    addComensal(nombre){
      if (nombre != '') {
        let newComensal = {
          id: this.comensales.length,
          nombre: nombre,
          saldo: 0,
        }
        this.comensales.push(newComensal);
        this.newComensal = '';
        console.log(this.comensales);
      }
    },
    removeComensal(id){
      this.comensales = this.comensales.filter(comensal => comensal.id != id);
      this.items.forEach(item => {
          item.paga = item.paga.filter(comensalId => comensalId != id);
      });
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
