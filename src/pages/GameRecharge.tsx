
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useTransaction } from '@/context/TransactionContext';
import { Wallet, Gamepad2 } from 'lucide-react';
import { User, Game, Currency } from '@/types';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const GameRecharge = () => {
  const { user, isAuthenticated } = useAuth();
  const { adjustUserBalance } = useTransaction();
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [accountId, setAccountId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currencies, setCurrencies] = useState<{id: string, name: string, symbol: string}[]>([]);

  useEffect(() => {
    loadGames();
    loadCurrencies();
  }, []);

  const loadGames = () => {
    try {
      const gamesData = localStorage.getItem('games');
      if (gamesData) {
        const parsedGames = JSON.parse(gamesData);
        // Filter only active games
        const activeGames = parsedGames.filter((game: Game) => game.isActive);
        setGames(activeGames);
      } else {
        // Default games if none found
        setGames([]);
      }
    } catch (error) {
      console.error('Error loading games:', error);
    }
  };

  const loadCurrencies = () => {
    try {
      const savedCurrencies = localStorage.getItem('supportedCurrencies');
      if (savedCurrencies) {
        const currencyData = JSON.parse(savedCurrencies);
        const activeCurrencies = currencyData.filter((c: any) => c.isActive);
        setCurrencies(activeCurrencies.map((c: any) => ({
          id: c.code,
          name: c.name,
          symbol: c.code.toUpperCase()
        })));
      } else {
        setCurrencies([
          { id: 'usdt', name: 'Tether USD', symbol: 'USDT' },
          { id: 'syp', name: 'الليرة السورية', symbol: 'SYP' }
        ]);
      }
    } catch (error) {
      console.error('Error loading currencies:', error);
      setCurrencies([
        { id: 'usdt', name: 'Tether USD', symbol: 'USDT' },
        { id: 'syp', name: 'الليرة السورية', symbol: 'SYP' }
      ]);
    }
  };

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game);
    setAccountId('');
  };

  const handleRecharge = async () => {
    if (!selectedGame) {
      toast({
        title: "الرجاء اختيار لعبة",
        variant: "destructive",
      });
      return;
    }

    if (!accountId) {
      toast({
        title: `الرجاء إدخال ${selectedGame.accountIdLabel || 'معرف الحساب'}`,
        variant: "destructive",
      });
      return;
    }

    // Check user balance
    if (!user || !user.balances || user.balances[selectedGame.currency as Currency] < selectedGame.price) {
      toast({
        title: "رصيدك غير كافٍ",
        description: `الرجاء شحن رصيدك بعملة ${selectedGame.currency.toUpperCase()} ثم حاول مرة أخرى`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Generate transaction ID
      const transactionId = `game-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      // Subtract from user balance
      await adjustUserBalance(
        user.email,
        selectedGame.price,
        selectedGame.currency as Currency,
        'subtract'
      );

      // Create transaction record
      const newTransaction = {
        id: transactionId,
        type: 'game_recharge',
        amount: selectedGame.price,
        currency: selectedGame.currency,
        status: 'completed',
        timestamp: new Date(),
        userId: user.id,
        gameId: selectedGame.id,
        gameName: selectedGame.name,
        accountId: accountId
      };

      // Save transaction
      const existingTransactions = localStorage.getItem('transactions_data');
      const transactions = existingTransactions ? JSON.parse(existingTransactions) : [];
      transactions.push(newTransaction);
      localStorage.setItem('transactions_data', JSON.stringify(transactions));

      toast({
        title: "تم شحن اللعبة بنجاح",
        description: `تم شحن حساب اللعبة ${selectedGame.name} بنجاح`,
      });

      // Reset form
      setSelectedGame(null);
      setAccountId('');
      
    } catch (error) {
      console.error('Error recharging game:', error);
      toast({
        title: "فشل شحن اللعبة",
        description: "حدث خطأ أثناء محاولة شحن اللعبة، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const getDefaultGameImage = () => {
    return "/placeholder.svg";
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold mb-6">شحن الألعاب</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-[#1A1E2C] border-[#2A3348] shadow-md">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">اختر اللعبة</CardTitle>
                  <Gamepad2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>
                  اختر اللعبة التي تريد شحنها ثم أدخل معرف حسابك
                </CardDescription>
              </CardHeader>
              <CardContent>
                {games.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {games.map((game) => (
                      <div
                        key={game.id}
                        onClick={() => handleGameSelect(game)}
                        className={`border rounded-lg cursor-pointer transition-all p-3 ${
                          selectedGame?.id === game.id
                            ? 'border-[#9b87f5] bg-[#9b87f5]/10'
                            : 'border-[#2A3348] hover:border-[#9b87f5] hover:bg-[#9b87f5]/5'
                        }`}
                      >
                        {(game.imageUrl || game.imageFile) && (
                          <div className="mb-3">
                            <AspectRatio ratio={16 / 9} className="rounded-md overflow-hidden bg-[#242C3E]">
                              <img 
                                src={game.imageUrl || getDefaultGameImage()} 
                                alt={game.name} 
                                className="object-cover"
                              />
                            </AspectRatio>
                          </div>
                        )}
                        <div className="text-center">
                          <p className="font-medium">{game.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {game.price} {game.currency.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Gamepad2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      لا توجد ألعاب متاحة للشحن حالياً
                    </p>
                  </div>
                )}

                {selectedGame && (
                  <div className="mt-6 p-4 border border-[#2A3348] rounded-lg">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{selectedGame.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            المبلغ: {selectedGame.price} {selectedGame.currency.toUpperCase()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedGame(null)}
                        >
                          تغيير اللعبة
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="accountId">{selectedGame.accountIdLabel || 'معرف الحساب'}</Label>
                        <Input
                          id="accountId"
                          placeholder={`أدخل ${selectedGame.accountIdLabel || 'معرف الحساب'}`}
                          value={accountId}
                          onChange={(e) => setAccountId(e.target.value)}
                          className="bg-[#242C3E] border-[#2A3348]"
                        />
                      </div>

                      <Button
                        onClick={handleRecharge}
                        className="w-full bg-[#9b87f5] hover:bg-[#7E69AB]"
                        disabled={isLoading || !accountId}
                      >
                        {isLoading ? "جارٍ تنفيذ الشحن..." : "شحن اللعبة"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-[#1A1E2C] border-[#2A3348] shadow-md">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">الرصيد الحالي</CardTitle>
                  <Wallet className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                {currencies.map((currency) => {
                  const balance = user?.balances[currency.id as Currency] || 0;
                  return (
                    <div 
                      key={currency.id}
                      className="flex justify-between items-center py-2 border-b border-[#2A3348] last:border-0"
                    >
                      <span>{currency.name}</span>
                      <span className="font-mono font-medium">{balance} {currency.symbol}</span>
                    </div>
                  );
                })}
                
                {selectedGame && (
                  <div className="mt-4 p-3 bg-[#242C3E] rounded-lg">
                    <div className="text-sm">
                      <p className="mb-1">تكلفة الشحن:</p>
                      <p className="font-medium text-lg">
                        {selectedGame.price} {selectedGame.currency.toUpperCase()}
                      </p>
                      
                      {user?.balances?.[selectedGame.currency as Currency] < selectedGame.price && (
                        <p className="text-red-400 text-xs mt-2">
                          رصيدك غير كافٍ لإتمام عملية الشحن
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GameRecharge;
