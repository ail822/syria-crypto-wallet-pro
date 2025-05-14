
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import CardSection from '@/components/ui/card-section';
import { User, Currency } from '@/types';
import { Search, Edit, User as UserIcon } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [currencies, setCurrencies] = useState<{id: string, name: string, symbol: string}[]>([]);

  useEffect(() => {
    loadUsers();
    loadCurrencies();
  }, []);

  const loadUsers = () => {
    try {
      setIsLoading(true);
      const registeredUsersJSON = localStorage.getItem('registeredUsers');
      if (registeredUsersJSON) {
        const userData = JSON.parse(registeredUsersJSON);
        setUsers(userData);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "فشل تحميل بيانات المستخدمين",
        description: "حدث خطأ أثناء تحميل بيانات المستخدمين",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadCurrencies = () => {
    try {
      const savedCurrencies = localStorage.getItem('supportedCurrencies');
      if (savedCurrencies) {
        const currencyData = JSON.parse(savedCurrencies);
        setCurrencies(currencyData.map((c: any) => ({
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

  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    setNewPassword('');
    setShowPasswordDialog(true);
  };

  const handleSavePassword = () => {
    if (!selectedUser || !newPassword || newPassword.length < 6) {
      toast({
        title: "كلمة المرور غير صالحة",
        description: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update user password
      const updatedUsers = users.map(u => {
        if (u.id === selectedUser.id) {
          return { ...u, password: newPassword };
        }
        return u;
      });
      
      setUsers(updatedUsers);
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      
      toast({
        title: "تم تحديث كلمة المرور",
        description: `تم تغيير كلمة مرور المستخدم ${selectedUser.name} بنجاح`,
      });
      
      setShowPasswordDialog(false);
      
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: "فشل تحديث كلمة المرور",
        description: "حدث خطأ أثناء تحديث كلمة المرور",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      (user.phoneNumber && user.phoneNumber.includes(query)) ||
      (user.telegramId && user.telegramId.toLowerCase().includes(query))
    );
  });

  return (
    <CardSection title="إدارة المستخدمين">
      <div className="space-y-4">
        {/* Search and filters */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث عن مستخدم..."
              className="pl-10 bg-[#242C3E] border-[#2A3348]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            onClick={loadUsers}
            variant="outline"
            className="border-[#2A3348]"
          >
            تحديث
          </Button>
        </div>

        {/* Users table */}
        <div className="rounded-md border border-[#2A3348] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#242C3E] hover:bg-[#242C3E]">
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead className="w-[180px]">المستخدم</TableHead>
                <TableHead>البريد الإلكتروني</TableHead>
                <TableHead>رقم التواصل</TableHead>
                <TableHead>معرف تلغرام</TableHead>
                <TableHead>الأرصدة</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    جارٍ التحميل...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    لا يوجد مستخدمين مطابقين
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user, index) => (
                  <TableRow key={user.id} className="border-[#2A3348]">
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#1E293B] flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          {user.name}
                          {user.isAdmin && (
                            <span className="text-xs text-[#9b87f5] block">
                              مسؤول
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phoneNumber || "—"}</TableCell>
                    <TableCell>{user.telegramId || "—"}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {currencies.map((currency) => {
                          const balance = user.balances[currency.id as Currency] || 0;
                          return (
                            <div key={currency.id} className="flex items-center justify-between text-sm">
                              <span>{currency.name}:</span>
                              <span className="font-mono">
                                {balance.toLocaleString()} {currency.symbol}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#2A3348]"
                        onClick={() => handleResetPassword(user)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        تغيير كلمة المرور
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Password change dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>تغيير كلمة مرور المستخدم</DialogTitle>
            <DialogDescription>
              {selectedUser && (
                <span>تغيير كلمة المرور للمستخدم: {selectedUser.name}</span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="أدخل كلمة المرور الجديدة"
                className="bg-[#242C3E] border-[#2A3348]"
              />
              <p className="text-xs text-muted-foreground">
                يجب أن تكون كلمة المرور 6 أحرف على الأقل
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              className="border-[#2A3348]"
              onClick={() => setShowPasswordDialog(false)}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleSavePassword}
              variant="default"
              className="bg-[#9b87f5] hover:bg-[#7E69AB]"
              disabled={!newPassword || newPassword.length < 6}
            >
              حفظ كلمة المرور
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CardSection>
  );
};

export default UserManagement;
