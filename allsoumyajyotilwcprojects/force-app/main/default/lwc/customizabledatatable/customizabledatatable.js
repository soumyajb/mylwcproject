import { LightningElement,track } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent'
import getField from '@salesforce/apex/AccountDataProvider.getField';
import getAccount from '@salesforce/apex/AccountDataProvider.getAccount';

export default class Customizabledatatable extends LightningElement {

    @track headerObject=[];
    @track bodyObject=[];
    rowofrow=[];
    @track availableFields = [];
    defaultValues =
    [
    {label:'Salesforce.com Id',value: 'Id'},
    {label:'Name',value: 'Name'},
    {label:'Created Date',value: 'CreatedDate'}
    ];
    fieldsChosen = [];
    fieldsChosenAPI = [];
    currentConfig = [];
    //console.log(typeof currentConfig);
    
    showtable =false;
    showFieldChooserWindow =false;
    showSpinner = false;
    initdone=false;
    configupdate=true;
    
    showUpdatedFields(event)
    {
        
        this.bodyObject=[];
        this.headerObject = [];
        this.showtable =false;
        this.showFieldChooserWindow =false;
        this.showSpinner = true;
        console.log(JSON.stringify(this.fieldsChosen));
        getAccount({Fields:this.fieldsChosen}).then(data =>{
            try {
                console.table(data);
                data.forEach( row=>
                {
                console.log(JSON.stringify(row));
                
                let currentTempObject = {};
                Object.keys(row).forEach(fieldnamecurrent =>{
                    let lowercaseKey = fieldnamecurrent.toLowerCase();
                    currentTempObject[lowercaseKey] = row[fieldnamecurrent];
                })
                //console.table(row);
                //console.table(currentTempObject);
                //console.table(this.fieldsChosen);
                row = JSON.parse(JSON.stringify(currentTempObject));
                 let arrayofRowElements = [];
                 if(!(this.fieldsChosen.includes('id') || this.fieldsChosen.includes('Id')))
                 this.fieldsChosen.push('id');//added as Id will be absolutely queried as per design of apex

                 this.fieldsChosen.forEach((key,index)=>{
                    let found=false;
                    Object.keys(row).forEach((fielname)=>{
                        //console.log(`fielname.toLowerCase() : ${fielname.toLowerCase()} and key.toLowerCase: ${key.toLowerCase}`);
                        if(fielname.toLowerCase() === key.toLowerCase())
                        {
                            found=true;
                            let currentColumnValue = row[fielname];
                            let currentkeyPair={key : fielname,value :  currentColumnValue};
                            arrayofRowElements.push(currentkeyPair);
                            
                        }
                    })
                    if(found===false)
                    {
                        let currentkeyPair={key: key,value : ''};
                        arrayofRowElements.push(currentkeyPair);
                    }
                    
                    
                })
                this.bodyObject.push({id:row.id,values:arrayofRowElements});
                
                })
                    

               
                this.fieldsChosen.forEach((tableheader,indexofelement)=>{
                    this.headerObject.push({index:indexofelement,key :tableheader});
                })
                this.bodyObject = JSON.parse(JSON.stringify(this.bodyObject));
                this.headerObject = JSON.parse(JSON.stringify(this.headerObject));
                //console.clear();
                //console.table(JSON.parse(JSON.stringify(this.bodyObject)));
                //console.table(JSON.parse(JSON.stringify(this.headerObject)));
                this.showtable =true;
                this.showFieldChooserWindow =false;
                this.showSpinner = false;

            } catch (error) {
                //console.log(error);
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error happened while retreiving the records',
                    message: 'Error while retrieving the records.'+error,
                    variant: 'error'
                }));
                this.showtable =false;
                this.showFieldChooserWindow =false;
                this.showSpinner = false;
            }
        })
        
    }
    triggerUpdateField()
    {
        let populateEvent = new CustomEvent('triggerpopulate',{detail:{eventtrigger:'triggerUpdateField'}});
        this.dispatchEvent(populateEvent);
    }
    


    openFieldChooser(event){
        //console.log('opening the Field Picker');
        this.showtable =false;
        this.showFieldChooserWindow =false;
        this.showSpinner = true;       
        getField({ObjectName: 'Account'}).then(data=> {
        
        //console.log(data);
        data.forEach(element => {
            let currentOptionObject = {label:element.Label,value:element.Value};
            
            this.availableFields.push(currentOptionObject);
            
        });
        //console.log(JSON.stringify(this.availableFields));
        //console.table(this.availableFields);
        this.showFieldChooserWindow = true;
        this.showtable = false;
        }).catch(error =>{
            let errorEvent = new ShowToastEvent({
                title: 'Error occured',
                message:
                    'Error occured while fetching the Field List. Error: '+error,
                variant:'error'
            });
            
            this.dispatchEvent(errorEvent);
            //console.log(error);
        })

    }
    cancelModal(event)
    {
        
        this.showtable=true;
        this.showFieldChooserWindow=false;
    }
    handlechange(event)
    {
    
        try {
            let data = event.detail.value;
            this.configupdate=true;          
            this.fieldsChosen = [...data];
           
            

        }
        catch(e)
        {
            
            let errorEvent = new ShowToastEvent({
                title: 'Error occured',
                message:
                    'Error occured while updating requested field. Error: '+error,
                variant:'error'
            });
            
            this.dispatchEvent(errorEvent);
            ;
        }
        

    }
    



        connectedCallback()
    {
        this.addEventListener("triggerpopulate",this.ontriggerPopulate,false)
        const triggerpoint = "connectedCallback";
        let populateEvent = new CustomEvent('triggerpopulate',{detail:{eventtrigger:triggerpoint}});
        this.dispatchEvent(populateEvent);
    }
        ontriggerPopulate(event)
        {
            let eventstring= JSON.stringify(event.detail['eventtrigger']);
            console.log(`Trigger Populate is called from ${eventstring}`);
            try{
                    if(eventstring === "\"connectedCallback\"")
                    {
                        //console.log(`The details  : ${localStorage.getItem('previousConfig')}`);
                        try{
                            this.currentConfig = JSON.parse(localStorage.getItem('previousConfig'));
                            console.log(this.currentConfig);
                            if(this.currentConfig != null)
                            {
                                console.log('Existing config exists');
                                //this.currentConfig.split(',')
                                this.fieldsChosen  =  [...Array.from(this.currentConfig)];
                            }else
                            {
                                this.fieldsChosen = ['name','phone','email','website'];
                            }
                            this.showUpdatedFields();
                        }
                            catch(e)
                            {
                                console.log(e);
                            }
                    }
                    if(eventstring === "\"triggerUpdateField\"")
                    {
                        localStorage.setItem('previousConfig', JSON.stringify(this.fieldsChosen));
                        console.log(localStorage.getItem('previousConfig'));
                        this.showUpdatedFields();
                    }
                
                
            
                
                
           
            
            }
            catch(e)
            {
                    console.log(e);
            }
        }
}