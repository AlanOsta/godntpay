import { defineStore } from "pinia";
import { db } from "@/firebase.js";
import { updateDoc, doc, onSnapshot } from "firebase/firestore";

export const useMesaStore = defineStore('mesa', {
  state: () => ({
      isLoading: true,
      modalVaciarMesa: false,
      calcularPropina: false,
      debug: false,
      comensalesLastId: 0,
      itemsLastId: 0,
      id: '7H2u5S',
      comensales: [],
      items: [],
      total: {
        general: 0,
        propina: 1.1,
        items: 0
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
        id: parseInt(this.itemsLastId + 1),
        cant: parseInt(this.newItem.cant),
        desc: this.newItem.desc.trim(),
        precio: parseFloat(this.newItem.precio),
        paga: Array.from(this.newItem.paga),
      };
      if (newItem.cant != null && newItem.desc != null && newItem.precio != null && newItem.paga.length > 0) {
        this.items.push(newItem);
        this.itemsLastId++;
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
          id: parseInt(this.comensalesLastId + 1),
          nombre: nombre.trim(),
          saldo: 0,
        }
        this.comensales.push(newComensal);
        this.newComensal = '';
        this.comensalesLastId++;
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
      this.total.general = 0;
      this.total.items = 0;
      this.items.forEach(item => {
          let parcial = (item.cant * item.precio) / item.paga.length;
          this.total.general += (item.cant * item.precio);
          this.total.items += item.cant;
          item.paga.forEach(comensal => {
            this.comensales.forEach(comensales => {
              if (comensales.id == comensal) {
                comensales.saldo = comensales.saldo + parcial;
              }
            })
          })
      })
    },

    vaciarMesa(){
      this.comensales = [];
      this.items = [];
      this.modalVaciarMesa = false;
      this.itemsLastId = 0;
      this.comensalesLastId = 0;
    },

    async fetchFirebase(){
      // let fireMesas = await getDocs(collection(db, 'mesas'));

      onSnapshot(doc(db, "mesas", "8VYGyI3FpmfS3j7H2u5S"), (doc) => {
        this.comensales = [];
        this.items = [];

        doc.data().comensales.forEach((comensal) => {
          this.comensales.push(comensal);
        });

        doc.data().items.forEach((item) => {
          this.items.push(item);
        });

        this.itemsLastId = doc.data().itemsLastId;
        this.comensalesLastId = doc.data().comensalesLastId;

        this.calcularSaldos();
        this.isLoading=false;
      });
    },

    async updateMesa(){
      const mesaRef = doc(db, 'mesas', '8VYGyI3FpmfS3j7H2u5S');
      await updateDoc(mesaRef, {
        comensales: this.comensales,
        items: this.items,
        itemsLastId: this.itemsLastId,
        comensalesLastId: this.comensalesLastId
      })
    },
  }
})
