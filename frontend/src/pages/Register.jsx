// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageWrapper from '@/components/PageWrapper';
import { api } from '@/lib/api';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    accountType: 'customer',
  });

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await api.post('/auth/register', {
        email: form.email,
        password: form.password,
        role: form.accountType,
      });

      navigate('/signin');
    } catch (err) {
      console.error(err);
      setError('Registration failed. Email may already be registered.');
    }

    setSubmitting(false);
  };

  return (
    <PageWrapper>
      <div className="min-h-screen flex items-center justify-center px-4 py-24">
        <Card className="w-full max-w-md border-border/50 shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Account Type</Label>
                <select
                  className="w-full border rounded-md p-2 bg-muted/50"
                  value={form.accountType}
                  onChange={(e) => setForm({ ...form, accountType: e.target.value })}
                >
                  <option value="customer">Customer</option>
                  <option value="provider">Provider</option>
                </select>
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Creating account...' : 'Create account'}
              </Button>
            </form>

            <p className="text-center text-sm mt-4">
              Already have an account?{' '}
              <Link to="/signin" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
