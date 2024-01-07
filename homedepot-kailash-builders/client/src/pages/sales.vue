<template>
  <div class="q-pl-sm q-pr-sm q-pt-sm row">
    <div class="col-12">
      <q-tabs align="left" outside-arrows
              mobile-arrows v-model="inventoryTab"
              narrow-indicator style="min-height: 60px" class="text-primary q-mt-sm bg-grey-3 text-h4 rounded-borders">
        <q-route-tab no-caps :to="'/sales_dashboard'" name="sales_dashboard" label="Overview" />
        <q-route-tab no-caps :to="'/sales'" name="sales" label="Sales" />
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
      inventoryTab: "sales_dashboard",
    }
  },
  methods: {

  },
  created() {
    this.$router.push({name:"sales_dashboard"})
  }
}
</script>
