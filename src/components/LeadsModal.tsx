import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Phone, Mail, MapPin, Building2, User, Star, Target, Clock, Eye, EyeOff, Download, Share2 } from 'lucide-react';

import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Badge, StatusBadge, PriorityBadge, ScoreBadge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Tooltip } from '../components/ui/Tooltip';

import { mockLeads, getLeadById } from '../data/leads';
import { Lead } from '../types';
import { formatRelativeTime, formatCurrency, classNames } from '../utils';
import { useCall } from '../hooks/useCall';
import { useToast } from '../components/ui/Toast';

interface LeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLeadId?: string;
  onCall?: (lead: Lead) => void;
}

export function LeadsModal({ isOpen, onClose, initialLeadId, onCall }: LeadsModalProps) {
  const [currentLeadId, setCurrentLeadId] = useState<string | null>(initialLeadId || null);
  const [showSignals, setShowSignals] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const { startCall, callState, resetCall } = useCall();
  const { addToast } = useToast();

  const lead = currentLeadId ? getLeadById(currentLeadId) : null;
  const currentIndex = currentLeadId ? mockLeads.findIndex(l => l.id === currentLeadId) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < mockLeads.length - 1 && currentIndex !== -1;

  useEffect(() => {
    if (initialLeadId && initialLeadId !== currentLeadId) {
      setCurrentLeadId(initialLeadId);
    }
  }, [initialLeadId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && hasPrev) {
        navigatePrev();
      } else if (e.key === 'ArrowRight' && hasNext) {
        navigateNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasPrev, hasNext, onClose]);

  const navigatePrev = useCallback(() => {
    if (hasPrev) {
      setCurrentLeadId(mockLeads[currentIndex - 1].id);
    }
  }, [hasPrev, currentIndex]);

  const navigateNext = useCallback(() => {
    if (hasNext) {
      setCurrentLeadId(mockLeads[currentIndex + 1].id);
    }
  }, [hasNext, currentIndex]);

  const handleCall = async (lead: Lead) => {
    if (onCall) {
      onCall(lead);
    } else {
      const success = await startCall(lead.id);
      if (!success) {
        addToast({
          type: 'error',
          title: 'Call Failed',
          message: 'Unable to start call. Please check microphone permissions.'
        });
      }
    }
  };

  if (!lead) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lead.name}
      size="xl"
      showCloseButton={true}
      closeOnOverlayClick={true}
      closeOnEscape={true}
    >
      <div className="space-y-6">
        {/* Lead Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar name={lead.name} size="lg" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{lead.name}</h2>
              <p className="text-gray-500">{lead.company} • {lead.product}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={lead.status} />
            <PriorityBadge priority={lead.priority} />
            <Tooltip content="Lead Score">
              <ScoreBadge score={lead.leadScore} />
            </Tooltip>
            <Tooltip content="Intent Score">
              <Badge variant="info" size="md">{lead.intentScore}</Badge>
            </Tooltip>
            <Tooltip content="ICP Score">
              <Badge variant="outline" size="md">ICP {lead.icpScore}</Badge>
            </Tooltip>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-900 truncate">{lead.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium text-gray-900">{lead.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Assigned Agent</p>
            <p className="font-medium text-gray-900 flex items-center gap-1">
              <Avatar name={lead.assignedAgent} size="xs" />
              {lead.assignedAgent}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Interaction</p>
            <p className="font-medium text-gray-900">{formatRelativeTime(lead.lastInteraction)}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-4 -mb-px" aria-label="Lead details tabs">
            <button
              onClick={() => { setShowSignals(true); setShowHistory(false); }}
              className={classNames(
                'pb-3 px-1 border-b-2 font-medium text-sm transition-colors',
                showSignals ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              <Eye className="w-4 h-4 mr-1 inline" />
              Buying Signals
            </button>
            <button
              onClick={() => { setShowSignals(false); setShowHistory(true); }}
              className={classNames(
                'pb-3 px-1 border-b-2 font-medium text-sm transition-colors',
                showHistory ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              <Clock className="w-4 h-4 mr-1 inline" />
              Call History
            </button>
          </nav>
        </div>

        {/* Buying Signals */}
        {showSignals && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Buying Signals
              </h3>
              <Badge variant="outline" size="sm">{lead.buyingSignals.length} signals</Badge>
            </div>
            <div className="space-y-3">
              {lead.buyingSignals.map((signal, i) => (
                <div
                  key={i}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Star className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-gray-700 mt-0.5">{signal}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Next Action */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-600" />
                <h4 className="font-medium text-blue-800">Recommended Next Action</h4>
              </div>
              <p className="text-blue-700">{lead.nextAction}</p>
            </div>

            {/* Notes */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Notes
              </h3>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{lead.notes}</p>
            </div>
          </div>
        )}

        {/* Call History */}
        {showHistory && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Call History
              </h3>
              <Badge variant="outline" size="sm">{lead.callHistory.length} calls</Badge>
            </div>
            {lead.callHistory.length > 0 ? (
              <div className="space-y-3">
                {lead.callHistory.map((call) => (
                  <div key={call.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={call.type === 'incoming' ? 'info' : call.type === 'outgoing' ? 'success' : 'warning'} size="sm">
                          {call.type.charAt(0).toUpperCase() + call.type.slice(1)}
                        </Badge>
                        <StatusBadge status={call.status} type="call" />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{formatRelativeTime(call.startTime)}</span>
                        <span>•</span>
                        <span>{formatRelativeTime(call.startTime).split(' ')[0]} at {new Date(call.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                    {call.outcome && <p className="text-gray-700 mb-1"><strong>Outcome:</strong> {call.outcome}</p>}
                    {call.notes && <p className="text-gray-600 text-sm"><strong>Notes:</strong> {call.notes}</p>}
                    <p className="text-xs text-gray-400 mt-2">Duration: {call.duration > 0 ? `${Math.floor(call.duration / 60)}m ${call.duration % 60}s` : 'Missed'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No call history</p>
                <p className="text-sm mt-1">Calls will appear here after you connect</p>
              </div>
            )}
          </div>
        )}

        {/* Navigation & Actions */}
        <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={navigatePrev}
              disabled={!hasPrev}
              aria-label="Previous lead"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-gray-500 px-4">
              {currentIndex + 1} of {mockLeads.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={navigateNext}
              disabled={!hasNext}
              aria-label="Next lead"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleCall(lead)}
              disabled={callState.status !== 'idle' && callState.leadId !== lead.id}
              loading={callState.leadId === lead.id && callState.status === 'calling'}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Now
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default LeadsModal;