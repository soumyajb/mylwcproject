import { LightningElement,track } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent'
import getField from '@salesforce/apex/AccountDataProvider.getField';

export default class Customizabledatatable extends LightningElement {

    headerObject=[];
    bodyObject=[];
    rowofrow=[];
    @track availableFields = [];
    defaultValues =
    [
    {label:'Salesforce.com Id',value: 'Id'},
    {label:'Name',value: 'Name'},
    {label:'Created Date',value: 'CreatedDate'}
    ];
    fieldsChosen = [];
    
    showtable =false;
    showFieldChooserWindow =false;
    
    



    openFieldChooser(event){
        console.log('opening the Field Picker');
               
        getField({ObjectName: 'Account'}).then(data=> {
        
        console.log(data);
        data.forEach(element => {
            let currentOptionObject = {label:element.Label,value:element.Value};
            
            this.availableFields.push(currentOptionObject);
            
        });
        console.log(JSON.stringify(this.availableFields));
        console.table(this.availableFields);
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
            console.log(error);
        })

    }
    cancelModal(event)
    {
        console.log('Cancelled the choice');
        this.showFieldChooserWindow=false;
    }
    handlechange(event)
    {
        console.table(JSON.parse(JSON.stringify(event.detail.value)));
    }
    renderedCallback() {
        
        
        }
}