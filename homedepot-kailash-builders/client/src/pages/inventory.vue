  <template>
  <div class="q-pl-sm q-pr-sm q-pt-sm row">
    <div class="col-12">
      <q-tabs align="left" outside-arrows
              mobile-arrows v-model="inventoryTab"
              narrow-indicator style="min-height: 60px" class="text-primary q-mt-sm bg-grey-3 text-body1 rounded-borders">
        <q-route-tab no-caps :to="'/inventory_dashboard'" name="inventory_dashboard" label="Overview" />
        <q-route-tab no-caps :to="'/products'" name="products" label="Products" />
        <q-route-tab no-caps :to="'/category'" name="products_cat" label="Category" />
        <q-route-tab no-caps :to="'/suppliers'" name="suppliers" label="Suppliers" />
        <q-route-tab no-caps :to="'/brands'" name="brands" label="Brands" />
      </q-tabs>
      <q-separator/>
      <q-tab-panels class="bg-info col-12" v-model="inventoryTab">
        <q-tab-panel class="no-padding" :name="inventoryTab">
          <router-view :isMobileView="$props.mobileView" ></router-view>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>
<script>
export default {
  props:['mobileView'],
  data() {
    return {
      inventoryTab: "inventory_dashboard",
    }
  },
  methods: {

  },
  created() {
    this.inventoryTab =  "inventory_dashboard",
    this.$router.push({name:"inventory_dashboard"})
  }
}
</script>
