
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminDepositMethod from './AdminDepositMethod';
import AdminWithdrawalMethod from './AdminWithdrawalMethod';
import { useTransaction } from '@/context/TransactionContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { DepositMethod, WithdrawalMethod } from '@/types';
import CardSection from '../ui/card-section';

const ManagePaymentMethods = () => {
  const { depositMethods, withdrawalMethods, updateDepositMethodStatus, updateWithdrawalMethodStatus } = useTransaction();
  const [activeTab, setActiveTab] = useState<string>('deposit');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const refreshMethods = () => {
    setIsRefreshing(true);
    // In a real app, this would fetch the latest methods from the backend
    setTimeout(() => setIsRefreshing(false), 500);
  };
  
  const toggleDepositMethodStatus = async (id: string, isActive: boolean) => {
    try {
      await updateDepositMethodStatus(id, isActive);
    } catch (error) {
      console.error('Failed to update deposit method status:', error);
    }
  };
  
  const toggleWithdrawalMethodStatus = async (id: string, isActive: boolean) => {
    try {
      await updateWithdrawalMethodStatus(id, isActive);
    } catch (error) {
      console.error('Failed to update withdrawal method status:', error);
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="deposit">طرق الإيداع</TabsTrigger>
          <TabsTrigger value="withdrawal">طرق السحب</TabsTrigger>
        </TabsList>
        
        <TabsContent value="deposit" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdminDepositMethod refreshMethods={refreshMethods} />
            
            <CardSection title="طرق الإيداع الحالية">
              {depositMethods.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  لم يتم إضافة طرق إيداع بعد
                </div>
              ) : (
                <div className="space-y-4">
                  {depositMethods.map((method) => (
                    <div key={method.id} className="p-4 border border-[#2A3348] rounded-lg bg-[#1E293B]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <h3 className="font-medium">{method.name}</h3>
                          <Badge variant={method.isActive ? "default" : "secondary"}>
                            {method.isActive ? "مفعّلة" : "معطلة"}
                          </Badge>
                        </div>
                        <Switch 
                          checked={method.isActive} 
                          onCheckedChange={(checked) => toggleDepositMethodStatus(method.id, checked)}
                        />
                      </div>
                      
                      {method.description && (
                        <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline">{method.acceptedCurrency === 'usdt' ? 'USDT' : 'ليرة سورية'}</Badge>
                        {method.requiresImage && <Badge variant="outline">يتطلب صورة</Badge>}
                        {method.requiresTransactionId && <Badge variant="outline">يتطلب رقم العملية</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardSection>
          </div>
        </TabsContent>
        
        <TabsContent value="withdrawal" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdminWithdrawalMethod refreshMethods={refreshMethods} />
            
            <CardSection title="طرق السحب الحالية">
              {withdrawalMethods.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  لم يتم إضافة طرق سحب بعد
                </div>
              ) : (
                <div className="space-y-4">
                  {withdrawalMethods.map((method) => (
                    <div key={method.id} className="p-4 border border-[#2A3348] rounded-lg bg-[#1E293B]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <h3 className="font-medium">{method.name}</h3>
                          <Badge variant={method.isActive ? "default" : "secondary"}>
                            {method.isActive ? "مفعّلة" : "معطلة"}
                          </Badge>
                        </div>
                        <Switch 
                          checked={method.isActive} 
                          onCheckedChange={(checked) => toggleWithdrawalMethodStatus(method.id, checked)}
                        />
                      </div>
                      
                      {method.description && (
                        <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline">{method.supportedCurrency === 'usdt' ? 'USDT' : 'ليرة سورية'}</Badge>
                        <Badge variant="outline">عمولة {method.feePercentage}%</Badge>
                        {method.requiresApproval ? 
                          <Badge variant="outline">يحتاج موافقة</Badge> : 
                          <Badge variant="outline">تنفيذ فوري</Badge>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardSection>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagePaymentMethods;
