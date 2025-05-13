
import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useBalanceRefresh } from '@/hooks/useBalanceRefresh';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Game, Currency } from '@/types';
import { Gamepad2 } from 'lucide-react';

const GameRecharge = () => {
  const { user, isAuthenticated } = useAuth();
  const { forceRefresh } = useBalanceRefresh();
  const navigate = useNavigate();
  
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [accountId, setAccountId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Load games from localStorage
    const storedGames = localStorage.getItem('games');
    if (storedGames) {
      try {
        const parsedGames = JSON.parse(storedGames);
        // Filter to show only active games
        const activeGames = parsedGames
          .filter((game: Game) => game.isActive)
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

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game);
    setAccountId('');
  };

  const handleRecharge = async () => {
    if (!selectedGame) return;
    if (!accountId.trim()) {
      toast({
        title: "معرف الحساب مطلوب",
        description: `يرجى إدخال ${selectedGame.accountIdLabel}`,
        variant: "destructive"
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      // Check if user has sufficient balance
      const currency = selectedGame.currency as Currency;
      if (!user?.balances[currency] || user.balances[currency] < selectedGame.price) {
        toast({
          title: "رصيد غير كافٍ",
          description: `ليس لديك رصيد كافٍ من ${currency.toUpperCase()} لإتمام العملية`,
          variant: "destructive"
        });
        return;
      }

      // Get transactions from localStorage
      const transactionsJSON = localStorage.getItem('transactions') || '[]';
      const transactions = JSON.parse(transactionsJSON);
      
      // Create new transaction
      const newTransaction = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'game_recharge',
        amount: selectedGame.price,
        currency: selectedGame.currency,
        status: 'pending',
        timestamp: new Date(),
        userId: user.id,
        gameId: selectedGame.id,
        gameName: selectedGame.name,
        accountId: accountId
      };
      
      // Add transaction to the list
      transactions.push(newTransaction);
      localStorage.setItem('transactions', JSON.stringify(transactions));
      
      toast({
        title: "تم إرسال طلب الشحن بنجاح",
        description: "سيتم مراجعة طلبك وتنفيذه في أقرب وقت ممكن"
      });
      
      // Refresh user data to update balances
      await forceRefresh();
      
      // Reset form
      setSelectedGame(null);
      setAccountId('');
      
      // Redirect to dashboard
      navigate('/');
      
    } catch (error) {
      console.error('Error processing recharge:', error);
      toast({
        title: "حدث خطأ",
        description: "تعذر إتمام عملية الشحن، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">شحن الألعاب</h1>
          <Button onClick={() => navigate('/')} variant="outline">العودة للرئيسية</Button>
        </div>

        {selectedGame ? (
          <Card className="border-[#2A3348] bg-[#1A1E2C]">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">شحن لعبة {selectedGame.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Game Info */}
                <div className="md:col-span-1 flex flex-col items-center">
                  <div className="mb-4 w-24 h-24 rounded-lg overflow-hidden border border-[#2A3348] flex items-center justify-center">
                    {selectedGame.imageUrl ? (
                      <img src={selectedGame.imageUrl} alt={selectedGame.name} className="object-cover w-full h-full" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=Game';
                        }}
                      />
                    ) : (
                      <Gamepad2 className="text-muted-foreground w-12 h-12" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-medium">{selectedGame.name}</p>
                    <p className="text-muted-foreground">
                      {selectedGame.price} {selectedGame.currency.toUpperCase()}
                    </p>
                  </div>
                </div>
                
                {/* Recharge Form */}
                <div className="md:col-span-2 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">{selectedGame.accountIdLabel}</label>
                    <Input 
                      value={accountId}
                      onChange={(e) => setAccountId(e.target.value)}
                      placeholder={`أدخل ${selectedGame.accountIdLabel}`}
                      className="bg-[#242C3E] border-[#2A3348] text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">التكلفة</label>
                    <div className="p-3 bg-[#242C3E] rounded-md flex justify-between">
                      <span>سعر الشحن</span>
                      <span className="font-bold">{selectedGame.price} {selectedGame.currency.toUpperCase()}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">الرصيد المتاح</label>
                    <div className="p-3 bg-[#242C3E] rounded-md flex justify-between">
                      <span>رصيدك الحالي</span>
                      <span className="font-bold">
                        {user?.balances[selectedGame.currency as Currency] || 0} {selectedGame.currency.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setSelectedGame(null)}
                    >
                      العودة إلى القائمة
                    </Button>
                    <Button 
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                      onClick={handleRecharge}
                      disabled={isProcessing || !accountId.trim()}
                    >
                      {isProcessing ? "جاري التنفيذ..." : "تأكيد عملية الشحن"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {games.length === 0 ? (
              <div className="text-center py-12">
                <Gamepad2 className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-2">لا توجد ألعاب متاحة حالياً</h2>
                <p className="text-muted-foreground">
                  ستظهر الألعاب المتاحة للشحن هنا. يرجى التحقق لاحقاً.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {games.map(game => (
                  <Card 
                    key={game.id} 
                    className="border-[#2A3348] bg-[#1A1E2C] cursor-pointer hover:bg-[#242C3E] transition-colors"
                    onClick={() => handleGameSelect(game)}
                  >
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 rounded-lg overflow-hidden mb-4 border border-[#2A3348] flex items-center justify-center">
                        {game.imageUrl ? (
                          <img src={game.imageUrl} alt={game.name} className="object-cover w-full h-full" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=Game';
                            }}
                          />
                        ) : (
                          <Gamepad2 className="text-muted-foreground w-10 h-10" />
                        )}
                      </div>
                      <h3 className="font-bold text-lg mb-1">{game.name}</h3>
                      <p className="text-muted-foreground mb-4">
                        {game.price} {game.currency.toUpperCase()}
                      </p>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        اختر
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default GameRecharge;
