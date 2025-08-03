import React, { useState, useEffect } from 'react';
import { Plus, DollarSign, TrendingUp, TrendingDown, PiggyBank, Wallet } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BottomNavigation from '@/components/BottomNavigation';

interface UserBalance {
  current_balance: number;
  total_savings: number;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  transaction_date: string;
  category?: {
    name: string;
    color: string;
  };
}

const Home = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [balance, setBalance] = useState<UserBalance>({ current_balance: 0, total_savings: 0 });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBalance();
      fetchRecentTransactions();
    }
  }, [user]);

  const fetchBalance = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_balances')
      .select('current_balance, total_savings')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      toast({
        title: 'Error',
        description: 'Failed to fetch balance',
        variant: 'destructive',
      });
    } else if (data) {
      setBalance(data);
    }
  };

  const fetchRecentTransactions = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('transactions')
      .select(`
        id,
        type,
        amount,
        description,
        transaction_date,
        categories (
          name,
          color
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch transactions',
        variant: 'destructive',
      });
    } else if (data) {
      setRecentTransactions(data.map(t => ({
        ...t,
        category: t.categories
      })));
    }
    setLoading(false);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income':
        return TrendingUp;
      case 'expense':
        return TrendingDown;
      case 'savings_transfer':
        return PiggyBank;
      case 'savings_withdrawal':
        return Wallet;
      default:
        return DollarSign;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'text-success';
      case 'expense':
        return 'text-expense';
      case 'savings_transfer':
        return 'text-primary';
      case 'savings_withdrawal':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatAmount = (amount: number, type: string) => {
    const prefix = type === 'expense' || type === 'savings_transfer' ? '-' : '+';
    return `${prefix}₹${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 pb-20">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground p-6 rounded-b-3xl shadow-glow">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back!</h1>
            <p className="text-primary-foreground/80">Track your finances with ease</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="px-4 -mt-6 space-y-6">
        {/* Balance Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-card shadow-card border-0">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-income rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-success-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Balance</p>
                  <p className="text-xl font-bold text-foreground">
                    ₹{balance.current_balance.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-0">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <PiggyBank className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Savings</p>
                  <p className="text-xl font-bold text-foreground">
                    ₹{balance.total_savings.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                className="bg-gradient-income hover:shadow-glow transition-all duration-300 h-12"
                onClick={() => {/* TODO: Add income modal */}}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Income
              </Button>
              <Button 
                variant="outline"
                className="h-12 border-2 hover:bg-expense/5 hover:border-expense transition-all duration-300"
                onClick={() => {/* TODO: Add expense modal */}}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
              <Button 
                variant="outline"
                className="h-12 border-2 hover:bg-primary/5 hover:border-primary transition-all duration-300"
                onClick={() => {/* TODO: Add savings modal */}}
              >
                <PiggyBank className="w-4 h-4 mr-2" />
                Transfer to Savings
              </Button>
              <Button 
                variant="outline"
                className="h-12 border-2 hover:bg-warning/5 hover:border-warning transition-all duration-300"
                onClick={() => {/* TODO: Add withdrawal modal */}}
              >
                <Wallet className="w-4 h-4 mr-2" />
                Withdraw Savings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
            <CardDescription>Your latest financial activities</CardDescription>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No transactions yet</p>
                <p className="text-sm text-muted-foreground">Start by adding your first transaction</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((transaction) => {
                  const Icon = getTransactionIcon(transaction.type);
                  const colorClass = getTransactionColor(transaction.type);
                  
                  return (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          transaction.type === 'income' ? 'bg-gradient-income' :
                          transaction.type === 'expense' ? 'bg-gradient-expense' :
                          'bg-gradient-primary'
                        }`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {transaction.description || transaction.category?.name || 'Transaction'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.transaction_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className={`font-semibold ${colorClass}`}>
                        {formatAmount(transaction.amount, transaction.type)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Home;