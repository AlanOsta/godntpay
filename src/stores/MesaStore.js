import { defineStore } from "pinia";
import { db } from "@/firebase.js";
import { getDocs, updateDoc, doc, collection } from "firebase/firestore";

export const useMesaStore = defineStore('mesa', {
  state: () => ({
      isLoading: true,
      id: '',
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
        id: parseInt(this.items.length),
        cant: parseInt(this.newItem.cant),
        desc: this.newItem.desc.trim(),
        precio: parseFloat(this.newItem.precio),
        paga: Array.from(this.newItem.paga),
      };
      if (newItem.cant != null && newItem.desc != null && newItem.precio != null && newItem.paga.length > 0) {
        this.items.push(newItem);
        this.newItem = {
          cant: null,
          desc: null,
          precio: null,
          paga: [],
        }
        this.calcularSaldos();
        this.updateMesa();
      }
    },

    removeItem(id){
      this.items = this.items.filter(item => item.id != id);
      this.calcularSaldos();
      this.updateMesa();
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
      this.updateMesa();
    },

    removeComensal(id){
      this.comensales = this.comensales.filter(comensal => comensal.id != id);
      this.items.forEach(item => {
          item.paga = item.paga.filter(comensalId => comensalId != id);
      });
      this.calcularSaldos();
      this.updateMesa();
    },

    calcularSaldos(){
      this.comensales.forEach(comensal => {
        comensal.saldo = 0;
      });
      this.items.forEach(item => {
          let parcial = (item.cant * item.precio) / item.paga.length;
          item.paga.forEach(comensal => {
            this.comensales.forEach(comensales => {
              if (comensales.id == comensal) {
                comensales.saldo = comensales.saldo + parcial;
              }
            })
          })
      })
    },

    async fetchFirebase(){
      let fireMesas = await getDocs(collection(db, 'mesas'));
      fireMesas.forEach((mesa) => {

        this.id = mesa.id;

        mesa.data().comensales.forEach((comensal) => {
          this.comensales.push(comensal);
        });

         mesa.data().items.forEach((item) => {
          this.items.push(item);
        });

      })

      this.calcularSaldos();
    },

    async updateMesa(){
      const mesaRef = doc(db, 'mesas', this.id);
      await updateDoc(mesaRef, {
        comensales: this.comensales,
        items: this.items
      })
    },
  }
})
