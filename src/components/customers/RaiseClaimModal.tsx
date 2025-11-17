"use client";

import React, { useState } from "react";
import {
  Dialog,
  Card,
  Text,
  Caption,
  Checkbox,
  TextField,
  Button,
  Flex,
  Heading,
} from "@hdfclife-insurance/one-x-ui";
import { useAppDispatch } from "../../store/hooks";
import { createClaim } from "../../store/slices/claimsSlice";
import { useAppSelector } from "../../store/hooks";

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

export default function RaiseClaimModal({
  customer,
  onClose,
}: RaiseClaimModalProps) {
  const dispatch = useAppDispatch();
  const [amount, setAmount] = useState("");
  const [aadhar, setAadhar] = useState(false);
  const [pan, setPan] = useState(false);
  const [deathCert, setDeathCert] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation helpers
  const claimAmount = parseFloat(amount) || 0;
  const isAmountValid = claimAmount > 0;
  const isAmountWithinCoverage = claimAmount <= customer.coverageAmount;
  const hasDocuments = aadhar || pan || deathCert;
  const userId = useAppSelector((s) => s.user.userId);
  const canSubmit =
    isAmountValid && isAmountWithinCoverage && hasDocuments && !loading;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow positive numbers
    if (value === "" || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
      setAmount(value);
    }
  };

  const handleSubmit = async () => {
    // Validation checks
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid claim amount greater than 0");
      return;
    }

    if (parseFloat(amount) > customer.coverageAmount) {
      alert(
        `Claim amount cannot exceed the coverage amount of ₹${customer.coverageAmount.toLocaleString()}`
      );
      return;
    }

    if (!aadhar && !pan && !deathCert) {
      alert("Please select at least one document");
      return;
    }

    if (!userId) {
       alert("User not logged in");
       return;
    }

    setLoading(true);
    try {
      await dispatch(
        createClaim({
          claimId: `CLM${Date.now()}`,
          userId: userId!,
          claimAmount: amount,
          policyNumber: customer.policyNumber,
          aadhaarSubmitted: aadhar,
          panSubmitted: pan,
          deathCertificateSubmitted: deathCert,
          claimStatus: "PENDING",
        })
      ).unwrap();

      onClose();
    } catch (error) {
      console.error("Error raising claim:", error);
      alert("Failed to raise claim. Please try again.");
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
      onConfirm={canSubmit ? handleSubmit : undefined}
      labels={{
        cancel: "Cancel",
        confirm: loading ? "Submitting..." : "Submit Claim",
      }}
    >
      <div className="space-y-6">
        {/* Customer Information Card */}
        <Card>
          <Flex align="center" justify="space-between" className="mb-4">
            <div>
              <Text fontWeight="bold" size="lg">
                {customer.holderName}
              </Text>
              <Caption>Policy Holder</Caption>
            </div>
          </Flex>

          <Card.Section className="bg-blue-50">
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Caption className="text-gray-800 text-sm">
                  Policy Number
                </Caption>
                <Text className="text-gray-900" fontWeight="medium">
                  {customer.policyNumber}
                </Text>
              </div>
              <div className="space-y-1">
                <Caption className="text-gray-800 text-sm">
                  Coverage Amount
                </Caption>
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

          <div className="space-y-2">
            <TextField
              label={`Claim Amount (₹) - Maximum: ₹${customer.coverageAmount.toLocaleString()}`}
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter claim amount"
              required
              max={customer.coverageAmount}
              min={0}
              step="0.01"
            />

            {/* Validation Messages */}
            {amount && !isAmountValid && (
              <Text size="sm" color="red" className="mt-1">
                Please enter a valid amount greater than 0
              </Text>
            )}

            {amount && isAmountValid && !isAmountWithinCoverage && (
              <Text size="sm" color="red" className="mt-1">
                Claim amount cannot exceed coverage amount of ₹
                {customer.coverageAmount.toLocaleString()}
              </Text>
            )}

            {amount && isAmountValid && isAmountWithinCoverage && (
              <Text size="sm" color="green" className="mt-1">
                ✓ Valid claim amount
              </Text>
            )}
          </div>
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

          {!hasDocuments && (
            <Text size="sm" color="red" className="mt-2">
              Please select at least one document
            </Text>
          )}
        </Card>

        {/* Summary Card */}
        {amount && isAmountValid && isAmountWithinCoverage && hasDocuments && (
          <Card>
            <Card.Section className="bg-green-50">
              <Heading
                as="h4"
                fontWeight="medium"
                className="mb-2 text-green-800"
              >
                Claim Summary
              </Heading>
              <div className="space-y-1">
                <Text size="sm">
                  <span className="font-medium">Claim Amount:</span> ₹
                  {claimAmount.toLocaleString()}
                </Text>
                <Text size="sm">
                  <span className="font-medium">Coverage Remaining:</span> ₹
                  {(customer.coverageAmount - claimAmount).toLocaleString()}
                </Text>
                <Text size="sm">
                  <span className="font-medium">Documents Selected:</span>{" "}
                  {[
                    aadhar && "Aadhar Card",
                    pan && "PAN Card",
                    deathCert && "Death Certificate",
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </Text>
              </div>
            </Card.Section>
          </Card>
        )}
      </div>
    </Dialog>
  );
}
