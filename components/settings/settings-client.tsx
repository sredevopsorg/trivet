"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SettingsClient({
  email,
  name
}: {
  email: string;
  name?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [confirmText, setConfirmText] = useState("");

  const deleteMutation = useMutation<unknown, Error>({
    mutationFn: async () => {
      const response = await fetch("/api/account", {
        method: "DELETE"
      });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Unable to delete account");
      }
      return response.json();
    },
    onSuccess: () => {
      window.location.assign("/?toast=deleted");
    }
  });

  const resetDialog = () => {
    setStep(1);
    setConfirmText("");
    deleteMutation.reset();
  };

  const closeDialog = () => {
    setOpen(false);
    resetDialog();
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-950">
          Settings
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your Trivet account details.
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl border border-gray-100 bg-white p-6">
          <div className="text-sm font-semibold">Account</div>
          <div className="mt-3 text-sm text-gray-600">
            {name ? `${name} · ${email}` : email}
          </div>
        </div>

        <div className="rounded-3xl border border-red/30 p-6">
          <div className="text-sm font-semibold text-red">Delete account</div>
          <p className="mt-2 text-sm text-red">
            This removes your Trivet account, configuration, and sign-in history.
          </p>
          <Button
            variant="outline"
            className="mt-4 border-red/40 text-red hover:bg-transparent"
            onClick={() => setOpen(true)}
          >
            Delete account
          </Button>
        </div>
      </div>

      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) {
            resetDialog();
          }
        }}
      >
        <DialogContent>
          {step === 1 ? (
            <>
              <DialogHeader>
                <DialogTitle>Delete your Trivet account?</DialogTitle>
                <DialogDescription>
                  This cannot be undone. You will need to set up Trivet again if
                  you come back.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="ghost" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  className="border-red/40 text-red hover:bg-transparent"
                  onClick={() => setStep(2)}
                >
                  Continue
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Final confirmation</DialogTitle>
                <DialogDescription>
                  Type DELETE to confirm removing your account.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Label htmlFor="deleteConfirm">Type DELETE</Label>
                <Input
                  id="deleteConfirm"
                  value={confirmText}
                  onChange={(event) => setConfirmText(event.target.value)}
                />
              </div>
              {deleteMutation.isError ? (
                <p className="text-sm text-red">{deleteMutation.error.message}</p>
              ) : null}
              <DialogFooter>
                <Button variant="ghost" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  variant="outline"
                  className="border-red/40 text-red hover:bg-transparent"
                  disabled={
                    confirmText !== "DELETE" || deleteMutation.isPending
                  }
                  onClick={() => deleteMutation.mutate()}
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete account"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
