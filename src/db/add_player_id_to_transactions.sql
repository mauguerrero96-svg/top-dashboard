-- Add player_id to financial_transactions
ALTER TABLE public.financial_transactions 
ADD COLUMN IF NOT EXISTS player_id uuid REFERENCES public.players(id) ON DELETE SET NULL;
