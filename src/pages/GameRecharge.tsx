
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useTransaction } from '@/context/TransactionContext';
import { toast } from '@/hooks/use-toast';
import { Gamepad2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Game {
  id: string;
  name: string;
  accountIdLabel: string;
  price: number;
  currency: 'usdt' | 'syp';
  isActive: boolean;
  imageUrl?: string;
  createdAt: Date;
}

const GameRecharge = () => {
  const { user } = useAuth();
  const { adjustUserBalance, transactions } = useTransaction();
  const [games, setGames] = useState<Game[]>([]);
  const [accountId, setAccountId] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  // Load games from localStorage
  useEffect(() => {
    const storedGames = localStorage.getItem('games');
    if (storedGames) {
      try {
        const parsedGames = JSON.parse(storedGames);
        // Filter only active games and convert dates
        const activeGames = parsedGames
          .filter((game: any) => game.isActive)
          .map((game: any) => ({
            ...game,
            createdAt: new Date(game.createdAt)
          }));
        setGames(activeGames);
      } catch (error) {
        console.error('Error parsing games data:', error);
      }
    }
  }, []);

  const handleOpenDialog = (game: Game) => {
    if (!user) {
      toast({
        title: 'خطأ',
        description: 'يجب تسجيل الدخول أولاً',
        variant: 'destructive'
      });
      return;
    }

    setSelectedGame(game);
    setAccountId('');
    setShowDialog(true);
  };

  const handleSubmitRequest = async () => {
    if (!selectedGame || !accountId) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال معرف الحساب',
        variant: 'destructive'
      });
      return;
    }

    if (!user) {
      toast({
        title: 'خطأ',
        description: 'يجب تسجيل الدخول أولاً',
        variant: 'destructive'
      });
      return;
    }

    // Check if user has enough balance
    const userBalance = user.balances[selectedGame.currency] || 0;
    if (userBalance < selectedGame.price) {
      toast({
        title: 'رصيد غير كافٍ',
        description: `الرصيد الحالي: ${userBalance} ${selectedGame.currency.toUpperCase()}`,
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsProcessing(true);

      // Create a new game recharge transaction
      const newTransaction = {
        id: Math.random().toString(36).substring(2, 11),
        type: 'game_recharge' as any,
        amount: selectedGame.price,
        currency: selectedGame.currency,
        status: 'pending',
        timestamp: new Date(),
        userId: user.id,
        gameId: selectedGame.id,
        gameName: selectedGame.name,
        accountId: accountId,
      };

      // Deduct from user balance
      await adjustUserBalance(
        user.email, 
        selectedGame.price, 
        selectedGame.currency, 
        'subtract'
      );

      // Add to transactions
      const updatedTransactions = [...transactions, newTransaction];
      localStorage.setItem('transactions_data', JSON.stringify(updatedTransactions));

      toast({
        title: 'تم إرسال الطلب',
        description: 'سيتم مراجعة طلبك والرد عليه قريبًا'
      });
      
      setShowDialog(false);
      setAccountId('');

    } catch (error) {
      console.error('Error processing game recharge:', error);
      toast({
        title: 'حدث خطأ',
        description: 'لم يتم تنفيذ العملية. يرجى المحاولة مرة أخرى',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold mb-6">شحن الألعاب</h1>

        {games.length === 0 ? (
          <div className="text-center py-12 bg-[#1A1E2C] rounded-lg border border-[#2A3348]">
            <Gamepad2 className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">لا توجد ألعاب متاحة حاليًا</h2>
            <p className="text-muted-foreground">
              ستتوفر خدمة شحن الألعاب قريبًا، يرجى المحاولة لاحقًا.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <Card key={game.id} className="bg-[#1A1E2C] border-[#2A3348]">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Gamepad2 className="h-5 w-5 text-[#1E88E5]" />
                    {game.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">السعر:</span>
                      <span className="font-medium text-xl">
                        {formatNumber(game.price)} 
                        <span className="text-muted-foreground ml-1 text-base">
                          {game.currency === 'usdt' ? 'USDT' : 'ل.س'}
                        </span>
                      </span>
                    </div>
                    <Button 
                      variant="wallet" 
                      className="w-full mt-2"
                      onClick={() => handleOpenDialog(game)}
                    >
                      شحن الآن
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Purchase Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="bg-[#1A1E2C] border-[#2A3348]">
            <DialogHeader>
              <DialogTitle>{selectedGame?.name}</DialogTitle>
              <DialogDescription>
                أدخل معرف الحساب لشحن اللعبة
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {selectedGame?.accountIdLabel || 'معرف اللاعب'}:
                </label>
                <Input 
                  type="text"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  placeholder="أدخل معرف الحساب"
                  className="bg-[#242C3E] border-[#2A3348] text-white"
                />
              </div>

              <div className="rounded-md bg-[#242C3E] p-3">
                <p className="text-sm text-muted-foreground mb-2">تفاصيل الطلب:</p>
                <div className="flex justify-between">
                  <span>المبلغ:</span>
                  <span className="font-medium">
                    {selectedGame ? formatNumber(selectedGame.price) : '0'} 
                    {selectedGame?.currency === 'usdt' ? ' USDT' : ' ل.س'}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>الرصيد المتاح:</span>
                  <span className="font-medium">
                    {selectedGame && user?.balances ? 
                      formatNumber(user.balances[selectedGame.currency] || 0) : '0'} 
                    {selectedGame?.currency === 'usdt' ? ' USDT' : ' ل.س'}
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowDialog(false)}
                className="border-[#2A3348]"
              >
                إلغاء
              </Button>
              <Button 
                variant="wallet"
                onClick={handleSubmitRequest}
                disabled={isProcessing || !accountId}
              >
                تأكيد الطلب
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default GameRecharge;
