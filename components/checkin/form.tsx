'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { getTodayDate, getCurrentSprintWeek } from '@/lib/utils/date';

interface CheckInFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  displayName: string;
  onSubmit: (data: {
    sprintWeek: string;
    yesterday: string;
    today: string;
    impediments: string;
    helpNeeded: string;
  }) => Promise<void>;
}

export function CheckInForm({
  open,
  onOpenChange,
  displayName,
  onSubmit,
}: CheckInFormProps) {
  const [formData, setFormData] = useState({
    sprintWeek: getCurrentSprintWeek(),
    yesterday: '',
    today: '',
    impediments: '',
    helpNeeded: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
      // Reset form
      setFormData({
        sprintWeek: getCurrentSprintWeek(),
        yesterday: '',
        today: '',
        impediments: '',
        helpNeeded: '',
      });
    } catch (error) {
      console.error('Error submitting check-in:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Daily Check-In</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input value={getTodayDate()} disabled />
            </div>

            <div className="space-y-2">
              <Label>Student Name</Label>
              <Input value={displayName} disabled />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sprintWeek">Sprint Week</Label>
            <Input
              id="sprintWeek"
              value={formData.sprintWeek}
              onChange={(e) =>
                setFormData({ ...formData, sprintWeek: e.target.value })
              }
              placeholder="e.g., Sprint 1 - Week 2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="yesterday">What I did yesterday *</Label>
            <Textarea
              id="yesterday"
              value={formData.yesterday}
              onChange={(e) =>
                setFormData({ ...formData, yesterday: e.target.value })
              }
              placeholder="Describe what you accomplished yesterday"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="today">What I am doing today *</Label>
            <Textarea
              id="today"
              value={formData.today}
              onChange={(e) =>
                setFormData({ ...formData, today: e.target.value })
              }
              placeholder="Describe your plan for today"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="impediments">Impediments</Label>
            <Textarea
              id="impediments"
              value={formData.impediments}
              onChange={(e) =>
                setFormData({ ...formData, impediments: e.target.value })
              }
              placeholder="Any blockers or issues? (optional)"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="helpNeeded">Help Needed</Label>
            <Textarea
              id="helpNeeded"
              value={formData.helpNeeded}
              onChange={(e) =>
                setFormData({ ...formData, helpNeeded: e.target.value })
              }
              placeholder="What help do you need? (optional)"
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !formData.yesterday || !formData.today}
          >
            {submitting ? 'Submitting...' : 'Submit Check-In'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
