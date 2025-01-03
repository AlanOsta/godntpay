<script setup>
import { useMesaStore } from "@/stores/MesaStore.js";
import { onMounted } from "vue";

const mesa = useMesaStore();

onMounted(() => {
  mesa.fetchFirebase();
});

const comensalRule = [
  (value) => {
    if (value) return true;
    return "Ingrese un nombre valido.";
  },
];
</script>

<template>
  <v-responsive class="align-centerfill-height mx-auto" max-width="900">
    <div class="text-center">
      <h1 class="text-h2 font-weight-bold mt-1">Godn't Pay</h1>
    </div>

    <div class="py-1" />

    <v-row>
      <v-col cols="12">
        <v-card class="py-1 ma-1" color="surface-variant" rounded="lg" variant="outlined">
          <template #title>
            <v-progress-linear
              class="mt-0 p-0 mb-2"
              v-show="mesa.isLoading"
              color="grey"
              indeterminate
              rounded
            />
            <div class="d-flex justify-space-between block">
              <span class="text-h6 font-weight-bold flex">Mesa ID: {{ mesa.id }}</span>
              <v-btn size="x-small" color="warning" @click="mesa.modalVaciarMesa = true">
                Vaciar Mesa
              </v-btn>
            </div>
            <v-dialog v-model="mesa.modalVaciarMesa" width="auto">
              <v-card
                max-width="400"
                prepend-icon="mdi-delete-empty"
                title="¿Vaciar mesa?"
              >
                <template #actions>
                  <v-btn
                    class="ms-auto"
                    color="red"
                    text="VACIAR"
                    block
                    variant="outlined"
                    @click="mesa.vaciarMesa()"
                  />
                </template>
              </v-card>
            </v-dialog>

            <h6 class="text-h6 font-weight-bold">
              Comensales ({{ mesa.comensales.length }})
            </h6>
            <v-container fluid px-0>
              <v-row>
                <v-chip
                  v-for="comensal in mesa.comensales"
                  :key="comensal.id"
                  class="ma-1"
                  closable
                  @click:close="mesa.removeComensal(comensal.id)"
                >
                  {{ comensal.nombre }}
                </v-chip>
              </v-row>
            </v-container>
            <v-text-field
              v-model="mesa.newComensal"
              class="width-50"
              validate-on="submit-lazy"
              :rules="comensalRule"
              label="Nuevo comensal..."
              :append-icon="'mdi-plus'"
              @click:append="mesa.addComensal(mesa.newComensal)"
            />
            <v-divider class="my-3" :thickness="7" />

            <h6 class="text-h6 font-weight-bold">Agregar item...</h6>

            <v-number-input
              v-model="mesa.newItem.cant"
              control-variant="default"
              variant="solo"
              inset
              label="Cant..."
            />

            <v-text-field v-model="mesa.newItem.desc" label="Descripcion..." />

            <v-number-input
              v-model="mesa.newItem.precio"
              control-variant="default"
              variant="solo"
              inset
              label="Precio..."
              prefix="$"
            />

            <v-container fluid px-0>
              <v-row>
                <span>Paga...</span>
              </v-row>
              <v-row>
                <v-checkbox
                  v-for="comensal in mesa.comensales"
                  :key="comensal.id"
                  v-model="mesa.newItem.paga"
                  class="pa-0 ma-0 ga-0"
                  hide-details="true"
                  :label="comensal.nombre"
                  :value="comensal.id"
                />
              </v-row>
            </v-container>

            <v-btn block class="my-2" color="dark-grey" @click="mesa.addItem()">
              Agregar
            </v-btn>

            <v-divider class="my-3" :thickness="7" />

            <div class="d-flex justify-space-between block">
              <span class="text-h6 font-weight-bold flex">Totales</span>

              <v-switch
                v-model="mesa.calcularPropina"
                color="warning"
                label="Propina (10%)"
                hide-details
              />
            </div>

            <v-table theme="dark">
              <thead>
                <tr>
                  <th class="text-left">Nombre</th>
                  <th class="text-left">
                    {{ mesa.calcularPropina ? "Saldo c/ Propina" : "Saldo" }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="comensalSaldo in mesa.comensales" :key="comensalSaldo.id">
                  <td>{{ comensalSaldo.nombre }}</td>
                  <td>
                    ${{
                      mesa.calcularPropina
                        ? (comensalSaldo.saldo * 1.1).toFixed(2)
                        : comensalSaldo.saldo?.toFixed(2)
                    }}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th>Total</th>
                  <td>
                    ${{
                      mesa.calcularPropina
                        ? (mesa.total.general * 1.1).toFixed(2)
                        : mesa.total.general.toFixed(2)
                    }}
                  </td>
                </tr>
              </tfoot>
            </v-table>
            <v-divider class="my-3" :thickness="7" />

            <h6 class="text-h6 font-weight-bold">Items ({{ mesa.items.length }})</h6>

            <v-table theme="dark">
              <thead>
                <tr>
                  <th class="text-left">Cant</th>
                  <th class="text-left">Descripcion</th>
                  <th class="text-left">Precio</th>
                  <th class="text-left">Paga</th>
                  <th class="text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in mesa.items" :key="item.id">
                  <td>{{ item.cant }}</td>
                  <td>{{ item.desc }}</td>
                  <td>${{ item.precio }}</td>
                  <td>
                    <v-chip v-for="paga in item.paga" :key="paga.id" class="ma-1">
                      {{ mesa.comensales[paga].nombre }}
                    </v-chip>
                  </td>
                  <td>
                    <v-btn
                      class="mx-1"
                      color="error"
                      icon="mdi-close-box"
                      size="small"
                      @click="mesa.removeItem(item.id)"
                    />
                  </td>
                </tr>
              </tbody>
            </v-table>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-responsive>
</template>
