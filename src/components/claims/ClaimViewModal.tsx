"use client";

import React, { useState } from 'react';
import {
  Dialog,
  Card,
  Text,
  Caption,
  Checkbox,
  Button,
  Flex,
  Heading,
  Badge,
  TextArea
} from "@hdfclife-insurance/one-x-ui";
import { useAppDispatch } from '../../store/hooks';
import { updateClaimStatus } from '../../store/slices/claimsSlice';
import { Claim } from '../../store/slices/claimsSlice';

interface ClaimViewModalProps {
  claim: Claim;
  userRole: 'user' | 'admin';
  onClose: () => void;
}

export default function ClaimViewModal({ claim, userRole, onClose }: ClaimViewModalProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');

  const missingDocs: string[] = [];
  if (!claim.aadhaarSubmitted) missingDocs.push('Aadhar Card');
  if (!claim.panSubmitted) missingDocs.push('PAN Card');
  if (!claim.deathCertificateSubmitted) missingDocs.push('Death Certificate');

  const handleDecision = async (decision: 'Approved' | 'Rejected') => {
    if (decision === 'Rejected' && missingDocs.length > 0 && !note) {
      alert('Please provide a reason for rejection');
      return;
    }

    setLoading(true);
    try {
      await dispatch(updateClaimStatus({
        claimId: claim.claimId,
        status: decision,
        adminNote: decision === 'Rejected'
          ? note || `Missing documents: ${missingDocs.join(', ')}`
          : note
      })).unwrap();
      // Do NOT call a parent refresh here — parent manages fetching.
      onClose();
    } catch (error) {
      console.error('Error processing claim decision:', error);
      alert('Failed to process decision. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): "primary" | "gray" | "green" | "blue" => {
    switch (status) {
      case 'Pending': return 'primary';
      case 'Approved': return 'green';
      case 'Rejected': return 'gray';
      default: return 'gray';
    }
  };

  const isAdmin = userRole === 'admin';
  const isPending = claim.status === 'Pending';
  const canTakeAction = isAdmin && isPending;

  return (
    <Dialog
      size="md"
      padding="lg"
      open={true}
      onOpenChange={(details) => !details.open && onClose()}
      title={`Claim Details #${claim.claimId}`}
      description={`View and manage insurance claim for policy ${claim.policyNumber}`}
      withFooter={canTakeAction}
      onCancel={canTakeAction ? onClose : undefined}
      labels={{
        cancel: "Close"
      }}
    >
      <div className="space-y-6">
        <Card>
          <Flex align="center" justify="space-between" className="mb-4">
            <Badge color={getStatusColor(claim.status)}>
              {claim.status}
            </Badge>
          </Flex>

          <Card.Section className="bg-blue-50">
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Caption className="text-gray-800 text-sm">Policy Number</Caption>
                <Text className="text-gray-900" fontWeight="medium">
                  {claim.policyNumber}
                </Text>
              </div>
              <div className="space-y-1">
                <Caption className="text-gray-800 text-sm">Claim Amount</Caption>
                <Text className="text-primary-blue" fontWeight="medium">
                  ₹{claim.claimAmount.toLocaleString()}
                </Text>
              </div>
              {claim.claimantName && (
                <div className="space-y-1">
                  <Caption className="text-gray-800 text-sm">Claimant Name</Caption>
                  <Text className="text-gray-900" fontWeight="medium">
                    {claim.claimantName}
                  </Text>
                </div>
              )}
              <div className="space-y-1">
                <Caption className="text-gray-800 text-sm">Status</Caption>
                <Badge color={getStatusColor(claim.status)}>
                  {claim.status}
                </Badge>
              </div>
            </div>
          </Card.Section>
        </Card>

        <Card>
          <Heading as="h3" fontWeight="semibold" className="mb-4">
            Document Verification
          </Heading>

          <div className="space-y-3">
            <Flex align="center" gap={3}>
              <Checkbox checked={claim.aadhaarSubmitted} readOnly />
              <Text color={claim.aadhaarSubmitted ? "green" : "red"}>
                Aadhar Card {claim.aadhaarSubmitted ? "✓ Submitted" : "✗ Missing"}
              </Text>
            </Flex>

            <Flex align="center" gap={3}>
              <Checkbox checked={claim.panSubmitted} readOnly />
              <Text color={claim.panSubmitted ? "green" : "red"}>
                PAN Card {claim.panSubmitted ? "✓ Submitted" : "✗ Missing"}
              </Text>
            </Flex>

            <Flex align="center" gap={3}>
              <Checkbox checked={claim.deathCertificateSubmitted} readOnly />
              <Text color={claim.deathCertificateSubmitted ? "green" : "red"}>
                Death Certificate {claim.deathCertificateSubmitted ? "✓ Submitted" : "✗ Missing"}
              </Text>
            </Flex>
          </div>

          {missingDocs.length > 0 && (
            <Card.Section className="bg-red-50 mt-4">
              <Text color="red" fontWeight="medium">
                Missing Documents: {missingDocs.join(', ')}
              </Text>
            </Card.Section>
          )}
        </Card>

        {canTakeAction && (
          <Card>
            <Heading as="h3" fontWeight="semibold" className="mb-4">
              Administrative Action
            </Heading>

            <TextArea
              label="Notes (Optional)"
              placeholder="Add any notes or reason for decision..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mb-4"
            />

            <Flex gap={3} justify="flex-end">
              <Button variant="secondary" color="gray" onClick={() => handleDecision('Rejected')} disabled={loading}>
                {loading ? 'Processing...' : 'Reject Claim'}
              </Button>
              <Button variant="primary" color="primary" onClick={() => handleDecision('Approved')} disabled={loading}>
                {loading ? 'Processing...' : 'Approve Claim'}
              </Button>
            </Flex>
          </Card>
        )}
      </div>
    </Dialog>
  );
}
