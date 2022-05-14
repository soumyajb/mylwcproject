import { LightningElement ,wire, api, track} from 'lwc';

import getAccount from '@salesforce/apex/AccountDataProvider.getAccount';
import getField from '@salesforce/apex/AccountDataProvider.getField';
import refreshApex from '@salesforce/apex';

export default class Dragdroptable extends LightningElement {

    @track columnObject=[];
    renderTemplate=false;
    bodyObject=[];
    currentConfig = [];
    attachedEventHandler=false;
    currentFieldConfig = [];
    showFieldChooser=false;
    fieldoptions  = [];
    actualdata ;
    firstrun=true;
    finalData =[];
    currentIndex=999;

    skipIndex()
    {
        if(this.currentIndex ==0 || this.currentIndex ==0)
        return true;
        else
        return false;
    }



    connectedCallback()
    {
        getAccount({Fields: this.currentFieldConfig})
        .then(result =>{
            console.log(result);
            this.handleData(result);
        })
        .catch(error=>{
            console.warn('DATA LOAD FAILED'+JSON.stringify(error));
        })

        
    }

     
    
    @wire(getField,{ObjectName:'Account'})
    handleFields({data,error})
    {
        if(data)
        {
            console.table(data);
                data.forEach(elem =>{
                    
                    this.fieldoptions.push({label: elem.Label, value: elem.Value});
                })

        }
        else if(error)
        {
                console.log(error);
        }
    }

    renderedCallback()
    {
        if(!this.attachedEventHandler)
        {
                debugger;
                console.log(this.template.querySelector('lightning-button[data-my-id=fieldchooser]'));
                //this.template.querySelector('lightning-button').attachedEventHandler('onclick',this.openFieldChooser);
                this.attachedEventHandler=true;
        }
    }
    
    openFieldChooser()
    {
        this.showFieldChooser=true;

    }
    changedfieldchooser(e)
    {
        try{
            debugger;
            this.renderTemplate=false;
            console.log(e.detail.value);
            let accounts = JSON.parse(JSON.stringify(e.detail.value))
            console.table(accounts);
            this.currentFieldConfig = Object.values(accounts);
            console.log(this.currentFieldConfig);
            getAccount({Fields: this.currentFieldConfig})
            .then(result =>{
                this.renderTemplate=true
                this.handleData(result);

            })
            .catch(error=>{
                this.renderTemplate = false;
                console.warn('DATA LOAD FAILED'+error);
                const evt = new ShowToastEvent({
                    title: 'Load of Details Failed',
                    message: error,
                    variant: 'error',
                });

                this.dispatchEvent(evt);
        
            })
            
            this.showFieldChooser=false;
            
            
        }
        catch(e)
        {
            console.log(e)
        }
        
        
    }

    handleData(result)
    {
        console.table(result);
        const data=result;
        
         //   console.clear();
            console.table(data);
            this.currentConfig = sessionStorage.getItem("DragdroptableConfig");
            this.columnObject = [];
            this.bodyObject = [];
            if(this.currentConfig==null)
            {
                console.log('No existing customization config');
                data.every((acc,index)=>{
                        debugger;
                        console.log(JSON.stringify(acc));
                            Object.keys(acc).forEach(key=>{
                        
                            let currentObject = {};
                            currentObject.Id = key;
                            currentObject.name = key;
                            
                            this.columnObject.push(currentObject);
                            this.currentFieldConfig.push(key);
                            
                            
                            } );
                        

                    return;
                });

                

            };
            
                data.forEach((acc,index)=>{
                let currentRow = {};
                let tempcurrentRow = {};
                currentRow = {...acc};
                this.currentFieldConfig.forEach((elem,indexfieldconfig)=>{
                debugger;
                tempcurrentRow[elem]=currentRow[elem];
                tempcurrentRow.rowclass = "row-"+acc.Id+"-"+index;
                tempcurrentRow.cellclass = "cell-"+acc.Id+"-"+index;
            })
                console.table(tempcurrentRow);
                this.bodyObject.push(tempcurrentRow);
                })
                
            
            debugger;
            console.table(this.columnObject)            ;
            data.forEach(element => {
                console.log('Id:'+element.Id);
            });
            this.getFormattedData();
            this.renderTemplate = true;
        
    }
    renderedCallback()
    {   
       
    }

    getFormattedData()
    {
        
        let counter=0;
        this.bodyObject.forEach(elemoutter=>{
            let currentObject =[];
            //currentObject.push(elemoutter.rowclass);
            currentObject.push(elemoutter.Id);
            this.columnObject.forEach(elem=>{
                console.log(`the key is ${elem}`);
                currentObject.push(elemoutter[elem]);

            })
            this.finalData.push(currentObject);
            //console.clear();
            console.table(this.finalData);
        })
        
    }

}