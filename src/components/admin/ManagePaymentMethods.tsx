
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminDepositMethod from './AdminDepositMethod';
import AdminWithdrawalMethod from './AdminWithdrawalMethod';
import CardSection from '../ui/card-section';
import { DepositMethod, WithdrawalMethodType } from '@/types';

const ManagePaymentMethods = () => {
  const [depositMethods, setDepositMethods] = useState<DepositMethod[]>([]);
  const [withdrawalMethods, setWithdrawalMethods] = useState<WithdrawalMethodType[]>([]);

  const handleAddDepositMethod = (newMethod: DepositMethod) => {
    setDepositMethods([...depositMethods, newMethod]);
  };

  const handleUpdateDepositMethod = (updatedMethods: DepositMethod[]) => {
    setDepositMethods(updatedMethods);
  };

  const handleAddWithdrawalMethod = (newMethod: WithdrawalMethodType) => {
    setWithdrawalMethods([...withdrawalMethods, newMethod]);
  };

  const handleUpdateWithdrawalMethod = (updatedMethods: WithdrawalMethodType[]) => {
    setWithdrawalMethods(updatedMethods);
  };

  return (
    <CardSection title="إدارة طرق الدفع">
      <Tabs defaultValue="deposit">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="deposit" className="flex-1">طرق الإيداع</TabsTrigger>
          <TabsTrigger value="withdrawal" className="flex-1">طرق السحب</TabsTrigger>
        </TabsList>
        
        <TabsContent value="deposit">
          <AdminDepositMethod 
            depositMethods={depositMethods} 
            onAddMethod={handleAddDepositMethod}
            onUpdateMethods={handleUpdateDepositMethod}
          />
        </TabsContent>
        
        <TabsContent value="withdrawal">
          <AdminWithdrawalMethod 
            withdrawalMethods={withdrawalMethods}
            onAddMethod={handleAddWithdrawalMethod}
            onUpdateMethods={handleUpdateWithdrawalMethod}
          />
        </TabsContent>
      </Tabs>
    </CardSection>
  );
};

export default ManagePaymentMethods;
