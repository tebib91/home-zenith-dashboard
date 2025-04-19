
import AppGrid from '@/components/dashboard/AppGrid';
import PowerControls from '@/components/dashboard/PowerControls';
import SystemStats from '@/components/dashboard/SystemStats';
import WidgetGrid from '@/components/dashboard/WidgetGrid';

const Dashboard = () => {
  return (
    <div className="animate-fade-in pb-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Monitor your system and manage your applications
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column - System Stats and Power Controls (1/8 width) */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <SystemStats />
          </div>

          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="mb-4">
              <h3 className="text-xl font-semibold">Power Options</h3>
            </div>
            <PowerControls />
          </div>
        </div>

        {/* Middle Column - Applications (2/4 width) */}
        <div className="md:col-span-8 rounded-xl border bg-card p-4 shadow-sm">
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Applications</h3>
          </div>
          <AppGrid />
        </div>

        {/* Right Column - Widgets (1/8 width) */}
        <div className="md:col-span-2 rounded-xl border bg-card p-4 shadow-sm">
          <WidgetGrid />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
