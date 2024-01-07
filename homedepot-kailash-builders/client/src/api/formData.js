export default class FormData{

  group_form = [
    {
      step: "1",
      name: "Basic Details",
      isShown: true,
      qDetails: [
        {
          topLabel:"Name",
          comment:"Enter Name",
          dat_name:["name"],
          details:"",
          placeHolder:"",
          type:"text",
          inputType:"text"
        },
        {
          topLabel:"Location",
          comment:"Enter Location",
          dat_name:["location"],
          details:"",
          placeHolder:"",
          type:"text",
          inputType:"text"
        },
        {
          topLabel: "Select Warehouse",
          type: "querySearch",
          query: "warehouse_search",
          details:"",
          dat_name: ['warehouse'],
        },
        {
          topLabel: "Select Site",
          type: "querySearch",
          query: "site_search",
          details:"",
          dat_name: ['site'],
        },
      ]
    }
  ]

  receipt_form = [
    {
      step: "1",
      name: "Basic Details",
      isShown: true,
      qDetails: [
        {
          topLabel:"Receipt Date",
          comment:"Receipt Date",
          dat_name:["receipt_date"],
          details:"",
          placeHolder:"",
          type:"text",
          inputType:"date"
        },
        {
          topLabel:"Name",
          comment:"Enter Name",
          dat_name:["name"],
          details:"",
          placeHolder:"",
          type:"text",
          inputType:"text"
        },
        {
          topLabel: "Select Supplier",
          type: "querySearch",
          query: "supplier_search",
          details:"",
          dat_name: ['supplier'],
        },
        {
          topLabel:"Image",
          comment:"Add Image",
          dat_name:["image"],
          details:"",
          placeHolder:"",
          type:"fileUpload",
        },
        {
          topLabel:"Total Amount",
          comment:"Total Amount",
          dat_name:["total_amount"],
          details:"",
          placeHolder:"",
          type:"text",
          inputType:"number"
        },
      ]
    }
  ]

  machine_form = [
    {
      step: "1",
      name: "Basic Details",
      isShown: true,
      qDetails: [
        {
          topLabel:"Name",
          comment:"Enter Name",
          dat_name:["name"],
          details:"",
          placeHolder:"",
          type:"text",
          inputType:"text"
        },
        {
          topLabel:"Vehicle No",
          comment:"Enter Vehicle No",
          dat_name:["vehicleNo"],
          details:"",
          placeHolder:"",
          type:"text",
          inputType:"text"
        },
      ]
    }
  ]

  products_form = [
    {
      step:"1",
      name:"Basic Details",
      isShown:true,
      qDetails:[
        {
          topLabel:"Name",
          comment:"Enter Name",
          dat_name:["name"],
          details:"",
          placeHolder:"",
          type:"text",
          inputType:"text"
        },
        {
          topLabel: "Select Brand",
          type: "querySearch",
          query: "brand_search",
          details:"",
          dat_name: ['brand'],
        },
        {
          topLabel: "Select Category",
          type: "querySearch",
          query: "category_search",
          details:"",
          dat_name: ['category'],
        },
        {
          topLabel: "Warehouse Details",
          type: "warehouse_data",
          category:"",
          details:[],
          dat_name: ['warehouses'],
        },
        {
          topLabel: "Group Details",
          type: "group_data",
          category:"",
          details:[],
          dat_name: ['groups'],
        },
        {
          topLabel: "Site Details",
          type: "site_data",
          category:"",
          details:[],
          dat_name: ['sites'],
        },
        {
          topLabel:"Tax",
          comment:"Enter Tax in %",
          dat_name:["tax"],
          details:"",
          placeHolder:"",
          type:"text",
          inputType:"number"
        },
      ]
    },
  ]

  warehouse_form = [
    {
      step:"1",
      name:"Basic Details",
      isShown:true,
      qDetails:[
        {
          topLabel:"Name of the warehouse",
          comment:"Enter Name",
          dat_name:["name"],
          details:"",
          placeHolder:"",
          type:"text",
          inputType:"text"
        },
        {
          topLabel:"City/Town",
          comment:"City/Town",
          dat_name:["city"],
          details:"",
          placeHolder:"",
          type:"text",
          inputType:"text"
        },
        {
          topLabel:"State",
          comment:"State",
          dat_name:["state"],
          details:"",
          placeHolder:"",
          type:"text",
          inputType:"text"
        },
        {
          topLabel:"Street Name",
          comment:"Street Name",
          dat_name:["street"],
          details:"",
          placeHolder:"",
          type:"text",
          inputType:"text"
        },
        {
          topLabel: "Select Warehouse Admin",
          type: "querySearch",
          query: "user_search",
          details:"",
          dat_name: ['warehouse_owner'],
        },
        {
          topLabel:"Mobile Number",
          comment:"Mobile Number",
          dat_name:["mobile_number"],
          details:"",
          placeHolder:"",
          type:"text",
          inputType:"text"
        }
      ]
    }
  ]

  site_form = [
    {
      step:"1",
      name:"Basic Details",
      isShown:true,
      qDetails:[
        {
          topLabel:"Name of the Site",
          comment:"Enter Name",
          dat_name:["name"],
          details:"",
          placeHolder:"",
          type:"text",
          inputType:"text"
        },
        {
          topLabel:"City/Town",
          comment:"City/Town",
          dat_name:["city"],
          details:"",
          placeHolder:"",
          type:"text",
          inputType:"text"
        },
        {
          topLabel:"State",
          comment:"State",
          dat_name:["state"],
          details:"",
          placeHolder:"",
          type:"text",
          inputType:"text"
        },
        {
          topLabel:"Street Name",
          comment:"Street Name",
          dat_name:["street"],
          details:"",
          placeHolder:"",
          type:"text",
          inputType:"text"
        },
        {
          topLabel:"Add An Image Of The Site",
          comment:"Add Image",
          dat_name:["image"],
          details:"",
          placeHolder:"",
          type:"fileUpload",
        },
        {
          topLabel:"Enter Starting Date",
          comment:"Starting Date",
          dat_name:["starting_date"],
          details:"",
          placeHolder:"",
          type:"text",
          inputType:"date"
        },
        {
          topLabel:"Enter Estimated Completion Date",
          comment:"Completion Date",
          dat_name:["estimated_completion_date"],
          details:"",
          placeHolder:"",
          type:"text",
          inputType:"date"
        },
        {
          topLabel:"Enter Allocated Budget [Optional]",
          comment:"Allocated Budget",
          dat_name:["allocated_budget"],
          details:"",
          placeHolder:"",
          type:"text",
          inputType:"number"
        }
      ]
    }
  ]

  client_form = [
      {
          step:"1",
          name:"Basic Details",
          isShown:true,
          qDetails:[
              {
                  topLabel:"Title",
                  comment:"Title",
                  dat_name:["title"],
                  freeTextEnabled:false,
                  options:[
                      {
                          label:"Mr.",
                          value:"Mr."
                      },
                      {
                          label:"Mrs.",
                          value:"Mrs."
                      },
                      {
                          label:"Miss.",
                          value:"Miss."
                      },
                      {
                          label:"Free Text",
                          value:"Free Text"
                      },
                  ],
                  details:"",
                  type:"select"
              },
              {
                  topLabel:"Full Name",
                  comment:"Full Name",
                  dat_name:["full_name"],
                  details:"",
                  placeHolder:"",
                  type:"text",
                  inputType:"text"
              },
              {
                  topLabel:"NHI Number",
                  comment:"NHI Number",
                  dat_name:["nhi_number"],
                  details:"",
                  placeHolder:"",
                  type:"text",
                  inputType:"text"
              },
              {
                  topLabel:"Ethnicity",
                  comment:"Ethnicity",
                  dat_name:["ethnicity"],
                  freeTextEnabled:false,
                  options:[
                      {
                          label:"Mr.",
                          value:"Mr."
                      },
                      {
                          label:"Mrs.",
                          value:"Mrs."
                      },
                      {
                          label:"Miss.",
                          value:"Miss."
                      },
                      {
                          label:"Free Text",
                          value:"Free Text"
                      },
                  ],
                  details:"",
                  type:"select"
              },
              {
                  topLabel:"Date Of Birth",
                  comment:"Date Of Birth",
                  dat_name:["dob"],
                  details:"",
                  placeHolder:"",
                  type:"text",
                  inputType:"date"
              },
              {
                  topLabel:"How Did You Hear About Us",
                  comment:"How Did You Hear About Us",
                  dat_name:"referral_source",
                  freeTextEnabled:false,
                  options:[
                      {
                          label:"Mr.",
                          value:"Mr."
                      },
                      {
                          label:"Mrs.",
                          value:"Mrs."
                      },
                      {
                          label:"Miss.",
                          value:"Miss."
                      },
                      {
                          label:"Free Text",
                          value:"Free Text"
                      },
                  ],
                  details:"",
                  type:"select"
              },
              {
                  topLabel:"Driving Licence Number",
                  comment:"Driving Licence Number",
                  dat_name:["driving_license"],
                  details:"",
                  placeHolder:"",
                  type:"text",
                  inputType:"text"
              },
              {
                  topLabel:"Occupation",
                  comment:"Occupation",
                  dat_name:["occupation"],
                  details:"",
                  placeHolder:"",
                  type:"text",
                  inputType:"text"
              },
              {
                  topLabel:"Gender",
                  comment:"Gender",
                  dat_name:["gender"],
                  freeTextEnabled:false,
                  options:[
                      {
                          label:"Male",
                          value:"Male"
                      },
                      {
                          label:"Female",
                          value:"Female"
                      },
                      {
                          label:"Others",
                          value:"Others"
                      },
                      {
                          label:"Free Text",
                          value:"Free Text"
                      },
                  ],
                  details:"",
                  type:"radio"
              },
          ]
      },
      {
          step:"2",
          name:"Contact And Location",
          isShown:true,
          qDetails:[
              {
                  topLabel:"Email",
                  comment:"Email",
                  dat_name:["email"],
                  details:"",
                  placeHolder:"",
                  type:"text",
                  inputType:"text"
              },
              {
                  topLabel:"City/Town",
                  comment:"City/Town",
                  dat_name:["client_contact","city"],
                  details:"",
                  placeHolder:"",
                  type:"text",
                  inputType:"text"
              },
              {
                  topLabel:"State",
                  comment:"State",
                  dat_name:["client_contact","state"],
                  details:"",
                  placeHolder:"",
                  type:"text",
                  inputType:"text"
              },
              {
                  topLabel:"Street Name",
                  comment:"Street Name",
                  dat_name:["client_contact","street"],
                  details:"",
                  placeHolder:"",
                  type:"text",
                  inputType:"text"
              },
              {
                  topLabel:"Suburb",
                  comment:"Suburb",
                  dat_name:["client_contact","suburb"],
                  details:"",
                  placeHolder:"",
                  type:"text",
                  inputType:"text"
              },
              {
                  topLabel:"Postal Code",
                  comment:"Postal Code",
                  dat_name:["client_contact","postal_code"],
                  details:"",
                  placeHolder:"",
                  type:"text",
                  inputType:"text"
              },
              {
                  topLabel:"Mobile Number",
                  comment:"Mobile Number",
                  dat_name:["client_contact","mobile_number"],
                  details:"",
                  placeHolder:"",
                  type:"text",
                  inputType:"text"
              },
              {
                  topLabel:"Landline Number",
                  comment:"Landline Number",
                  dat_name:["client_contact","landline_number"],
                  details:"",
                  placeHolder:"",
                  type:"text",
                  inputType:"text"
              },
          ]
      },
      {
          step:"3",
          name:"Additional Details",
          isShown:true,
          qDetails:[
              {
                  topLabel:"Keen's Title",
                  comment:"Keen's Title",
                  dat_name:["client_keen","title"],
                  freeTextEnabled:false,
                  options:[
                      {
                          label:"Mr.",
                          value:"Mr."
                      },
                      {
                          label:"Mrs.",
                          value:"Mrs."
                      },
                      {
                          label:"Miss.",
                          value:"Miss."
                      },
                      {
                          label:"Free Text",
                          value:"Free Text"
                      },
                  ],
                  details:"",
                  type:"select"
              },
              {
                  topLabel:"Keen's Full Name",
                  comment:"Keen's Full Name",
                  dat_name:["client_keen","full_name"],
                  details:"",
                  placeHolder:"",
                  type:"text",
                  inputType:"text"
              },
              {
                  topLabel:"Keen's Relationship",
                  comment:"Keen's Relationship",
                  dat_name:["client_keen","relationship"],
                  details:"",
                  placeHolder:"",
                  type:"text",
                  inputType:"text"
              },
              {
                  topLabel:"Power Of Attorney Letter",
                  comment:"Power Of Attorney Letter",
                  dat_name:["client_keen","power_of_attorney"],
                  freeTextEnabled:false,
                  options:[
                      {
                          label:"Yes",
                          value:true
                      },
                      {
                          label:"No",
                          value:false
                      }
                  ],
                  details:null,
                  type:"select"
              },
          ]
      },
  ]
  category_form = [
      {
          step:"1",
          name:"Basic Details",
          isShown:true,
          qDetails:[
              {
                  topLabel:"New Category Name",
                  comment:"New Category Name",
                  dat_name:["name"],
                  details:"",
                  placeHolder:"",
                  type:"text",
                  inputType:"text"
              },
              {
                topLabel:"New Measurement Unit",
                comment:"Enter Measurement Unit",
                dat_name:["type"],
                details:"",
                placeHolder:"",
                type:"text",
                inputType:"text"
              },
          ]
      }
  ]
  brand_form = [
      {
          step:"1",
          name:"Basic Details",
          isShown:true,
          qDetails:[
              {
                  topLabel:"Brand Name",
                  comment:"New Brand Name",
                  dat_name:["name"],
                  details:"",
                  placeHolder:"",
                  type:"text",
                  inputType:"text"
              },
          ]
      }
  ]
  supplier_form = [
      {
          step:"1",
          name:"Basic Details",
          isShown:true,
          qDetails:[
              {
                  topLabel:"Supplier Name",
                  comment:"Supplier Name",
                  dat_name:["name"],
                  details:"",
                  placeHolder:"",
                  type:"text",
                  inputType:"text"
              },
              {
                  topLabel:"State",
                  comment:"State",
                  dat_name:["state"],
                  details:"",
                  placeHolder:"",
                  type:"text",
                  inputType:"text"
              },
              {
                topLabel:"City/Town",
                comment:"City/Town",
                dat_name:["city"],
                details:"",
                placeHolder:"",
                type:"text",
                inputType:"text"
              },
              {
                  topLabel:"Street Name",
                  comment:"Street Name",
                  dat_name:["street"],
                  details:"",
                  placeHolder:"",
                  type:"text",
                  inputType:"text"
              },
              {
                  topLabel:"Mobile Number",
                  comment:"Mobile Number",
                  dat_name:["phone"],
                  details:"",
                  placeHolder:"",
                  type:"text",
                  inputType:"text"
              },
          ]
      }
  ]
  product_form = [
      {
          step:"1",
          name:"Basic Details",
          isShown:true,
          qDetails:[
              {
                  topLabel:"Product Name",
                  comment:"Product Name",
                  dat_name:["name"],
                  details:"",
                  placeHolder:"",
                  type:"text",
                  inputType:"text"
              },
              {
                  topLabel:"Product Barcode",
                  comment:"Product Barcode",
                  dat_name:["barcode"],
                  details:"",
                  placeHolder:"",
                  type:"text",
                  inputType:"text"
              },
              {
                  topLabel:"Category",
                  type:"querySearch",
                  query:"category_search",
                  dat_name:['category'],
                  details:""
              },
              {
                  topLabel:"Brand",
                  type:"querySearch",
                  query:"brand_search",
                  dat_name:['brand'],
                  details:""
              },
              {
                  topLabel: "Retail Price",
                  comment: "Retail Price",
                  dat_name: ["retail_price"],
                  details: "",
                  placeHolder: "",
                  type: "text",
                  inputType: "number"
              },
              {
                  topLabel: "Special Price",
                  comment: "Special Price",
                  dat_name: ["special_price"],
                  details: "",
                  placeHolder: "",
                  type: "text",
                  inputType: "number"
              },
              {
                  topLabel: "Tax (In %)",
                  comment: "Tax",
                  dat_name: ["tax"],
                  details: "",
                  placeHolder: "In %",
                  type: "text",
                  inputType: "number"
              },
          ]
      },
      {
          step: "2",
          name: "Supplier Details",
          isShown:true,
          qDetails: [
              {
                  topLabel:"Supplier",
                  type:"querySearch",
                  query:"supplier_search",
                  dat_name:['supplier'],
                  details:""
              },
              {
                  topLabel: "Supplier Price",
                  comment: "Supplier Price",
                  dat_name: ["supplier_price"],
                  details: "",
                  placeHolder: "",
                  type: "text",
                  inputType: "number"
              },
              {
                  topLabel: "Initial Stock",
                  comment: "Initial Stock",
                  dat_name: ["stock"],
                  details: "",
                  placeHolder: "",
                  type: "text",
                  inputType: "number"
              },
              {
                  topLabel: "Reorder Point",
                  comment: "Reorder Point",
                  dat_name: ["reorder_point"],
                  details: "",
                  placeHolder: "",
                  type: "text",
                  inputType: "number"
              },
              {
                  topLabel:"Enable Retail Sales",
                  comment: "Enable Retail Sales",
                  dat_name:["enable_retail_sales"],
                  type: "switch",
                  details:true
              },
              {
                  topLabel:"Enable Stock Control",
                  comment: "Enable Stock Control",
                  dat_name:["enable_stock_control"],
                  type: "switch",
                  details:true
              }
          ]
      }
  ]
  services_form = [
      {
          step:"1",
          name:"Basic Details",
          isShown:true,
          qDetails:[
              {
                  topLabel:"Service Name",
                  comment:"Service Name",
                  dat_name:["name"],
                  details:"",
                  placeHolder:"",
                  type:"text",
                  inputType:"text"
              },
              {
                  topLabel:"Service Category",
                  type:"querySearch",
                  query:"services_search",
                  dat_name:['category'],
                  details:""
              },
              {
                  topLabel: "Retail Price",
                  comment: "Retail Price",
                  dat_name: ["retail_price"],
                  details: "",
                  placeHolder: "",
                  type: "text",
                  inputType: "number"
              },
              {
                  topLabel: "Duration (in Minutes)",
                  comment: "Duration",
                  dat_name: ["duration"],
                  details: "",
                  placeHolder: "",
                  type: "text",
                  inputType: "number"
              },
              {
                  topLabel: "Tax (in %)",
                  comment: "Tax (in %)",
                  dat_name: ["tax"],
                  details: "",
                  placeHolder: "",
                  type: "text",
                  inputType: "number"
              },
              {
                  topLabel: "Service Description",
                  comment: "Service Description",
                  dat_name: ["description"],
                  details: "",
                  placeHolder: "",
                  type: "text",
                  inputType: "text"
              },
          ]
      },
      {
          step: "2",
          name: "Additional Details",
          isShown:true,
          qDetails: [
              {
                  dat_name: ["available_for"],
                  topLabel: "Available For",
                  comment: "Available For",
                  type: "staff_select",
                  details: []
              },
              {
                  topLabel:"Enable Online Bookings",
                  comment: "Enable Online Bookings",
                  dat_name:["enable_online_bookings"],
                  type: "switch",
                  details:true
              },
              {
                  topLabel:"Voucher Sales",
                  comment: "Voucher Sales",
                  dat_name:["voucher_sales"],
                  type: "switch",
                  details:true
              },
              {
                  topLabel:"Commissions",
                  comment: "Commissions",
                  dat_name:["commissions"],
                  type: "switch",
                  details:true
              },
          ]
      }
  ]
  user_form = [
    {
      step:"1",
      name:"Basic Information",
      isShown:true,
      qDetails:[
        {
          topLabel:"Email",
          comment:"Email",
          dat_name:["email"],
          details:"",
          placeHolder:"",
          type:"text",
          inputType:"text"
        },
        {
          topLabel:"Password",
          comment:"Password",
          dat_name:["password"],
          details:"",
          placeHolder:"",
          type:"text",
          inputType:"password"
        },
        {
          topLabel:"Title",
          comment:"Title",
          dat_name:["title"],
          freeTextEnabled:false,
          options:[
            {
              label:"Mr.",
              value:"Mr."
            },
            {
              label:"Mrs.",
              value:"Mrs."
            },
            {
              label:"Miss.",
              value:"Miss."
            },
            {
              label:"Free Text",
              value:"Free Text"
            },
          ],
          details:"",
          type:"select"
        },
        {
          topLabel:"Full Name",
          comment:"First Name",
          dat_name:["full_name"],
          details:"",
          placeHolder:"",
          type:"text",
          inputType:"text"
        },
        {
          topLabel:"Date Of Birth",
          comment:"Date Of Birth",
          dat_name:["dob"],
          details:"",
          placeHolder:"",
          type:"text",
          inputType:"date"
        },
        {
          topLabel:"Gender",
          comment:"Gender",
          dat_name:["gender"],
          freeTextEnabled:false,
          options:[
            {
              label:"Male",
              value:"Male"
            },
            {
              label:"Female",
              value:"Female"
            },
            {
              label:"Others",
              value:"Others"
            },
            {
              label:"Free Text",
              value:"Free Text"
            },
          ],
          details:"",
          type:"radio"
        },
        {
          topLabel:"Is This An Admin Account?",
          comment:"Is This An Admin Account?",
          dat_name:["isAdmin"],
          details:false,
          placeHolder:"",
          type:"switch",
          inputType:"date"
        },
      ]
    },
    {
      step: "2",
      name: "Contacts/Location",
      isShown: true,
      qDetails:[
        {
          topLabel:"City/Town",
          comment:"City/Town",
          dat_name:["user_contact","city"],
          details:"",
          placeHolder:"",
          type:"text",
          inputType:"text"
        },
        {
          topLabel:"Street Name",
          comment:"Street Name",
          dat_name:["user_contact","street"],
          details:"",
          placeHolder:"",
          type:"text",
          inputType:"text"
        },
        {
          topLabel:"Mobile Number",
          comment:"Mobile Number",
          dat_name:["user_contact","mobile_number"],
          details:"",
          placeHolder:"",
          type:"text",
          inputType:"text"
        }
      ]
    },
    {
      step: "3",
      name: "Additional Details",
      isShown: true,
      qDetails: [
        {
          topLabel: "Select Warehouse",
          type: "querySearch",
          query: "warehouse_search",
          details:"",
          dat_name: ['warehouse'],
        },
        {
          topLabel:"Salary Start Date",
          comment:"Salary Start Date",
          dat_name:["salary_start_date"],
          details:"",
          placeHolder:"",
          type:"text",
          inputType:"date"
        },
        {
          topLabel:"Enter Monthy Salary",
          comment:"Monthy Salary",
          dat_name:["monthly_salary"],
          details:"",
          placeHolder:"",
          type:"text",
          inputType:"number"
        },
      ]
    }
  ]

  findAndReturnDetails(details,value){
    for(let key in details){
      if(typeof details[key] === 'object'){
        for(let subKey in details[key]){
          if(subKey === value){
            if(typeof details[key][subKey] === 'string' && details[key][subKey] !== ''){
              return details[key][subKey]
            }
          }
        }
      }
      else {
        if(key === value && typeof details[key] === 'string' && details[key] !== ''){
          return details[key]
        }
      }
    }

    return null
  }

  createPostObject(form_data){
    let final = {}
    for(let i=0;i<form_data.length;i++){
      for(let j=0;j<form_data[i].qDetails.length;j++){
        if(form_data[i].qDetails[j].dat_name.length === 2){
          let first = form_data[i].qDetails[j].dat_name[0]
          let second = form_data[i].qDetails[j].dat_name[1]
          if(!final[first]){
            final[first] = {}
          }
          if(form_data[i].qDetails[j].details){
            final[first][second] = form_data[i].qDetails[j].details
            //!final[first][second]?final[first][second] = form_data[i].qDetails[j].details:final[first][second] +=' ' + form_data[i].qDetails[j].details
          }
        }
        else if(form_data[i].qDetails[j].dat_name.length === 1) {
          if(form_data[i].qDetails[j].details){
            final[form_data[i].qDetails[j].dat_name[0]] = form_data[i].qDetails[j].details
            //!final[form_data[i].qDetails[j].dat_name[0]]?final[form_data[i].qDetails[j].dat_name[0]] = form_data[i].qDetails[j].details:final[form_data[i].qDetails[j].dat_name[0]] += ' ' +  form_data[i].qDetails[j].details
          }
        }
      }
    }
    return final
  }

  createEditObject(form,details){
    let form_data = form
    let ignoredVars = ['_id','deleted_at','created_at','updated_at','_v']
    for(let key in details){
      if(key === "warehouses"){
        for(let y=0;y<form_data.length;y++){
          let ind = form_data[y].qDetails.findIndex(m=>m.dat_name.includes(key))
          if(ind>=0){
            form_data[y].qDetails[ind].details = details[key]
          }
        }
      }
      if(!ignoredVars.includes(key) && typeof details[key] === 'object'){
        for(let i=0;i<form_data.length;i++){
          let ind = form_data[i].qDetails.findIndex(k=>k.dat_name.includes(key))
          if(ind>=0){
            for(let subKey in details[key]){
              for(let j=0;j<form_data.length;j++){
                let subInd = form_data[j].qDetails.findIndex(l=>l.dat_name.includes(subKey))
                if(!ignoredVars.includes(subKey) && subInd>0){
                  form_data[j].qDetails[subInd].details = details[key][subKey]
                }
              }
            }
          }
        }
      }
      else if(!ignoredVars.includes(key)){
        for(let y=0;y<form_data.length;y++){
          let ind = form_data[y].qDetails.findIndex(m=>m.dat_name.includes(key))
          if(ind>=0){
            if(form_data[y].qDetails[ind].type==='text' && form_data[y].qDetails[ind].inputType==='date'){
              form_data[y].qDetails[ind].details = details[key].substring(0,10)
              console.log(details[key])
            }
            else {
              form_data[y].qDetails[ind].details = details[key]
            }

          }
        }
      }
    }
    return form_data
  }
}
