"use client";

import React, { useState } from 'react';
import {
  Dialog,
  Card,
  Text,
  Caption,
  Checkbox,
  TextField,
  Button,
  Flex,
  Heading
} from "@hdfclife-insurance/one-x-ui";
import { useAppDispatch } from '../../store/hooks';
import { createClaim } from '../../store/slices/claimsSlice';

type Customer = {
  policyId: number;
  policyNumber: string;
  holderName: string;
  coverageAmount: number;
  email: string;
  phone: string;
  active: boolean;
  createdDate: string;
};

interface RaiseClaimModalProps {
  customer: Customer;
  onClose: () => void;
}

export default function RaiseClaimModal({ customer, onClose }: RaiseClaimModalProps) {
  const dispatch = useAppDispatch();
  const [amount, setAmount] = useState('');
  const [aadhar, setAadhar] = useState(false);
  const [pan, setPan] = useState(false);
  const [deathCert, setDeathCert] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid claim amount');
      return;
    }

    if (!aadhar && !pan && !deathCert) {
      alert('Please select at least one document');
      return;
    }

    setLoading(true);
    try {
      await dispatch(createClaim({
        policyId: customer.policyId,
        policyNumber: customer.policyNumber,
        claimantName: customer.holderName,
        claimAmount: parseFloat(amount),
        aadharSubmitted: aadhar,
        panSubmitted: pan,
        deathCertificateSubmitted: deathCert
      })).unwrap();
      onClose();
    } catch (error) {
      console.error('Error raising claim:', error);
      alert('Failed to raise claim. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      size="md"
      padding="lg"
      open={true}
      onOpenChange={(details) => !details.open && onClose()}
      title="Raise Insurance Claim"
      description={`Submit a new claim for policy ${customer.policyNumber}`}
      withFooter
      onCancel={onClose}
      onConfirm={handleSubmit}
      labels={{
        cancel: "Cancel",
        confirm: loading ? "Submitting..." : "Submit Claim"
      }}
      confirmButtonProps={{}}
    >
      <div className="space-y-6">
        {/* Customer Information Card */}
        <Card>
          <Flex align="center" justify="space-between" className="mb-4">
            <div>
              <Text fontWeight="bold" size="lg">{customer.holderName}</Text>
              <Caption>Policy Holder</Caption>
            </div>
          </Flex>
          
          <Card.Section className="bg-blue-50">
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Caption className="text-gray-800 text-sm">Policy Number</Caption>
                <Text className="text-gray-900" fontWeight="medium">
                  {customer.policyNumber}
                </Text>
              </div>
              <div className="space-y-1">
                <Caption className="text-gray-800 text-sm">Coverage Amount</Caption>
                <Text className="text-primary-blue" fontWeight="medium">
                  ₹{customer.coverageAmount.toLocaleString()}
                </Text>
              </div>
              <div className="space-y-1">
                <Caption className="text-gray-800 text-sm">Email</Caption>
                <Text className="text-gray-900" fontWeight="medium">
                  {customer.email}
                </Text>
              </div>
              <div className="space-y-1">
                <Caption className="text-gray-800 text-sm">Phone</Caption>
                <Text className="text-gray-900" fontWeight="medium">
                  {customer.phone}
                </Text>
              </div>
            </div>
          </Card.Section>
        </Card>

        {/* Claim Details */}
        <Card>
          <Heading as="h4" fontWeight="semibold" className="mb-4">
            Claim Details
          </Heading>
          
          <TextField
            label="Claim Amount (₹)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter claim amount"
            required
            className="mb-4"
          />
        </Card>

        {/* Document Submission */}
        <Card>
          <Heading as="h4" fontWeight="semibold" className="mb-4">
            Document Submission
          </Heading>
          <Caption className="text-gray-600 mb-4">
            Please confirm which documents you have submitted with this claim
          </Caption>
          
          <div className="space-y-3">
            <Checkbox
              label="Aadhar Card"
              checked={aadhar}
              onCheckedChange={(details) => setAadhar(!!details.checked)}
            />
            <Checkbox
              label="PAN Card"
              checked={pan}
              onCheckedChange={(details) => setPan(!!details.checked)}
            />
            <Checkbox
              label="Death Certificate"
              checked={deathCert}
              onCheckedChange={(details) => setDeathCert(!!details.checked)}
            />
          </div>
        </Card>
      </div>
    </Dialog>
  );
}