'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

export default function Home() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to join waitlist');
      }
      
      setStatus('success');
      toast({
        title: "Success!",
        description: "You've been added to the waitlist.",
      });
      setEmail('');
    } catch (error) {
      setStatus('error');
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to join waitlist',
      });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">AIMaker Waitlist</h1>
          <p className="text-xl text-gray-300 mb-8">
            Join our waitlist to be the first to know when we launch!
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
} 