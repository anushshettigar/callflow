import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Phone,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Star,
  Target,
  Clock,
  Mail,
  MapPin,
  Building2,
  User,
  Activity,
  RefreshCw,
  Download
} from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge, StatusBadge, PriorityBadge, ScoreBadge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { SelectDropdown } from '../components/ui/Dropdown';
import { Pagination } from '../components/ui/Pagination';
import { Avatar } from '../components/ui/Avatar';
import { Table, Column } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { SkeletonTable } from '../components/ui/Skeleton';
import { Tooltip } from '../components/ui/Tooltip';

import { mockLeads, sortLeadsByScore, getLeadById } from '../data/leads';
import { Lead } from '../types';
import { formatRelativeTime, classNames, generateId } from '../utils';
import { useCall } from '../hooks/useCall';
import { useToast } from '../components/ui/Toast';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'closed-won', label: 'Closed Won' },
  { value: 'closed-lost', label: 'Closed Lost' }
];

const PRIORITY_OPTIONS = [
  { value: '', label: 'All Priorities' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' }
];

const SORT_OPTIONS = [
  { value: 'score-desc', label: 'Lead Score (High to Low)' },
  { value: 'score-asc', label: 'Lead Score (Low to High)' },
  { value: 'intent-desc', label: 'Intent Score (High to Low)' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'recent', label: 'Most Recent Interaction' }
];

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export function CallsToMake() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('score-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { startCall, callState, resetCall } = useCall();
  const { addToast } = useToast();

  const filteredLeads = useMemo(() => {
    let result = [...mockLeads];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(lead =>
        lead.name.toLowerCase().includes(query) ||
        lead.company.toLowerCase().includes(query) ||
        lead.product.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query)
      );
    }

    if (statusFilter) {
      result = result.filter(lead => lead.status === statusFilter);
    }

    if (priorityFilter) {
      result = result.filter(lead => lead.priority === priorityFilter);
    }

    switch (sortBy) {
      case 'score-asc':
        return sortLeadsByScore(result, true);
      case 'intent-desc':
        return [...result].sort((a, b) => b.intentScore - a.intentScore);
      case 'name-asc':
        return [...result].sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return [...result].sort((a, b) => b.name.localeCompare(a.name));
      case 'recent':
        return [...result].sort((a, b) => new Date(b.lastInteraction).getTime() - new Date(a.lastInteraction).getTime());
      default:
        return sortLeadsByScore(result, false);
    }
  }, [searchQuery, statusFilter, priorityFilter, sortBy]);

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCall = async (lead: Lead) => {
    setSelectedLead(lead);
    const success = await startCall(lead.id);
    if (!success) {
      addToast({
        type: 'error',
        title: 'Call Failed',
        message: 'Unable to start call. Please check microphone permissions.'
      });
    }
  };

  const handleCallEnded = (outcome?: string, notes?: string) => {
    if (selectedLead) {
      addToast({
        type: 'success',
        title: 'Call Completed',
        message: `Call with ${selectedLead.name} ended. Duration: ${callState.timer}s`
      });
    }
    resetCall();
    setSelectedLead(null);
  };

  useEffect(() => {
    if (callState.status === 'ended') {
      handleCallEnded();
    }
  }, [callState.status]);

  const toggleExpand = (leadId: string) => {
    setExpandedRow(expandedRow === leadId ? null : leadId);
  };

  const openLeadModal = (lead: Lead) => {
    setSelectedLead(lead);
    setShowLeadModal(true);
  };

  const columns: Column<Lead>[] = [
    { key: 'rank', header: '#', width: '50px', render: (_: Lead, i: number) => <span className="text-gray-500">{(currentPage - 1) * itemsPerPage + i + 1}</span> },
    { key: 'lead', header: 'Lead', render: (lead) => (
      <div>
        <div className="flex items-center gap-2">
          <Avatar name={lead.name} size="sm" />
          <div>
            <p className="font-medium text-gray-900">{lead.name}</p>
            <p className="text-sm text-gray-500">{lead.company}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" size="sm">{lead.product}</Badge>
          <StatusBadge status={lead.status} />
        </div>
      </div>
    )},
    { key: 'scores', header: 'Scores', width: '160px', render: (lead) => (
      <div className="flex items-center gap-3">
        <Tooltip content="Lead Score">
          <ScoreBadge score={lead.leadScore} />
        </Tooltip>
        <Tooltip content="Intent Score">
          <Badge variant="info" size="sm">{lead.intentScore}</Badge>
        </Tooltip>
        <Tooltip content="ICP Score">
          <Badge variant="outline" size="sm">ICP {lead.icpScore}</Badge>
        </Tooltip>
      </div>
    )},
    { key: 'priority', header: 'Priority', width: '100px', render: (lead) => (
      <PriorityBadge priority={lead.priority} />
    )},
    { key: 'lastInteraction', header: 'Last Interaction', width: '160px', render: (lead) => (
      <div>
        <p className="text-sm text-gray-900">{formatRelativeTime(lead.lastInteraction)}</p>
        <p className="text-xs text-gray-500">{lead.nextAction}</p>
      </div>
    )},
    { key: 'assigned', header: 'Assigned', width: '140px', render: (lead) => (
      <div className="flex items-center gap-2">
        <Avatar name={lead.assignedAgent} size="xs" />
        <span className="text-sm text-gray-700">{lead.assignedAgent}</span>
      </div>
    )},
    { key: 'actions', header: 'Actions', width: '140px', render: (lead) => (
      <div className="flex items-center gap-2">
        <Tooltip content="View Details">
          <Button variant="ghost" size="icon" onClick={() => openLeadModal(lead)}>
            <MoreVertical className="w-4 h-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Call Lead">
          <Button
            variant={callState.leadId === lead.id && callState.status !== 'idle' ? 'primary' : 'outline'}
            size="icon"
            onClick={() => handleCall(lead)}
            disabled={callState.status !== 'idle' && callState.leadId !== lead.id}
            loading={callState.leadId === lead.id && callState.status === 'calling'}
          >
            <Phone className="w-4 h-4" />
          </Button>
        </Tooltip>
      </div>
    )}
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calls to Make</h1>
          <p className="text-gray-500 mt-1">Prioritized leads ranked by score and intent</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1000); }}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="primary" size="sm">
            <Phone className="w-4 h-4 mr-2" />
            Power Dialer
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="pt-6 pb-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search leads by name, company, product..."
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
              <SelectDropdown
                value={priorityFilter}
                options={PRIORITY_OPTIONS}
                onChange={(v) => { setPriorityFilter(v); setCurrentPage(1); }}
                placeholder="Priority"
                className="w-40"
              />
              <SelectDropdown
                value={sortBy}
                options={SORT_OPTIONS}
                onChange={setSortBy}
                placeholder="Sort"
                className="w-52"
              />
              <SelectDropdown
                value={String(itemsPerPage)}
                options={ITEMS_PER_PAGE_OPTIONS.map(o => ({ value: String(o), label: `${o} per page` }))}
                onChange={(v) => { setItemsPerPage(Number(v)); setCurrentPage(1); }}
                className="w-36"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredLeads.length)} of {filteredLeads.length} leads
        </span>
        <span>{filteredLeads.filter(l => l.priority === 'high').length} high priority</span>
      </div>

      {/* Leads Table */}
      <Card>
        <CardContent className="p-0">
{loading ? (
            <SkeletonTable rows={itemsPerPage} columns={7} />
          ) : (
            <Table<Lead>
              columns={columns}
              data={paginatedLeads}
              keyExtractor={(lead) => lead.id}
              onRowClick={(lead) => toggleExpand(lead.id)}
              selectable={false}
              striped
              hoverable
              className="border-0"
            />
          )}
        </CardContent>
      </Card>

      {/* Expanded Row Details */}
      {expandedRow && (
        <Card className="border-t-2 border-blue-500">
          <CardContent className="pt-0">
            {(() => {
              const lead = getLeadById(expandedRow);
              if (!lead) return null;
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 border-t border-gray-200">
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Customer Details</h4>
                      <dl className="grid grid-cols-2 gap-4 text-sm">
                        <div><dt className="text-gray-500">Email</dt><dd className="font-medium">{lead.email}</dd></div>
                        <div><dt className="text-gray-500">Phone</dt><dd className="font-medium">{lead.phone}</dd></div>
                        <div><dt className="text-gray-500">Company</dt><dd className="font-medium">{lead.company}</dd></div>
                        <div><dt className="text-gray-500">Product</dt><dd className="font-medium">{lead.product}</dd></div>
                        <div><dt className="text-gray-500">Assigned Agent</dt><dd className="font-medium">{lead.assignedAgent}</dd></div>
                        <div><dt className="text-gray-500">Created</dt><dd className="font-medium">{formatRelativeTime(lead.createdAt)}</dd></div>
                      </dl>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Notes</h4>
                      <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">{lead.notes}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Buying Signals</h4>
                      <ul className="space-y-2">
                        {lead.buyingSignals.map((signal, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                            {signal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Call History</h4>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {lead.callHistory.length > 0 ? (
                          lead.callHistory.map((call) => (
                            <div key={call.id} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">{call.type}</span>
                                <StatusBadge status={call.status} type="call" />
                              </div>
                              <p className="text-xs text-gray-500">{formatRelativeTime(call.startTime)}</p>
                              {call.outcome && <p className="text-sm text-gray-700 mt-1">{call.outcome}</p>}
                              {call.notes && <p className="text-xs text-gray-500 mt-1">{call.notes}</p>}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 text-center py-4">No call history</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Recommended Next Action</h4>
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-sm text-blue-800">{lead.nextAction}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredLeads.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
        itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
      />

      {/* Lead Detail Modal */}
      <Modal
        isOpen={showLeadModal}
        onClose={() => { setShowLeadModal(false); setSelectedLead(null); }}
        title={selectedLead?.name}
        size="xl"
      >
        {selectedLead && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={selectedLead.status} />
              <PriorityBadge priority={selectedLead.priority} />
              <Badge variant="info">Score: {selectedLead.leadScore}</Badge>
              <Badge variant="outline">Intent: {selectedLead.intentScore}</Badge>
              <Badge variant="outline">ICP: {selectedLead.icpScore}</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{selectedLead.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{selectedLead.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-medium">{selectedLead.company}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Product</p>
                <p className="font-medium">{selectedLead.product}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Assigned Agent</p>
                <p className="font-medium">{selectedLead.assignedAgent}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Interaction</p>
                <p className="font-medium">{formatRelativeTime(selectedLead.lastInteraction)}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Next Action</h4>
              <p className="text-gray-600">{selectedLead.nextAction}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Buying Signals</h4>
              <ul className="space-y-1">
                {selectedLead.buyingSignals.map((signal, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                    {signal}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedLead.notes}</p>
            </div>

            <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setShowLeadModal(false); setSelectedLead(null); }}>Close</Button>
              <Button variant="primary" onClick={() => handleCall(selectedLead)}>
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default CallsToMake;