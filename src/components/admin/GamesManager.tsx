
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import CardSection from '../ui/card-section';
import { Trash2, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export interface Game {
  id: string;
  name: string;
  accountIdLabel: string;
  price: number;
  currency: 'usdt' | 'syp';
  isActive: boolean;
  imageUrl?: string;
  createdAt: Date;
}

const GamesManager = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [newGame, setNewGame] = useState({
    name: '',
    accountIdLabel: 'معرف اللاعب',
    price: 0,
    currency: 'usdt' as 'usdt' | 'syp',
    isActive: true,
  });
  
  // Load games from local storage
  useEffect(() => {
    const storedGames = localStorage.getItem('games');
    if (storedGames) {
      try {
        const parsedGames = JSON.parse(storedGames);
        // Convert string dates to Date objects
        const gamesWithDates = parsedGames.map((game: any) => ({
          ...game,
          createdAt: new Date(game.createdAt)
        }));
        setGames(gamesWithDates);
      } catch (error) {
        console.error('Error parsing games data:', error);
      }
    }
  }, []);

  // Save games to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('games', JSON.stringify(games));
  }, [games]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      setNewGame({
        ...newGame,
        [name]: parseFloat(value) || 0
      });
    } else {
      setNewGame({
        ...newGame,
        [name]: value
      });
    }
  };

  const handleAddGame = () => {
    if (!newGame.name) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال اسم اللعبة',
        variant: 'destructive'
      });
      return;
    }

    if (newGame.price <= 0) {
      toast({
        title: 'خطأ',
        description: 'يجب أن يكون السعر أكبر من صفر',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    
    // Create a new game object
    const game: Game = {
      id: Math.random().toString(36).substring(2, 11),
      name: newGame.name,
      accountIdLabel: newGame.accountIdLabel,
      price: newGame.price,
      currency: newGame.currency,
      isActive: newGame.isActive,
      createdAt: new Date()
    };
    
    // Add to games list
    setGames([...games, game]);
    
    // Reset form fields
    setNewGame({
      name: '',
      accountIdLabel: 'معرف اللاعب',
      price: 0,
      currency: 'usdt',
      isActive: true
    });
    
    toast({
      title: 'تمت الإضافة',
      description: 'تم إضافة اللعبة بنجاح'
    });
    
    setIsLoading(false);
  };
  
  const toggleGameStatus = (id: string) => {
    setGames(games.map(game => 
      game.id === id ? { ...game, isActive: !game.isActive } : game
    ));
    
    toast({
      title: 'تم تحديث الحالة',
      description: 'تم تحديث حالة اللعبة بنجاح'
    });
  };
  
  const deleteGame = (id: string) => {
    setGames(games.filter(game => game.id !== id));
    
    toast({
      title: 'تم الحذف',
      description: 'تم حذف اللعبة بنجاح'
    });
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  return (
    <CardSection title="إدارة شحن الألعاب">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <label className="text-sm text-muted-foreground mb-1 block">اسم اللعبة</label>
            <Input
              type="text"
              name="name"
              value={newGame.name}
              onChange={handleInputChange}
              placeholder="أدخل اسم اللعبة"
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">نوع المعرف</label>
            <Input
              type="text"
              name="accountIdLabel"
              value={newGame.accountIdLabel}
              onChange={handleInputChange}
              placeholder="مثل: معرف اللاعب، ID، الخ"
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">السعر</label>
            <Input
              type="number"
              name="price"
              value={newGame.price}
              onChange={handleInputChange}
              placeholder="أدخل السعر"
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">العملة</label>
            <Select
              value={newGame.currency}
              onValueChange={(value) => setNewGame({ ...newGame, currency: value as 'usdt' | 'syp' })}
            >
              <SelectTrigger className="bg-[#242C3E] border-[#2A3348] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#242C3E] border-[#2A3348] text-white">
                <SelectItem value="usdt">USDT</SelectItem>
                <SelectItem value="syp">SYP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Switch
              id="game-active"
              checked={newGame.isActive}
              onCheckedChange={(checked) => setNewGame({ ...newGame, isActive: checked })}
            />
            <Label htmlFor="game-active">نشط</Label>
          </div>
          
          <Button 
            onClick={handleAddGame} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <PlusCircle size={16} />
            <span>إضافة لعبة</span>
          </Button>
        </div>
        
        <div className="border border-[#2A3348] rounded-md overflow-hidden mt-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#1A1E2C] hover:bg-[#1A1E2C]">
                <TableHead className="text-white">اسم اللعبة</TableHead>
                <TableHead className="text-white">نوع المعرف</TableHead>
                <TableHead className="text-white">السعر</TableHead>
                <TableHead className="text-white">الحالة</TableHead>
                <TableHead className="text-white">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    لا توجد ألعاب متاحة حاليًا
                  </TableCell>
                </TableRow>
              ) : (
                games.map((game) => (
                  <TableRow key={game.id} className="bg-[#1E293B] hover:bg-[#242C3E] border-t border-[#2A3348]">
                    <TableCell className="font-medium text-white">{game.name}</TableCell>
                    <TableCell>{game.accountIdLabel}</TableCell>
                    <TableCell>
                      {formatNumber(game.price)} {game.currency === 'usdt' ? 'USDT' : 'ل.س'}
                    </TableCell>
                    <TableCell>
                      {game.isActive ? (
                        <Badge className="bg-green-500/20 text-green-500 border-green-500/20">
                          نشط
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500/20 text-red-500 border-red-500/20">
                          معطل
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleGameStatus(game.id)}
                          className="border-[#2A3348]"
                        >
                          {game.isActive ? 'تعطيل' : 'تفعيل'}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteGame(game.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </CardSection>
  );
};

export default GamesManager;
