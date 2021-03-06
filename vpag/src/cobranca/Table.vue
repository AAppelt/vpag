<template>
  <v-layout wrap>
    <new-edit-sheet />
    <delete-dialog />
    <div class="headline">Cobrancas</div>
    <v-spacer />
    <v-btn color="primary" dark class="mb-2" @click="createEditShow()">Nova</v-btn>
    <!-- <v-btn color="primary" dark class="mb-2" @click="createEditShow()">Nova Recorrente</v-btn> -->
    <v-flex xs12>
      <v-layout column>
        <v-flex>
          <v-card>
            <v-card-title>
              <v-text-field
                v-model="q"
                append-icon="search"
                label="Buscar"
                single-line
                hide-details
                clearable
              />
              <v-flex class="d-flex justify-end" lg4 sm4 xs12>
                <filter-dialog v-bind="query" @update="update" @loading="setLoading" />
              </v-flex>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="items"
              :server-items-length="total"
              :page.sync="page"
              :items-per-page.sync="itemsPerPage"
              :sort-by.sync="sortBy"
              :sort-desc.sync="descending"
              :loading="loading"
              loading-text="Carregando... Por favor aguarde"
            >
              <template v-slot:[`item.name`]="{ item }">
                <a :href="item.weblink" target="_blank" style="text-decoration: none;">
                  {{ item.name }}
                  <v-icon small>open_in_new</v-icon>
                </a>
              </template>
              <template v-slot:[`item.data-table-actions`]="{ item }">
                <v-menu bottom left>
                  <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click="createEditShow(item)">
                      <v-list-item-title>Edit</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="removeShow(item)">
                      <v-list-item-title>Delete</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapFields } from "vuex-map-fields"
import { mapActions } from "vuex"
import DeleteDialog from "@/cobranca/DeleteDialog.vue"
import FilterDialog from "@/cobranca/FilterDialog.vue"
import NewEditSheet from "@/cobranca/NewEditSheet.vue"
export default {
  name: "CobrancaTable",

  components: {
    DeleteDialog,
    FilterDialog,
    NewEditSheet
  },
  data() {
    return {
      headers: [
        { text: "Nome", value: "name", sortable: true },
        { text: "Valor", value: "valor", sortable: false },
        { text: "Data", value: "valor", sortable: false },
        { text: "", value: "data-table-actions", sortable: false, align: "end" }
      ]
    }
  },

  computed: {
    ...mapFields("cobranca", [
      "table.options.q",
      "table.options.page",
      "table.options.itemsPerPage",
      "table.options.sortBy",
      "table.options.descending",
      "table.loading",
      "table.rows.items",
      "table.rows.total"
    ])
  },

  mounted() {
    this.getAll({})

    this.$watch(
      vm => [vm.page],
      () => {
        this.getAll()
      }
    )

    this.$watch(
      vm => [vm.q, vm.itemsPerPage, vm.sortBy, vm.descending],
      () => {
        this.page = 1
        this.getAll()
      }
    )
  },

  methods: {
    ...mapActions("cobranca", ["getAll", "createEditShow", "removeShow"])
  }
}
</script>
