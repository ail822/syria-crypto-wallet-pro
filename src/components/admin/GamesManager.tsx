
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import CardSection from '../ui/card-section';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gamepad2, Plus, Trash, Upload, Link } from 'lucide-react';

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

const GamesManager = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [newGame, setNewGame] = useState<Omit<Game, 'id' | 'createdAt'>>({
    name: '',
    accountIdLabel: 'معرف اللاعب',
    price: 0,
    currency: 'usdt',
    isActive: true,
  });
  
  const [isAdding, setIsAdding] = useState(false);
  const [imageUploadMethod, setImageUploadMethod] = useState<'file' | 'url'>('file');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  // Load games from localStorage
  useEffect(() => {
    const storedGames = localStorage.getItem('games');
    if (storedGames) {
      try {
        const parsedGames = JSON.parse(storedGames);
        // Convert string dates to Date objects
        setGames(
          parsedGames.map((game: any) => ({
            ...game,
            createdAt: new Date(game.createdAt)
          }))
        );
      } catch (error) {
        console.error('Error parsing games data:', error);
      }
    }
  }, []);

  // Save games to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('games', JSON.stringify(games));
  }, [games]);

  const handleInputChange = (key: keyof Omit<Game, 'id' | 'createdAt' | 'isActive' | 'imageUrl'>, value: string | number) => {
    setNewGame({
      ...newGame,
      [key]: key === 'price' ? parseFloat(value as string) || 0 : value
    });
  };

  const handleToggleActive = (id: string) => {
    setGames(games.map(game => 
      game.id === id ? { ...game, isActive: !game.isActive } : game
    ));
    toast({
      title: 'تم تحديث حالة اللعبة',
    });
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleAddGame = () => {
    if (!newGame.name || newGame.price <= 0) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال اسم اللعبة والسعر',
        variant: 'destructive'
      });
      return;
    }

    let gameImageUrl = '';
    
    // الحصول على رابط الصورة حسب طريقة الاختيار
    if (imageUploadMethod === 'file' && imagePreview) {
      gameImageUrl = imagePreview;
    } else if (imageUploadMethod === 'url' && imageUrl) {
      gameImageUrl = imageUrl;
    }

    const gameToAdd: Game = {
      ...newGame,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date(),
      imageUrl: gameImageUrl
    };

    setGames([...games, gameToAdd]);
    
    // إعادة تعيين النموذج
    setNewGame({
      name: '',
      accountIdLabel: 'معرف اللاعب',
      price: 0,
      currency: 'usdt',
      isActive: true,
    });
    setImagePreview('');
    setImageUrl('');
    setImageFile(null);
    setImageUploadMethod('file');
    setIsAdding(false);

    toast({
      title: 'تمت إضافة اللعبة',
      description: `تمت إضافة ${gameToAdd.name} بنجاح`
    });
  };

  const handleDeleteGame = (id: string) => {
    setGames(games.filter(game => game.id !== id));
    toast({
      title: 'تم حذف اللعبة',
    });
  };

  return (
    <CardSection title="إدارة الألعاب">
      <div className="space-y-4">
        {/* Add Game Button */}
        {!isAdding && (
          <Button 
            onClick={() => setIsAdding(true)} 
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            إضافة لعبة جديدة
          </Button>
        )}

        {/* Add Game Form */}
        {isAdding && (
          <div className="p-4 border border-[#2A3348] bg-[#1E293B] rounded-md space-y-4">
            <h3 className="font-medium">إضافة لعبة جديدة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground block mb-1">اسم اللعبة</label>
                <Input
                  placeholder="أدخل اسم اللعبة"
                  value={newGame.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="bg-[#242C3E] border-[#2A3348]"
                />
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground block mb-1">نص معرف الحساب</label>
                <Input
                  placeholder="مثال: معرف اللاعب"
                  value={newGame.accountIdLabel}
                  onChange={(e) => handleInputChange('accountIdLabel', e.target.value)}
                  className="bg-[#242C3E] border-[#2A3348]"
                />
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground block mb-1">السعر</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newGame.price || ''}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="bg-[#242C3E] border-[#2A3348]"
                />
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground block mb-1">العملة</label>
                <Select
                  value={newGame.currency}
                  onValueChange={(value: 'usdt' | 'syp') => handleInputChange('currency', value)}
                >
                  <SelectTrigger className="bg-[#242C3E] border-[#2A3348]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#242C3E] border-[#2A3348]">
                    <SelectItem value="usdt">USDT</SelectItem>
                    <SelectItem value="syp">ليرة سورية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* إضافة خيارات تحميل الصورة */}
            <div className="mt-4">
              <label className="text-sm text-muted-foreground block mb-2">صورة اللعبة (اختياري)</label>
              
              <Tabs value={imageUploadMethod} onValueChange={(v) => setImageUploadMethod(v as 'file' | 'url')} className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="file" className="flex items-center">
                    <Upload className="w-4 h-4 mr-2" /> رفع صورة
                  </TabsTrigger>
                  <TabsTrigger value="url" className="flex items-center">
                    <Link className="w-4 h-4 mr-2" /> رابط صورة
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="file" className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="bg-[#242C3E] border-[#2A3348]"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground mb-2">معاينة الصورة:</p>
                      <div className="relative w-20 h-20 rounded-md overflow-hidden border border-[#2A3348]">
                        <img src={imagePreview} alt="Game preview" className="object-cover w-full h-full" />
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="url" className="space-y-2">
                  <Input
                    placeholder="https://example.com/game-image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="bg-[#242C3E] border-[#2A3348]"
                  />
                  {imageUrl && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground mb-2">معاينة الصورة:</p>
                      <div className="relative w-20 h-20 rounded-md overflow-hidden border border-[#2A3348]">
                        <img src={imageUrl} alt="Game preview" className="object-cover w-full h-full" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=Error';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsAdding(false)}
                className="border-[#2A3348]"
              >
                إلغاء
              </Button>
              <Button onClick={handleAddGame}>
                إضافة اللعبة
              </Button>
            </div>
          </div>
        )}

        {/* Games List */}
        {games.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-[#2A3348] rounded-md">
            <Gamepad2 className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">لم تتم إضافة ألعاب بعد</p>
          </div>
        ) : (
          <div className="space-y-4">
            {games.map(game => (
              <div 
                key={game.id}
                className="flex flex-wrap items-center justify-between p-4 border border-[#2A3348] bg-[#1E293B] rounded-md gap-4"
              >
                <div className="flex items-center gap-3">
                  {game.imageUrl ? (
                    <div className="w-12 h-12 rounded overflow-hidden">
                      <img src={game.imageUrl} alt={game.name} className="object-cover w-full h-full" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48?text=Game';
                        }}
                      />
                    </div>
                  ) : (
                    <Gamepad2 className="h-6 w-6 text-muted-foreground" />
                  )}
                  <div>
                    <h4 className="font-medium">{game.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {game.price} {game.currency.toUpperCase()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">مفعّل</span>
                    <Switch
                      checked={game.isActive}
                      onCheckedChange={() => handleToggleActive(game.id)}
                    />
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteGame(game.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">حذف</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CardSection>
  );
};

export default GamesManager;
