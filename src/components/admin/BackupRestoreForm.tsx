
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { AlertCircle, ArrowUpFromLine, CheckCircle } from 'lucide-react';
import CardSection from '@/components/ui/card-section';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

const BackupRestoreForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [restoreStatus, setRestoreStatus] = useState<'idle' | 'progress' | 'success' | 'error'>('idle');
  const [restoreReport, setRestoreReport] = useState<{
    users: number;
    transactions: number;
    settings: number;
    currencies: number;
    methods: number;
    total: number;
  }>({
    users: 0,
    transactions: 0,
    settings: 0,
    currencies: 0,
    methods: 0,
    total: 0
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleRestore = async () => {
    if (!file) {
      toast({
        title: "لم يتم اختيار ملف",
        description: "الرجاء اختيار ملف النسخة الاحتياطية أولًا",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      setRestoreStatus('progress');
      setRestoreProgress(0);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setRestoreProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);

      // Read the file
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const content = event.target?.result as string;
          const backupData = JSON.parse(content);
          
          // Simulate processing the backup data
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Update local storage with backup data
          if (backupData.users) {
            localStorage.setItem('registeredUsers', JSON.stringify(backupData.users));
          }
          
          if (backupData.transactions) {
            localStorage.setItem('transactions_data', JSON.stringify(backupData.transactions));
          }
          
          if (backupData.exchangeRate) {
            localStorage.setItem('exchange_rate', JSON.stringify(backupData.exchangeRate));
          }
          
          if (backupData.depositMethods) {
            localStorage.setItem('deposit_methods', JSON.stringify(backupData.depositMethods));
          }
          
          if (backupData.withdrawalMethods) {
            localStorage.setItem('withdrawal_methods', JSON.stringify(backupData.withdrawalMethods));
          }
          
          if (backupData.currencies) {
            localStorage.setItem('supportedCurrencies', JSON.stringify(backupData.currencies));
          }
          
          // Prepare report
          const report = {
            users: backupData.users?.length || 0,
            transactions: backupData.transactions?.length || 0,
            settings: backupData.exchangeRate ? 1 : 0,
            currencies: backupData.currencies?.length || 0,
            methods: (backupData.depositMethods?.length || 0) + (backupData.withdrawalMethods?.length || 0),
            total: 0
          };
          
          report.total = report.users + report.transactions + report.settings + report.currencies + report.methods;
          
          clearInterval(progressInterval);
          setRestoreProgress(100);
          setRestoreReport(report);
          setRestoreStatus('success');
          
          toast({
            title: "تم استعادة النسخة الاحتياطية بنجاح",
            description: `تم استعادة ${report.total} عنصر من البيانات`,
          });
          
        } catch (error) {
          console.error('Error parsing backup:', error);
          clearInterval(progressInterval);
          setRestoreStatus('error');
          toast({
            title: "فشل استعادة النسخة الاحتياطية",
            description: "تنسيق الملف غير صالح أو محتوى الملف تالف",
            variant: "destructive",
          });
        }
      };
      
      reader.onerror = () => {
        clearInterval(progressInterval);
        setRestoreStatus('error');
        toast({
          title: "فشل قراءة الملف",
          description: "حدث خطأ أثناء قراءة الملف",
          variant: "destructive",
        });
      };
      
      reader.readAsText(file);
      
    } catch (error) {
      console.error('Error restoring backup:', error);
      setRestoreStatus('error');
      toast({
        title: "حدث خطأ",
        description: "فشل استعادة النسخة الاحتياطية",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBackup = () => {
    try {
      // Gather all data from localStorage
      const backup = {
        users: JSON.parse(localStorage.getItem('registeredUsers') || '[]'),
        transactions: JSON.parse(localStorage.getItem('transactions_data') || '[]'),
        exchangeRate: JSON.parse(localStorage.getItem('exchange_rate') || '{}'),
        depositMethods: JSON.parse(localStorage.getItem('deposit_methods') || '[]'),
        withdrawalMethods: JSON.parse(localStorage.getItem('withdrawal_methods') || '[]'),
        currencies: JSON.parse(localStorage.getItem('supportedCurrencies') || '[]'),
        createdAt: new Date().toISOString(),
      };
      
      // Convert to JSON string
      const backupJson = JSON.stringify(backup, null, 2);
      
      // Create a blob and download link
      const blob = new Blob([backupJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast({
        title: "تم إنشاء النسخة الاحتياطية بنجاح",
      });
    } catch (error) {
      console.error('Error creating backup:', error);
      toast({
        title: "فشل إنشاء النسخة الاحتياطية",
        description: "حدث خطأ أثناء إنشاء الملف",
        variant: "destructive",
      });
    }
  };

  return (
    <CardSection title="النسخ الاحتياطية واستعادة البيانات">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">إنشاء نسخة احتياطية</h3>
          <p className="text-sm text-muted-foreground">
            قم بإنشاء نسخة احتياطية كاملة من بيانات النظام بما في ذلك المستخدمين والمعاملات والإعدادات
          </p>
          
          <Button onClick={handleCreateBackup} className="w-full sm:w-auto">
            إنشاء نسخة احتياطية
          </Button>
        </div>
        
        <div className="border-t border-[#2A3348] pt-6 space-y-4">
          <h3 className="text-lg font-medium">استعادة نسخة احتياطية</h3>
          <p className="text-sm text-muted-foreground">
            قم برفع ملف النسخة الاحتياطية بصيغة JSON لاستعادة بيانات النظام
          </p>
          
          <div className="grid gap-4">
            <div className="flex items-center justify-center w-full">
              <label 
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-[#1E293B] border-[#2A3348] hover:border-primary/50"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ArrowUpFromLine className="w-8 h-8 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">اضغط لاختيار ملف</span> أو اسحب وأفلت
                  </p>
                  <p className="text-xs text-muted-foreground">JSON (الحد الأقصى: 10 ميجابايت)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".json"
                  onChange={handleFileChange}
                  disabled={isLoading}
                />
              </label>
            </div>
            
            {file && (
              <div className="text-sm bg-[#1E293B] border border-[#2A3348] rounded p-2 flex items-center justify-between">
                <span className="truncate">{file.name}</span>
                <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} كيلوبايت</span>
              </div>
            )}
            
            {restoreStatus === 'progress' && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>جارٍ استعادة البيانات...</span>
                  <span>{restoreProgress}%</span>
                </div>
                <Progress value={restoreProgress} className="h-2" />
              </div>
            )}
            
            {restoreStatus === 'success' && (
              <Alert className="border-green-500 bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle>تمت الاستعادة بنجاح</AlertTitle>
                <AlertDescription>
                  <div className="text-sm mt-2 space-y-1">
                    <p>تمت استعادة {restoreReport.total} عنصر من البيانات:</p>
                    <ul className="list-disc list-inside">
                      <li>المستخدمين: {restoreReport.users}</li>
                      <li>المعاملات: {restoreReport.transactions}</li>
                      <li>العملات: {restoreReport.currencies}</li>
                      <li>طرق الدفع: {restoreReport.methods}</li>
                      <li>الإعدادات العامة: {restoreReport.settings}</li>
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            {restoreStatus === 'error' && (
              <Alert className="border-red-500 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertTitle>فشل الاستعادة</AlertTitle>
                <AlertDescription>
                  حدث خطأ أثناء استعادة البيانات. تأكد من صحة تنسيق الملف وحاول مرة أخرى.
                </AlertDescription>
              </Alert>
            )}
            
            <Button 
              onClick={handleRestore} 
              disabled={!file || isLoading} 
              className="w-full"
            >
              {isLoading ? "جارٍ الاستعادة..." : "استعادة النسخة الاحتياطية"}
            </Button>
          </div>
        </div>
      </div>
    </CardSection>
  );
};

export default BackupRestoreForm;
