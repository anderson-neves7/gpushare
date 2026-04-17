import { Toaster } from '@/components/ui/toaster';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import Landing from '@/pages/Landing';
import SignIn from '@/pages/SignIn';
import Register from '@/pages/Register';
import Marketplace from '@/pages/Marketplace';
import GPUDetails from '@/pages/GPUDetails';
import RentGPU from '@/pages/RentGPU';
import Dashboard from '@/pages/Dashboard';
import Provider from '@/pages/Provider';
import ProviderAdd from '@/pages/ProviderAdd';
import ProviderEdit from '@/pages/ProviderEdit';
import Compute from '@/pages/Compute';
import SubmitJob from '@/pages/SubmitJob';
import JobDetails from '@/pages/JobDetails';

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/login" element={<SignIn />} />
              <Route path="/register" element={<Register />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/gpu/:id" element={<GPUDetails />} />
              <Route path="/rent/:id" element={<RentGPU />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/provider" element={<Provider />} />
              <Route path="/provider/add" element={<ProviderAdd />} />
              <Route path="/provider/edit/:id" element={<ProviderEdit />} />
              <Route path="/compute" element={<Compute />} />
              <Route path="/compute/submit" element={<SubmitJob />} />
              <Route path="/compute/:id" element={<JobDetails />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
