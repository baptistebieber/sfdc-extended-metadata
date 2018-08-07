/***

    @author: Gilbert Gukhool
    @email: louis.g.gukhool@accenture.com
    @date: 11/09/2017 (dd/mm/yyyy)

    2017-12-01: Rename of the class
    
***/
public class COP_Account_CLS {

    public static void setNafLabel(List<Account> listAccount) {

        Set<String> setCodeNaf = new Set<String>();
        Map<String,String> mapNafCodeLabel = new Map<String,String>();

        for(Account oAccount: listAccount) {
            if(oAccount.CodeNAF__c != null) {
                oAccount.CodeNAF__c = normalizeNafCode(oAccount.CodeNAF__c);
                setCodeNaf.add(oAccount.CodeNAF__c);
            }
        }

        if(setCodeNaf.size() > 0) {
            for(Code_NAF__c oCodeNaf: [SELECT Name, libelle__c FROM Code_NAF__c WHERE Name IN :setCodeNaf]) {
                mapNafCodeLabel.put(oCodeNaf.Name, oCodeNaf.libelle__c);
            }
        }

        for(Account oAccount: listAccount) {
            if(oAccount.CodeNAF__c == null) {
                oAccount.NAFName__c = null;
            }
            if(oAccount.CodeNAF__c != null) {
                if(mapNafCodeLabel.containsKey(oAccount.CodeNAF__c)) {
                    oAccount.NAFName__c = mapNafCodeLabel.get(oAccount.CodeNAF__c);
                }
                else {
                    oAccount.CodeNAF__c.addError(System.Label.COP_SFDC_Error_Unknown_Naf_Code);
                }
            }
        }
    }

    public static String normalizeNafCode(String nafCode) {
        nafCode=nafCode.trim();
        nafCode=nafCode.toUpperCase();
        nafCode=nafCode.remove(';').remove('.').remove(':').remove(',');
        return nafCode.left(2) + '.' + nafCode.right(3);
    }
    
}