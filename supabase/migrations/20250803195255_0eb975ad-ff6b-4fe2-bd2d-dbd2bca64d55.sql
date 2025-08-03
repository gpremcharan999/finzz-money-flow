-- Fix security warning for function search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Fix security warning for function search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (user_id, name, phone_number)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'name', ''), 
    COALESCE(NEW.raw_user_meta_data ->> 'phone_number', NEW.phone)
  );
  
  -- Insert user balance
  INSERT INTO public.user_balances (user_id, current_balance, total_savings)
  VALUES (NEW.id, 0, 0);
  
  -- Insert default categories for the new user
  INSERT INTO public.categories (user_id, name, color) VALUES
    (NEW.id, 'Food', '#FF6B6B'),
    (NEW.id, 'Vegetables', '#4ECDC4'),
    (NEW.id, 'Transport', '#45B7D1'),
    (NEW.id, 'Entertainment', '#96CEB4'),
    (NEW.id, 'Bills', '#FFEAA7'),
    (NEW.id, 'Shopping', '#DDA0DD');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';