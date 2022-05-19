public with sharing class AccountDataProvider {
    
     @AuraEnabled(cacheable=true)
    public static List<Account> getAccount(List<String> Fields)
        {   
                System.debug('Account filed query');
                List<Account> accountdetails = new List<Account>();
                try
                    {
                            
                            if(Fields.size()==0)
                            accountdetails= [SELECT name,id,phone,website from Account  LIMIT 10];
                            else
                            {
                                
                                    String querylIST = 'SELECT id,';
                                for(String field:Fields)
                                {

                                            querylIST = querylIST + ' '+field +',';
                                }
                                querylIST=querylIST.substring(0,querylIST.length()-1);
                                querylIST = querylIST+ ' from Account LIMIT 10';
                                System.debug(LoggingLevel.INFO,querylIST);
                                accountdetails = Database.query(querylIST);

                                
                            }
                    }
                    catch(Exception e)
                    {
                        System.debug(e);
                    }
                    
                        return accountdetails;
                    
                 
        }

  @AuraEnabled(cacheable=true)
    public static List<Map<String,String>> getField(String ObjectName)
    {
                SObjectType objectType = Schema.getGlobalDescribe().get(ObjectName);
                Map<String,Schema.SObjectField> fields = objectType.getDescribe().fields.getMap();
                List<Map<String,String>> fieldSet=new List<Map<String,String>> ();
                for(String key:fields.keySet())
                {
                Map<String,String> fieldMap = new Map<String,String>();
                if(fields.get(key).getDescribe().isAccessible() && fields.get(key).getDescribe().isUpdateable())
                {
                    fieldMap.put('Label',fields.get(key).getDescribe().Label);
                    fieldMap.put('Value',key);
                    fieldSet.add(fieldMap);
                    System.debug(key);
                    System.debug(fieldMap);

                }
                else
                    System.debug('Skipping'+key);
                
                }



        return fieldSet;
    }
}