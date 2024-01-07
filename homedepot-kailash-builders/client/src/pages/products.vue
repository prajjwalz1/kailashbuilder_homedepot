<template>
  <div class="q-pa-sm">
    <q-page-sticky style="z-index: 10" position="bottom-right" :offset="[18, 18]">
      <q-fab
        icon="add"
        @click="openOptionsDialog"
        direction="up"
        label="Add"
        color="primary"
      >
      </q-fab>
    </q-page-sticky>
    <q-dialog v-model="confirmDeleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="task_alt" color="primary" text-color="white" />
          <span class="q-ml-sm">Are You Sure You Want To Delete?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn v-close-popup @click="deleteProd" flat label="Yes" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
      v-model="openProdDetailsDialog">
      <q-card>
        <q-toolbar class="bg-primary text-white text-bold q-pa-md">
          <q-toolbar-title class="text-h6">Product Details</q-toolbar-title>
          <q-btn @click="confirmDeleteDialog = true" icon="delete" v-close-popup flat></q-btn>
          <q-btn @click="editProd" icon="edit" flat></q-btn>
          <q-btn icon="close" v-close-popup flat></q-btn>
        </q-toolbar>
        <q-card-section class="q-pa-xs">
          <div class="row justify-center">
            <div class="col-lg-8 col-md-9 col-sm-11 col-xs-12">
              <q-tabs
                v-model="prodDetailsTab"
                @input="prodDetailsTabChanged"
                narrow-indicator
                outside-arrows
                mobile-arrows
                style="min-height: 60px" class="text-primary q-mt-sm bg-grey-3 text-body1 rounded-borders"
              >
                <q-tab style="font-size: small" name="details" label="Info" />
                <q-tab name="history" label="History" />
                <q-tab name="supplier" label="Supplier" />
              </q-tabs>
              <q-tab-panels
                v-model="prodDetailsTab"
                animated
                vertical
                transition-prev="jump-up"
                transition-next="jump-up"
              >
                <q-tab-panel v-if="selectedProd.name" name="details">
                  <div class="text-h5 text-bold q-mb-md">{{selectedProd.name}}</div>
                  <div class="q-pt-md">
                    <div class="row">
                      <div class="col-lg-4 col-md-4 col-sm-6 col-xs-6 q-pa-xs">
                        <q-card style="min-height: 100%" >
                          <q-card-section class="text-center">
                            <q-avatar square text-color="green-10" size="100px" font-size="100px" icon="paid">
                            </q-avatar>
                          </q-card-section>
                          <q-card-section class="text-center text-body1">
                            <div class="text-h5 text-bold q-pb-sm">Rs.{{selectedProd.purchaseAmount}}</div>
                            Total Amount Sold
                          </q-card-section>
                        </q-card>
                      </div>
                      <div class="col-lg-4 col-md-4 col-sm-6 col-xs-6 q-pa-xs">
                        <q-card style="min-height: 100%" >
                          <q-card-section class="text-center">
                            <q-avatar square text-color="orange-10" size="100px" font-size="100px" icon="local_shipping">
                            </q-avatar>
                          </q-card-section>
                          <q-card-section class="text-center text-body1">
                            <div class="text-h5 text-bold q-pb-sm">{{selectedProd.purchaseCount+" "+selectedProd.category.name}}</div>
                            Total Sold.
                          </q-card-section>
                        </q-card>
                      </div>
                      <div class="col-lg-4 col-md-4 col-sm-6 col-xs-6 q-pa-xs">
                        <q-card style="min-height: 100%" >
                          <q-card-section class="text-center">
                            <q-avatar square text-color="primary" size="100px" font-size="100px" icon="inventory_2">
                            </q-avatar>
                          </q-card-section>
                          <q-card-section class="text-center text-body1">
                            <div class="text-h5 text-bold q-pb-sm">{{selectedProd.total_stock+" "+selectedProd.category.name}}</div>
                            Total Available.
                          </q-card-section>
                        </q-card>
                      </div>
                      <div class="col-lg-4 col-md-4 col-sm-6 col-xs-6 q-pa-xs">
                        <q-card style="min-height: 100%" >
                          <q-card-section class="text-center">
                            <q-avatar square text-color="grey-8" size="100px" font-size="100px" icon="maps_home_work">
                            </q-avatar>
                          </q-card-section>
                          <q-card-section class="text-center text-body1">
                            <div class="text-h5 text-bold q-pb-sm">Rs.{{selectedProd.total_amount}}</div>
                            In House Amount
                          </q-card-section>
                        </q-card>
                      </div>
                      <div class="col-12 text-body1 q-pt-lg q-pb-lg">
                        <div >
                          <b>Brand: </b> {{selectedProd.brand.name}}
                        </div>
                        <div class="q-pt-sm">
                          <b>Category: </b> {{selectedProd.category.name}}
                        </div>
                      </div>
                      <div class="col-12 text-h5 text-bold text-primary q-py-md">
                        Warehouse Details
                      </div>
                      <div v-if="selectedProd.warehouses && selectedProd.warehouses.length<=0" class="col-12 text-h6 text-bold text-red-10">
                        <q-icon size="lg" name="error"></q-icon> No Stock Left In The Warehouse.
                      </div>
                      <div :key="warehouse._id" v-for="warehouse in selectedProd.warehouses" class="col-lg-4 col-md-4 col-sm-12 col-xs-12 q-pa-xs text-body1">
                        <q-card>
                          <q-card-section class="text-h6 text-primary text-bold">
                            {{warehouse.warehouse.name}}
                          </q-card-section>
                          <q-card-section class="q-pt-none">
                            <div>
                              <b>Retail Price: </b> Rs.{{warehouse.retail_price}}
                            </div>
                            <div class="q-pt-sm">
                              <b>Total Stock: </b> {{warehouse.stock_count+" "+selectedProd.category.name}}
                            </div>
                            <div class="q-pt-sm">
                              <b>Total Amount In Hand: </b> Rs. {{warehouse.total_amount}}
                            </div>
                            <div class="q-pt-sm">
                              <b>Reorder Point: </b> {{warehouse.reorder_point}}
                            </div>
                          </q-card-section>
                        </q-card>
                      </div>
                      <div class="col-12 text-h5 text-bold text-primary q-py-md">
                        Groups Details
                      </div>
                      <div v-if="selectedProd.groups && selectedProd.groups.length<=0" class="col-12 text-h6 text-bold text-red-10">
                        <q-icon size="lg" name="error"></q-icon> No Stock Left In The Group.
                      </div>
                      <div :key="group._id" v-for="group in selectedProd.groups" class="col-lg-4 col-md-4 col-sm-12 col-xs-12 q-pa-xs text-body1">
                        <q-card>
                          <q-card-section class="text-h6 text-primary text-bold">
                            {{group.group.name}}
                          </q-card-section>
                          <q-card-section class="q-pt-none">
                            <div>
                              <b>Retail Price: </b> Rs.{{group.retail_price}}
                            </div>
                            <div class="q-pt-sm">
                              <b>Total Stock: </b> {{group.stock_count+" "+selectedProd.category.name}}
                            </div>
                            <div class="q-pt-sm">
                              <b>Total Amount In Hand: </b> Rs. {{group.total_amount}}
                            </div>
                            <div class="q-pt-sm">
                              <b>Reorder Point: </b> {{group.reorder_point}}
                            </div>
                          </q-card-section>
                        </q-card>
                      </div>
                      <div class="col-12 text-h5 text-bold text-primary q-py-md">
                        Sites Details
                      </div>
                      <div v-if="selectedProd.sites && selectedProd.sites.length<=0" class="col-12 text-h6 text-bold text-red-10">
                        <q-icon size="lg" name="error"></q-icon> No Stock Left In The Site.
                      </div>
                      <div :key="site._id" v-for="site in selectedProd.sites" class="col-lg-4 col-md-4 col-sm-12 col-xs-12 q-pa-xs text-body1">
                        <q-card>
                          <q-card-section class="text-h6 text-primary text-bold">
                            {{site.site.name}}
                          </q-card-section>
                          <q-card-section class="q-pt-none">
                            <div>
                              <b>Retail Price: </b> Rs.{{site.retail_price}}
                            </div>
                            <div class="q-pt-sm">
                              <b>Total Stock: </b> {{site.stock_count+" "+selectedProd.category.name}}
                            </div>
                            <div class="q-pt-sm">
                              <b>Total Amount In Hand: </b> Rs. {{site.total_amount}}
                            </div>
                            <div class="q-pt-sm">
                              <b>Reorder Point: </b> {{site.reorder_point}}
                            </div>
                          </q-card-section>
                        </q-card>
                      </div>
                    </div>
                  </div>
                </q-tab-panel>
                <q-tab-panel name="history">
                  <div class="text-h5 text-bold q-mb-md">{{selectedProd.name}}'s Past History</div>
                  <div class="q-pt-md">
                    <div class="row">
                      <div class="col-12">
                        <HistoryViewerComponent :datas="historyData"></HistoryViewerComponent>
                      </div>
                      <div class="col-12 q-pt-lg">
                        <div class="centerize">
                          <q-pagination
                            v-model="historyCurrent"
                            :max="historyTotal"
                            :max-pages="5"
                            :ellipses="false"
                            :boundary-numbers="false"
                            @click="getHistory"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </q-tab-panel>
                <q-tab-panel name="supplier">
                  <div class="text-h5 text-bold q-mb-md">{{selectedProd.name}}'s Past Supplier Data</div>
                  <div class="q-pt-md">
                    <div class="row">
                      <div class="col-12">
                        <HistoryViewerComponent :datas="supplierData"></HistoryViewerComponent>
                      </div>
                      <div class="col-12 q-pt-lg">
                        <div class="centerize">
                          <q-pagination
                            v-model="supplierCurrent"
                            :max="supplierTotal"
                            :max-pages="5"
                            :ellipses="false"
                            :boundary-numbers="false"
                            @click="getHistory"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
      v-model="searchDialog">
      <q-card>
        <q-toolbar class="bg-primary text-white text-bold q-pa-md">
          <q-toolbar-title>{{optionType === 'update'?'Update Existing':'Transfer Item'}}</q-toolbar-title>
          <q-btn icon="close" v-close-popup flat></q-btn>
        </q-toolbar>
        <q-card-section>
          <div class="row justify-center">
            <div class="col-lg-8 col-md-9 col-sm-11 col-xs-12 pa-2 ">
              <q-stepper
                v-model="optionsStep"
                ref="stepper"
                color="primary"
                animated
              >
                <q-step
                  :name="1"
                  title="Search Item"
                  icon="edit"
                  :done="optionsStep > 1"
                >
                  <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                      <q-input :style="$props.isMobileView?'':'min-width: 50%;max-width: 50%'" v-model="search" label="Search For Item" outlined class="shadow-1"></q-input>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                      <div :class="$props.isMobileView?'q-pt-md':'text-right'">
                        <q-btn label="Search" @click="SearchProduct" color="primary"></q-btn>
                      </div>
                    </div>
                    <div class="col-12 q-pt-lg">
                      <q-table
                        :pagination="{rowsPerPage:0}"
                        :grid="$props.isMobileView"
                        :data="itemData"
                        :columns="productColumn"
                        row-key="name"
                        hide-bottom
                        @row-click="selectData"
                        :hide-header="$props.isMobileView"
                        card-class="text-body1 font-medium"
                      >
                        <template v-slot:body-cell="props">
                          <q-td :props="props">
                            <div class="q-py-lg">
                              {{props.value}}
                            </div>
                          </q-td>
                        </template>
                      </q-table>
                    </div>
                    <div class="col-12 q-py-lg text-center text-h5 text-bold font-bold" v-if="itemData.length<=0">
                      No Data Added Yet.
                    </div>
                    <div class="col-12 q-pt-lg">
                      <div class="centerize">
                        <q-pagination
                          v-model="currentPage"
                          :max="totalPage"
                          :max-pages="5"
                          :ellipses="false"
                          :boundary-numbers="false"
                          @click="getProducts"
                        />
                      </div>
                    </div>
                  </div>
                </q-step>
                <q-step
                  :name="2"
                  title="Edit Product"
                  icon="settings"
                  :done="optionsStep > 2"
                >
                  <div v-if="optionType==='update'">
                    <div class="row">
                      <div v-if="optionLocationType === ''" class="col-12 q-py-md">
                        <b>Select Update Type</b>
                        <q-select :style="$props.isMobileView?'':'max-width:50%'" v-model="optionLocationType" :options="optionLocationTypes" filled class="shadow-1 q-mt-sm" label="Select Type"></q-select>
                      </div>
                      <div v-else class="col-12">
                        <div class="row">
                          <div v-if="optionLocationType === 'Warehouse'" class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pa-md">
                            <b>Select Warehouse</b>
                            <query-search-renderer @selectQuery="warehouseSelected" :details="queryProductOptions.warehouse_start" type="warehouse_search"></query-search-renderer>
                          </div>
                          <div v-if="optionLocationType === 'Group'" class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pa-md">
                            <b>Select Warehouse</b>
                            <query-search-renderer @selectQuery="groupSelected" :details="queryProductOptions.group_start" type="group_search"></query-search-renderer>
                          </div>
                          <div v-if="optionLocationType === 'Site'" class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pa-md">
                            <b>Select Warehouse</b>
                            <query-search-renderer @selectQuery="siteSelected" :details="queryProductOptions.site_start" type="site_search"></query-search-renderer>
                          </div>
                          <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pa-md">
                            <b>Select Supplier</b>
                            <query-search-renderer @selectQuery="supplierSelected" :details="queryProductOptions.supplier" type="supplier_search"></query-search-renderer>
                          </div>
                          <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pa-md">
                            <b>Stock Count</b>
                            <q-input v-model.number="queryProductOptions.stock_count" @input="calculateTotal" filled class="shadow-1" type="number" label="Enter Stock Count"></q-input>
                          </div>
                          <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pa-md">
                            <b>Amount Per Stock</b>
                            <q-input v-model.number="queryProductOptions.retail_price" @input="calculateTotal" filled class="shadow-1" type="number" label="Enter Stock Amount"></q-input>
                          </div>
                          <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pa-md">
                            <b>Amount Per Stock</b>
                            <q-input v-model.number="queryProductOptions.total_price" @input="calculateTotal" filled class="shadow-1" type="number" label="Enter Stock Amount"></q-input>
                          </div>
                          <div class="col-12 q-pa-md">
                            <q-btn @click="putUpdate" color="primary" label="Save Update"></q-btn>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                  <div v-if="optionType==='transfer'">
                    <div class="row">
                      <div v-if="startingTransferLocation !== '' && endingTransferLocation !== ''" class="col-12">
                        <div class="row">
                          <div class="col-12 q-pa-md">
                            <q-btn @click="()=>{this.startingTransferLocation ='';this.endingTransferLocation = ''}" label="Back" color="red-10"></q-btn>
                          </div>
                          <div v-if="startingTransferLocation === 'Warehouse'" class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pa-md">
                            <b>Select Starting Warehouse</b>
                            <query-search-renderer @selectQuery="warehouseSelected" :details="queryProductOptions.warehouse_start" type="warehouse_search"></query-search-renderer>
                          </div>
                          <div v-if="startingTransferLocation === 'Group'" class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pa-md">
                            <b>Select Starting Group</b>
                            <query-search-renderer @selectQuery="groupSelected" :details="queryProductOptions.group_start" type="group_search"></query-search-renderer>
                          </div>
                          <div v-if="startingTransferLocation === 'Site'" class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pa-md">
                            <b>Select Starting Site</b>
                            <query-search-renderer @selectQuery="siteSelected" :details="queryProductOptions.site_start" type="site_search"></query-search-renderer>
                          </div>
                          <div v-if="endingTransferLocation === 'Warehouse'" class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pa-md">
                            <b>Select Destination Warehouse</b>
                            <query-search-renderer @selectQuery="warehouseEndSelected" :details="queryProductOptions.warehouse_end" type="warehouse_search"></query-search-renderer>
                          </div>
                          <div v-if="endingTransferLocation === 'Group'" class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pa-md">
                            <b>Select Destination Group</b>
                            <query-search-renderer @selectQuery="groupEndSelected" :details="queryProductOptions.group_end" type="group_search"></query-search-renderer>
                          </div>
                          <div v-if="endingTransferLocation === 'Site'" class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pa-md">
                            <b>Select Destination Site</b>
                            <query-search-renderer @selectQuery="siteEndSelected" :details="queryProductOptions.site_end" type="site_search"></query-search-renderer>
                          </div>
                          <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pa-md">
                            <b>Stock Count</b>
                            <q-input v-model.number="queryProductOptions.stock_count" @input="calculateTotal" filled class="shadow-1" type="number" label="Enter Stock Count"></q-input>
                            <div class="text-bold text-red-10 q-pt-sm">Total stock count in starting warehouse: {{totalStock}}</div>
                          </div>
                          <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pa-md">
                            <b>Amount Per Stock</b>
                            <q-input v-model.number="queryProductOptions.retail_price" @input="calculateTotal" filled class="shadow-1" type="number" label="Enter Stock Amount"></q-input>
                          </div>
                          <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pa-md">
                            <b>Amount Per Stock</b>
                            <q-input v-model.number="queryProductOptions.total_price" @input="calculateTotal" filled class="shadow-1" type="number" label="Enter Stock Amount"></q-input>
                          </div>
                          <div class="col-12 q-pa-md">
                            <q-btn @click="putUpdate" color="primary" label="Save"></q-btn>
                          </div>
                        </div>
                      </div>
                      <div v-else class="col-12">
                        <div class="row">
                          <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12 q-pa-md">
                            <div class="text-bold q-pb-sm">Select Transfer Start Type</div>
                            <q-select v-model="startingTransferLocation" :options="optionLocationTypes" filled class="shadow-1 q-mt-sm" label="Select Type"></q-select>
                          </div>
                          <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12 q-pa-md text-center">
                            <div class="text-bold q-pt-sm">Transfer To</div>
                            <q-icon color="primary" size="xl" name="east"></q-icon>
                          </div>
                          <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12 q-pa-md">
                            <div class="text-bold q-pb-sm">Select Transfer End Type</div>
                            <q-select v-model="endingTransferLocation" :options="optionLocationTypes" filled class="shadow-1 q-mt-sm" label="Select Type"></q-select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-step>
              </q-stepper>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
      v-model="optionsDialog">
      <q-card>
        <q-toolbar class="bg-primary text-white text-bold q-pa-md">
          <q-toolbar-title>Select An Option</q-toolbar-title>
          <q-btn icon="close" v-close-popup flat></q-btn>
        </q-toolbar>
        <q-card-section>
          <div class="row justify-center">
            <div class="col-lg-8 col-md-9 col-sm-11 col-xs-12 pa-2 ">
              <div class="row">
                <div class="col-12 q-pa-md">
                  <q-card @click="OpenAddDialog" v-close-popup style="min-height: 100px" class="rounded-borders bg-primary cursor-pointer">
                    <q-card-section style="min-height: 150px;min-width: 100%">
                      <div style="min-width: 100%" class="absolute-center text-center text-white text-bold text-h6"><q-avatar font-size="0.7em" class="q-mb-xs" icon="add" text-color="white" size="xl"></q-avatar>Add New Item</div>
                    </q-card-section>
                  </q-card>
                </div>
                <div @click="openAddToExistingDialog" class="col-12 q-pa-md">
                  <q-card style="min-height: 100px" class="rounded-borders bg-deep-orange-10 cursor-pointer">
                    <q-card-section style="min-height: 150px;min-width: 100%">
                      <div style="min-width: 100%" class="absolute-center text-center text-white text-bold text-h6"><q-avatar font-size="0.7em" class="q-mb-xs" icon="update" text-color="white" size="xl"></q-avatar>Add To Existing</div>
                    </q-card-section>
                  </q-card>
                </div>
                <div @click="openTransferDialog" class="col-12 q-pa-md">
                  <q-card style="min-height: 100px" class="rounded-borders bg-green-10 cursor-pointer">
                    <q-card-section style="min-height: 150px;min-width: 100%">
                      <div style="min-width: 100%" class="absolute-center text-center text-white text-bold text-h6"><q-avatar font-size="0.7em" class="q-mb-xs" icon="transfer_within_a_station" text-color="white" size="xl"></q-avatar>Transfer Item</div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
      v-model="dialogOpened">
      <q-card>
        <q-toolbar class="bg-primary text-white text-bold q-pa-md">
          <q-toolbar-title>Add New Item</q-toolbar-title>
          <q-btn icon="close" v-close-popup flat></q-btn>
        </q-toolbar>
        <q-card-section>
          <div class="row justify-center q-pt-md">
            <div class="col-lg-8 col-md-9 col-sm-11 col-xs-12 pa-2">
              <div class="row">
                <div class="col-12">
                  <simple-form-renderer :mobView="$props.isMobileView" @dataSaved="saveData" @closeDialog="dialogOpened = false" :form-details="formData"></simple-form-renderer>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <div class="row">
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-input :style="$props.isMobileView?'':'min-width: 50%;max-width: 50%'" v-model="search" label="Search For Item" outlined class="shadow-1"></q-input>
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <div :class="$props.isMobileView?'q-pt-md':'text-right'">
          <q-btn label="Search" @click="SearchProduct" color="primary"></q-btn>
        </div>
      </div>
      <div class="col-12 q-pt-lg">
        <q-table
          table-colspan="12"
          :grid="$props.isMobileView"
          :data="itemData"
          :pagination="{rowsPerPage:0}"
          :columns="productColumn"
          hide-bottom
          @row-click="editData"
          :hide-header="$props.isMobileView"
          card-class="text-body1 font-medium"
        >
          <template v-slot:body-cell="props">
            <q-td :props="props">
              <div class="q-py-lg">
                {{props.value}}
              </div>
            </q-td>
          </template>
        </q-table>
      </div>
      <div class="col-12 q-py-lg text-center text-h5 text-bold font-bold" v-if="itemData.length<=0">
        No Data Added Yet.
      </div>
      <div class="col-12 q-pt-lg">
        <div class="centerize">
          <q-pagination
            v-model="currentPage"
            :max="totalPage"
            :max-pages="5"
            :ellipses="false"
            :boundary-numbers="false"
            @click="getProducts"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import client from "../api/Client";
import FormData from "../api/formData";
import QuerySearchRenderer from '../components/QuerySearchRenderer.vue'
import HistoryViewerComponent from "components/HistoryViewerComponent";
export default {
  props:['isMobileView'],
  components:{
    HistoryViewerComponent,
    'query-search-renderer':QuerySearchRenderer
  },
  data(){
    return{
      confirmDeleteDialog:false,
      averageReorder:0,
      selectedProd:{},
      optionsStep:1,
      searchDialog:false,
      optionType:'update',
      optionsDialog:false,
      search:"",
      dialogOpened:false,
      api: client,
      formData:[],
      form: new FormData(),
      filter: '',
      productColumn:[
        {
          name: 'desc',
          required: true,
          label: 'Name',
          align: 'left',
          field: row => row.name,
          sortable: true
        },
        { name: 'Brand', align: 'center', label: 'Brand', field: row => row.brand.name, sortable: true },
        { name: 'Category', align: 'center', label: 'Category', field: row => row.category.name, sortable: true },
        { name: 'Total Stock', align: 'center', label: 'Total Stock', field: 'total_stock', sortable: true },
        { name: 'Total Amount', align: 'center', label: 'Total Amount', field: 'total_amount', sortable: true },
      ],
      columns: [
        {
          name: 'desc',
          required: true,
          label: 'Name',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
        { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
        { name: 'carbs', label: 'Carbs (g)', field: 'carbs' }
      ],
      dialogSearchColumn:[
        {
          name: 'desc',
          required: true,
          label: 'Name',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'stock', align: 'center', label: 'Stock', field: 'stock', sortable: true },
        { name: 'price', align: 'center', label: 'Price', field: 'price', sortable: true },
        { name: 'brand', align: 'center', label: 'Brand', field: 'brand', sortable: true },
        { name: 'supplier', align: 'center', label: 'Supplier', field: 'supplier', sortable: true },
      ],
      dialogSearchData: [
        {
          name:"Shibham Cement",
          stock:500,
          price:550,
          brand:"Shibham",
          supplier:"Cement Supplier"
        }
      ],
      data: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24
        },
        {
          name: 'FrozenYogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24
        },
        {
          name: 'Froz Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24
        },
      ],
      openProdDetailsDialog:false,
      prodDetailsTab:'details',
      dataMode:'add',
      selectedId:'',
      currentPage:1,
      totalPage:1,
      historyCurrent:1,
      historyTotal:1,
      historyData:[],
      itemData:[],
      supplierData:[],
      supplierCurrent:1,
      supplierTotal:1,
      queryProductOptions:{},
      optionLocationType:"",
      startingTransferLocation:"",
      endingTransferLocation:"",
      optionLocationTypes:['Group','Warehouse','Site'],
      selectedProduct:{
      },
      totalStock:0
    }
  },
  methods:{
    getIcon(item,type){
      if(item.warehouse){
        if(type === 'name')
          return 'Warehouse'
        else if(type === 'icon')
          return 'maps_home_work'
      }
      else if(item.group){
        if(type === 'name')
          return 'Group'
        else if(type === 'icon')
          return 'groups'
      }
      else if(item.site){
        if(type === 'name')
          return 'Site'
        else if(type === 'icon')
          return 'construction'
      }
    },
    putUpdate(){
      if(this.queryProductOptions.type === 'update'){
        delete this.queryProductOptions.warehouse_end
        delete this.queryProductOptions.site_end
        delete this.queryProductOptions.group_end
      }
      if(this.queryProductOptions.type === 'transfer'){
        delete this.queryProductOptions.supplier
      }
      this.api.postData('approval',this.queryProductOptions,"Approval Request Created").then((response)=>{
        this.searchDialog = false
        this.optionsDialog = false
        this.optionsStep = 1
      })
    },
    calculateTotal(){
      try{
        this.queryProductOptions.total_price = parseInt(this.queryProductOptions.retail_price)*parseInt(this.queryProductOptions.stock_count)
      }catch (e){
        this.queryProductOptions.total_price = 0
      }
    },
    warehouseSelected(data){
      let findInd = this.selectedProduct.warehouses.findIndex(i=>i.warehouse._id.toString() == data.details.value.toString())
      if(findInd>=0){
        this.queryProductOptions.retail_price = this.selectedProduct.warehouses[findInd].retail_price
        this.totalStock = this.selectedProduct.warehouses[findInd].stock_count
      }
      else {
        this.totalStock = 0
        if(this.optionType === 'transfer'){
          this.startingTransferLocation = ''
          this.endingTransferLocation = ''
          this.$q.notify({
            type: 'negative',
            color: 'negative',
            timeout: 1000,
            position: 'bottom',
            message: "No Items In Warehouse To Transfer"
          })
        }
        return
      }
      this.queryProductOptions.warehouse_start = data.details.value
    },
    groupSelected(data){
      let findInd = this.selectedProduct.groups.findIndex(i=>i.group._id.toString() == data.details.value.toString())
      if(findInd>=0){
        this.queryProductOptions.retail_price = this.selectedProduct.groups[findInd].retail_price
        this.totalStock = this.selectedProduct.groups[findInd].stock_count
      }
      else {
        this.totalStock = 0
        if(this.optionType === 'transfer'){
          this.startingTransferLocation = ''
          this.endingTransferLocation = ''
          this.$q.notify({
            type: 'negative',
            color: 'negative',
            timeout: 1000,
            position: 'bottom',
            message: "No Items In Groups To Transfer"
          })
        }
        return
      }
      this.queryProductOptions.group_start = data.details.value
    },
    siteSelected(data){
      let findInd = this.selectedProduct.sites.findIndex(i=>i.site._id.toString() == data.details.value.toString())
      if(findInd>=0){
        this.queryProductOptions.retail_price = this.selectedProduct.sites[findInd].retail_price
        this.totalStock = this.selectedProduct.sites[findInd].stock_count
      }
      else {
        this.totalStock = 0
        if(this.optionType === 'transfer'){
          this.startingTransferLocation = ''
          this.endingTransferLocation = ''
          this.$q.notify({
            type: 'negative',
            color: 'negative',
            timeout: 1000,
            position: 'bottom',
            message: "No Items In Site To Transfer"
          })
        }
        return
      }
      this.queryProductOptions.site_start = data.details.value
    },
    supplierSelected(data){
      this.queryProductOptions.supplier = data.details.value
    },
    warehouseEndSelected(data){
      this.queryProductOptions.warehouse_end = data.details.value
    },
    groupEndSelected(data){
      this.queryProductOptions.group_end = data.details.value
    },
    siteEndSelected(data){
      this.queryProductOptions.site_end = data.details.value
    },
    goBack(){
      this.optionsStep = 1
    },
    selectData(evt,row,ind){
      this.selectedId = row._id
      this.queryProductOptions = {
        warehouse_start:"",
        warehouse_end:"",
        supplier:"",
        group_start:"",
        group_end:"",
        site_start:"",
        site_end:"",
        product_id:row._id,
        stock_count:0,
        retail_price:0,
        isApproved:false,
        type:this.optionType,
        total_price:0
      }
      this.optionsStep = 2
      this.selectedProduct = row
    },
    rowClicked(evt, ...row){
      console.log(row)
    },
    openAddToExistingDialog(){
      this.optionsStep = 1
      this.optionType = 'update'
      this.optionLocationType = ""
      this.searchDialog = true
      this.optionsDialog = false
    },
    openTransferDialog(){
      this.optionsStep = 1
      this.optionType = 'transfer'
      this.startingTransferLocation = ''
      this.endingTransferLocation = ''
      this.searchDialog = true
      this.optionsDialog = false
    },
    openOptionsDialog(){
      this.optionsDialog = true
    },
    SearchProduct(){
      this.api.getData('product/search/'+this.search).then((response)=>{
        this.itemData = response.data
        this.currentPage = response.currentPage
        this.totalPage = response.totalPage
      })
    },
    getHistory(){
      this.api.getData('product/history/'+this.selectedProd._id+'/'+(this.historyCurrent-1)).then((resp)=>{
        this.historyData = resp.data
        this.historyCurrent = resp.currentPage
        this.historyTotal= resp.totalPage
      })
    },
    getSupplier(){
      this.api.getData('product/history/sales/'+this.selectedProd._id+'/'+(this.supplierCurrent-1)).then((resp)=>{
        this.supplierData = resp.data
        this.supplierCurrent = resp.currentPage
        this.supplierTotal= resp.totalPage
      })
    },
    prodDetailsTabChanged(){
      //get past history
      if(this.prodDetailsTab === 'history'){
        this.getHistory()
      }
      if(this.prodDetailsTab === 'supplier'){
        this.getSupplier()
      }
    },
    editData(evt,row,ind){
      this.selectedProd = row
      this.selectedId = row._id
      this.historyCurrent = 1
      this.historyTotal= 1
      this.historyData = []
      this.openProdDetailsDialog = true
      this.prodDetailsTab = 'details'
    },
    deleteProd(){
      console.log(this.selectedId)
      this.api.putData('product/delete/'+this.selectedId,{},"Product Deleted").then(()=>{
        this.getProducts()
      })
    },
    editProd(){
      let row = this.selectedProd
      this.api.getData('product/get/'+row._id).then((resp)=>{
        this.optionType = 'edit'
        this.formData = this.form.createEditObject(this.form.products_form,resp)
        this.selectedId = row._id
        this.dialogOpened = true
      })
    },
    OpenAddDialog(){
      this.formData = this.form.products_form
      this.optionType = 'add'
      this.dialogOpened = true
      this.searchDialog = false
      this.optionsDialog = false
    },
    getProducts(){
      this.api.getData('product/'+(this.currentPage-1)).then((response)=>{
        console.log(response.data)
        this.itemData = response.data
        this.currentPage = response.currentPage
        this.totalPage = response.totalPage
      })
    },
    saveData(data){
      let saveData = this.form.createPostObject(data)
      if(this.optionType === 'add'){
        this.api.postData('product',saveData,"Product Added").then((resp)=>{
          this.getProducts()
          this.dialogOpened = false
        })
      }
      if(this.optionType === 'edit'){
        this.api.putData('product/edit/'+this.selectedId,saveData,"Product Updated").then((resp)=>{
          this.getProducts()
          this.dialogOpened = false
        })
      }

    }
  },
  created(){
    this.getProducts()
  }
}
</script>
