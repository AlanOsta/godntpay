<script setup>
import { useMesaStore } from "@/stores/MesaStore.js";

let mesa = useMesaStore();

const comensalRule = [
  (value) => {
    if (value) return true;
    return "Ingrese un nombre valido.";
  },
];
</script>

<template>
  <!-- <v-container class="fill-height"> -->
  <v-responsive class="align-centerfill-height mx-auto" max-width="900">
    <div class="text-center">
      <h1 class="text-h2 font-weight-bold">Godn't Pay</h1>
    </div>

    <div class="py-4" />

    <v-row>
      <v-col cols="12">
        <v-card class="py-4" color="surface-variant" rounded="lg" variant="outlined">
          <template #title>
            <h2 class="text-h5 font-weight-bold">Mesa ID: {{ mesa.id }}</h2>

            <h6 class="text-h6 font-weight-bold">
              Comensales ({{ mesa.comensales.length }})
            </h6>
            <v-chip
              v-for="comensal in mesa.comensales"
              :key="comensal.id"
              class="ma-1"
              closable
              @click:close="mesa.removeComensal(comensal.id)"
            >
              {{ comensal.nombre }}
            </v-chip>
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
            <v-table class="mt-2 pt-2 pb-0">
              <tbody>
                <tr>
                  <td>
                    <v-text-field v-model="mesa.newItem.cant" label="Cant..." />
                  </td>
                  <td>
                    <v-text-field v-model="mesa.newItem.desc" label="Descripcion..." />
                  </td>
                  <td>
                    <v-text-field
                      v-model="mesa.newItem.precio"
                      label="Precio..."
                      prefix="$"
                    />
                  </td>
                  <td>
                    <!-- <div class="pa-0 ma-0 ga-0 text-center"> -->
                    <v-dialog width="auto" scrollable>
                      <template v-slot:activator="{ props: activatorProps }">
                        <v-btn
                          color="grey"
                          text="Paga..."
                          variant="outlined"
                          v-bind="activatorProps"
                        />
                      </template>

                      <template v-slot:default="{ isActive }">
                        <!-- <v-card prepend-icon="mdi-earth" title="Select Country"> -->
                        <v-card>
                          <!-- <v-divider class="mt-3" /> -->
                          <v-card-text class="px-4" style="height: 300px">
                            <v-checkbox
                              v-for="comensal in mesa.comensales"
                              :key="comensal.id"
                              v-model="mesa.newItem.paga"
                              class="pa-0 ma-0 ga-0"
                              hide-details="true"
                              :label="comensal.nombre"
                              :value="comensal.id"
                            />
                          </v-card-text>
                          <v-divider />
                          <v-card-actions>
                            <v-btn text="Cerrar" @click="isActive.value = false" />
                            <v-spacer />
                            <v-btn
                              color="surface-variant"
                              text="Guardar"
                              variant="flat"
                              @click="isActive.value = false"
                            />
                          </v-card-actions>
                        </v-card>
                      </template>
                    </v-dialog>
                    <!-- </div> -->
                  </td>
                  <td>
                    <v-btn
                      color="primary"
                      icon="mdi-plus"
                      size="small"
                      @click="mesa.addItem()"
                    />
                  </td>
                </tr>
              </tbody>
            </v-table>

            <v-divider class="my-3" :thickness="7" />

            <h6 class="text-h6 font-weight-bold">Totales</h6>
            <v-table theme="dark">
              <thead>
                <tr>
                  <th class="text-left">Nombre</th>
                  <th class="text-left">Saldo</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="comensalSaldo in mesa.comensales" :key="comensalSaldo.id">
                  <td>{{ comensalSaldo.nombre }}</td>
                  <td>${{ comensalSaldo.saldo.toFixed(2) }}</td>
                </tr>
              </tbody>
            </v-table>
            <v-divider class="my-3" :thickness="7" />

            <h6 class="text-h6 font-weight-bold">Items ({{ mesa.items.length }})</h6>

            <v-table theme="dark">
              <thead>
                <tr>
                  <th class="text-left">Cant</th>
                  <th class="text-left">Descripcion</th>
                  <th class="text-left">Precio</th>
                  <th class="text-left">Pagan't</th>
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
                      color="warning"
                      icon="mdi-pencil-box"
                      size="small"
                    />
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
  <!-- </v-container> -->
</template>
