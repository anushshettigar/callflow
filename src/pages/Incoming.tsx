import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  PhoneIncoming,
  PhoneMissed,
  Clock,
  DollarSign,
  ArrowRight,
  MoreVertical,
  RefreshCw,
  Bell
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

import { mockCallRecords, getIncomingCalls, getMissedCalls } from '../data/calls';
import { mockLeads, getLeadById } from '../data/leads';
import { CallRecord } from '../types';
import { formatRelativeTime, formatCurrency, formatDuration, classNames, generateId } from '../utils';
import { useCall } from '../hooks/useCall';
import { useToast } from '../components/ui/Toast';

const TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'incoming', label: 'Incoming' },
  { value: 'missed', label: 'Missed' }
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'completed', label: 'Completed' },
  { value: 'missed', label: 'Missed' },
  { value: 'declined', label: 'Declined' },
  { value: 'voicemail', label: 'Voicemail' }
];

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export function Incoming() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { startCall, callState, resetCall } = useCall();
  const { addToast } = useToast();

  const allCalls = useMemo(() => {
    return [...mockCallRecords].filter(c => c.type === 'incoming' || c.type === 'missed');
  }, []);

  const filteredCalls = useMemo(() => {
    let result = [...allCalls];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(call => {
        const lead = getLeadById(call.leadId);
        return lead?.name.toLowerCase().includes(query) ||
          lead?.company.toLowerCase().includes(query) ||
          lead?.phone.includes(query);
      });
    }

    if (typeFilter) {
      result = result.filter(call => call.type === typeFilter);
    }

    if (statusFilter) {
      result = result.filter(call => call.status === statusFilter);
    }

    return result.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  }, [searchQuery, typeFilter, statusFilter]);

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

  const missedCallsCount = allCalls.filter(c => c.status === 'missed').length;
  const incomingCallsCount = allCalls.filter(c => c.type === 'incoming').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <PhoneIncoming className="w-6 h-6 text-blue-600" />
            Incoming Calls
          </h1>
          <p className="text-gray-500 mt-1">Manage incoming and missed calls</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1000); }}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Missed: {missedCallsCount}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <PhoneIncoming className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{incomingCallsCount}</p>
                <p className="text-sm text-gray-500">Incoming Calls</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                <PhoneMissed className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{missedCallsCount}</p>
                <p className="text-sm text-gray-500">Missed Calls</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{allCalls.filter(c => c.status === 'completed').length}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(allCalls.reduce((sum, c) => sum + (c.duration * 50), 0))}
                </p>
                <p className="text-sm text-gray-500">Est. Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="pt-6 pb-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search by name, company, phone..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <SelectDropdown
                value={typeFilter}
                options={TYPE_OPTIONS}
                onChange={(v) => { setTypeFilter(v); setCurrentPage(1); }}
                placeholder="Type"
                className="w-36"
              />
              <SelectDropdown
                value={statusFilter}
                options={STATUS_OPTIONS}
                onChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}
                placeholder="Status"
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
            <SkeletonTable rows={itemsPerPage} columns={7} />
          ) : (
            <Table<CallRecord>
              columns={[
                { key: 'type', header: 'Type', width: '120px', render: (call) => (
                  <Badge variant={call.type === 'incoming' ? 'info' : 'warning'} size="sm">
                    {call.type === 'incoming' ? <PhoneIncoming className="w-3 h-3 mr-1" /> : <PhoneMissed className="w-3 h-3 mr-1" />}
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
                { key: 'time', header: 'Time', width: '140px', render: (call) => (
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{new Date(call.startTime).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">{new Date(call.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                )},
                { key: 'duration', header: 'Duration', width: '100px', render: (call) => (
                  <span className="font-mono text-sm">{formatDuration(call.duration)}</span>
                )},
                { key: 'value', header: 'Value at Stake', width: '140px', render: (call) => {
                  const lead = getLeadById(call.leadId);
                  const value = lead ? lead.leadScore * 1000 : 0;
                  return <span className="font-medium text-green-600">{formatCurrency(value)}</span>;
                }},
                { key: 'status', header: 'Status', width: '120px', render: (call) => (
                  <StatusBadge status={call.status} type="call" />
                )},
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
                          <PhoneIncoming className="w-4 h-4" />
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
                <Badge variant={selectedCall.type === 'incoming' ? 'info' : 'warning'}>
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
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">{new Date(selectedCall.startTime).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{formatDuration(selectedCall.duration)}</p>
                </div>
                {selectedCall.endTime && (
                  <div>
                    <p className="text-sm text-gray-500">Ended</p>
                    <p className="font-medium">{new Date(selectedCall.endTime).toLocaleString()}</p>
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
                    <PhoneIncoming className="w-4 h-4 mr-2" />
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

export default Incoming;