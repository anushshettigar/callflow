import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Phone,
  PhoneIncoming,
  PhoneMissed,
  Clock,
  DollarSign,
  ArrowRight,
  MoreVertical,
  RefreshCw,
  Calendar,
  Download
} from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { SelectDropdown } from '../components/ui/Dropdown';
import { Pagination } from '../components/ui/Pagination';
import { Avatar } from '../components/ui/Avatar';
import { Table, Column } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { SkeletonTable } from '../components/ui/Skeleton';
import { Tooltip } from '../components/ui/Tooltip';

import { mockCallRecords } from '../data/calls';
import { mockLeads, getLeadById } from '../data/leads';
import { CallRecord } from '../types';
import { formatRelativeTime, formatCurrency, formatDuration, formatDateTime, classNames, generateId } from '../utils';
import { useCall } from '../hooks/useCall';
import { useToast } from '../components/ui/Toast';

const TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'incoming', label: 'Incoming' },
  { value: 'outgoing', label: 'Outgoing' },
  { value: 'missed', label: 'Missed' }
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'completed', label: 'Completed' },
  { value: 'missed', label: 'Missed' },
  { value: 'declined', label: 'Declined' },
  { value: 'voicemail', label: 'Voicemail' },
  { value: 'in-progress', label: 'In Progress' }
];

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export function Recent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { startCall, callState, resetCall } = useCall();
  const { addToast } = useToast();

  const filteredCalls = useMemo(() => {
    let result = [...mockCallRecords];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(call => {
        const lead = getLeadById(call.leadId);
        return lead?.name.toLowerCase().includes(query) ||
          lead?.company.toLowerCase().includes(query) ||
          lead?.phone.includes(query) ||
          call.outcome?.toLowerCase().includes(query);
      });
    }

    if (typeFilter) {
      result = result.filter(call => call.type === typeFilter);
    }

    if (statusFilter) {
      result = result.filter(call => call.status === statusFilter);
    }

    if (dateFrom) {
      result = result.filter(call => new Date(call.startTime) >= new Date(dateFrom));
    }

    if (dateTo) {
      result = result.filter(call => new Date(call.startTime) <= new Date(dateTo));
    }

    return result.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  }, [searchQuery, typeFilter, statusFilter, dateFrom, dateTo]);

  const totalPages = Math.ceil(filteredCalls.length / itemsPerPage);
  const paginatedCalls = filteredCalls.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCallback = async (call: CallRecord) => {
    const lead = getLeadById(call.leadId);
    if (lead) {
      setSelectedCall(call);
      const success = await startCall(lead.id, lead.phone);
      if (!success) {
        addToast({
          type: 'error',
          title: 'Call Failed',
          message: 'Unable to start callback. Please check microphone permissions.'
        });
      }
    }
  };

  const handleCallEnded = () => {
    if (selectedCall) {
      const lead = getLeadById(selectedCall.leadId);
      if (lead) {
        addToast({
          type: 'success',
          title: 'Callback Completed',
          message: `Callback with ${lead.name} ended. Duration: ${callState.timer}s`
        });
      }
    }
    resetCall();
    setSelectedCall(null);
  };

  const typeCounts = useMemo(() => {
    return TYPE_OPTIONS.reduce((acc, opt) => {
      if (opt.value) acc[opt.value] = mockCallRecords.filter(c => c.type === opt.value).length;
      return acc;
    }, {} as Record<string, number>);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600" />
            Recent Calls
          </h1>
          <p className="text-gray-500 mt-1">Complete call history with filters and search</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1000); }}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Type Filter Chips */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-2">
            {TYPE_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                variant={typeFilter === opt.value ? 'primary' : 'outline'}
                size="sm"
                onClick={() => { setTypeFilter(typeFilter === opt.value ? '' : opt.value); setCurrentPage(1); }}
                className="gap-1"
              >
                {opt.value && (
                  <Badge
                    variant={opt.value === 'incoming' ? 'info' : opt.value === 'outgoing' ? 'success' : 'warning'}
                    size="sm"
                    className="mr-1"
                  >
                    {opt.value === 'incoming' ? <PhoneIncoming className="w-3 h-3" /> : opt.value === 'outgoing' ? <Phone className="w-3 h-3" /> : <PhoneMissed className="w-3 h-3" />}
                  </Badge>
                )}
                {opt.label} {opt.value && <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{typeCounts[opt.value] || 0}</span>}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="pt-6 pb-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search by name, company, outcome, notes..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <SelectDropdown
                value={statusFilter}
                options={STATUS_OPTIONS}
                onChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}
                placeholder="Status"
                className="w-40"
              />
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
                placeholder="From"
                className="w-36"
              />
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
                placeholder="To"
                className="w-36"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCalls.length)} of {filteredCalls.length} calls
        </span>
      </div>

      {/* Calls Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <SkeletonTable rows={itemsPerPage} columns={8} />
          ) : (
            <Table<CallRecord>
              columns={[
                { key: 'type', header: 'Type', width: '110px', render: (call) => (
                  <Badge
                    variant={call.type === 'incoming' ? 'info' : call.type === 'outgoing' ? 'success' : 'warning'}
                    size="sm"
                  >
                    {call.type === 'incoming' ? <PhoneIncoming className="w-3 h-3 mr-1" /> : call.type === 'outgoing' ? <Phone className="w-3 h-3 mr-1" /> : <PhoneMissed className="w-3 h-3 mr-1" />}
                    {call.type.charAt(0).toUpperCase() + call.type.slice(1)}
                  </Badge>
                )},
                { key: 'customer', header: 'Customer', render: (call) => {
                  const lead = getLeadById(call.leadId);
                  return lead ? (
                    <div className="flex items-center gap-2">
                      <Avatar name={lead.name} size="sm" />
                      <div>
                        <p className="font-medium text-gray-900">{lead.name}</p>
                        <p className="text-sm text-gray-500">{lead.company}</p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500">Unknown</span>
                  );
                }},
                { key: 'datetime', header: 'Date & Time', width: '160px', render: (call) => (
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatDateTime(call.startTime)}</p>
                    <p className="text-xs text-gray-500">{formatRelativeTime(call.startTime)}</p>
                  </div>
                )},
                { key: 'duration', header: 'Duration', width: '100px', render: (call) => (
                  <span className="font-mono text-sm">{formatDuration(call.duration)}</span>
                )},
                { key: 'outcome', header: 'Outcome', render: (call) => (
                  <span className="text-sm text-gray-700 max-w-xs truncate block">{call.outcome || '—'}</span>
                )},
                { key: 'status', header: 'Status', width: '120px', render: (call) => (
                  <StatusBadge status={call.status} type="call" />
                )},
                { key: 'value', header: 'Value', width: '120px', render: (call) => {
                  const lead = getLeadById(call.leadId);
                  const value = lead ? lead.leadScore * 1000 : 0;
                  return <span className="font-medium text-green-600">{formatCurrency(value)}</span>;
                }},
                { key: 'actions', header: 'Actions', width: '120px', render: (call) => (
                  <div className="flex items-center gap-2">
                    {call.status === 'missed' && (
                      <Tooltip content="Callback">
                        <Button
                          variant={callState.leadId === call.leadId && callState.status !== 'idle' ? 'primary' : 'outline'}
                          size="icon"
                          onClick={() => handleCallback(call)}
                          disabled={callState.status !== 'idle' && callState.leadId !== call.leadId}
                          loading={callState.leadId === call.leadId && callState.status === 'calling'}
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                      </Tooltip>
                    )}
                    <Tooltip content="View Details">
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedCall(call); setShowCallModal(true); }}>
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </Tooltip>
                  </div>
                )}
              ]}
              data={paginatedCalls}
              keyExtractor={(call) => call.id}
              selectable={false}
              striped
              hoverable
              className="border-0"
            />
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredCalls.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
        itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
      />

      {/* Call Detail Modal */}
      <Modal
        isOpen={showCallModal}
        onClose={() => { setShowCallModal(false); setSelectedCall(null); }}
        title="Call Details"
        size="lg"
      >
        {selectedCall && (() => {
          const lead = getLeadById(selectedCall.leadId);
          return (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedCall.type === 'incoming' ? 'info' : selectedCall.type === 'outgoing' ? 'success' : 'warning'}
                >
                  {selectedCall.type === 'incoming' ? <PhoneIncoming className="w-3 h-3 mr-1" /> : selectedCall.type === 'outgoing' ? <Phone className="w-3 h-3 mr-1" /> : <PhoneMissed className="w-3 h-3 mr-1" />}
                  {selectedCall.type.charAt(0).toUpperCase() + selectedCall.type.slice(1)}
                </Badge>
                <StatusBadge status={selectedCall.status} type="call" />
              </div>

              {lead && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Avatar name={lead.name} size="sm" />
                    <span>{lead.name}</span>
                  </h4>
                  <p className="text-sm text-gray-500">{lead.company} • {lead.product}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="font-medium">{formatDateTime(selectedCall.startTime)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{formatDuration(selectedCall.duration)}</p>
                </div>
                {selectedCall.endTime && (
                  <div>
                    <p className="text-sm text-gray-500">Ended</p>
                    <p className="font-medium">{formatDateTime(selectedCall.endTime)}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Value at Stake</p>
                  <p className="font-medium text-green-600">{formatCurrency(lead ? lead.leadScore * 1000 : 0)}</p>
                </div>
              </div>

              {selectedCall.outcome && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Outcome</h4>
                  <p className="text-gray-600">{selectedCall.outcome}</p>
                </div>
              )}

              {selectedCall.notes && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedCall.notes}</p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                <Button variant="outline" onClick={() => { setShowCallModal(false); setSelectedCall(null); }}>Close</Button>
                {lead && selectedCall.status === 'missed' && (
                  <Button variant="primary" onClick={() => handleCallback(selectedCall)}>
                    <Phone className="w-4 h-4 mr-2" />
                    Callback
                  </Button>
                )}
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}

export default Recent;