import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeftRight, ArrowRightLeft } from "lucide-react"
import React from "react";
import confetti from "canvas-confetti";
import StateFullButton from "@/components/ui/stateful-button";

import { QRCodeSVG } from 'qrcode.react';

export function SettleUPDialog({ txn }) {




    const closeButtonRef = React.useRef(null);

    const handleConfirm = () => {
    
        return new Promise((resolve) => {
          setTimeout(() => {
             confetti({
                particleCount: 100,
                spread: 100,
                origin: { y: 0.85 },
                colors: ['#4ade80', '#22c55e', '#16a34a'],
            });
    
            setTimeout(() => {
              closeButtonRef.current.click() 
            }, 10)
            
            resolve(true)
          }, 1000) 
        })
    
      }



  const upiID='ruchisharmaggic@okaxis'
  const upiLink = `upi://pay?pa=${upiID}&am=${Math.abs(txn.net)}&cu=INR&tn=${encodeURIComponent(`Settle Transaction for ${txn.id}`)}`;

  // const upiLink = `upi://pay?pa=${upiID}&am=${Math.abs(txn.net)}&cu=INR&tn=Settle%20Transaction%20for%20${txn.id}`;
  return (
    <Dialog>
      <DialogTrigger asChild>
        
        <Button
                                      size="sm"
                                      variant="default"
                                      className="bg-gradient-to-br from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                                    >
                                      Settle Up <ArrowLeftRight className="w-4 h-4 ml-1" />
                                    </Button>

      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settle Transaction</DialogTitle>
          <DialogDescription>
            Settle the transaction of ₹{Math.abs(txn.net)} using UPI.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
         
          <div className="grid gap-2">
            <Label className="mb-1">UPI ID : <strong>{upiID}</strong></Label>

            <a
                href={upiLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 mb-3 font-semibold hover:underline"
              >
                Pay ₹{Math.abs(txn.net)} via UPI
              </a> 
           
            <QRCodeSVG
        value={upiLink}
        
        fgColor="#000000"
        bgColor="#ffffff"
        level="H"
        className="w-full h-auto"
      />

          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button  ref={closeButtonRef} variant="outline">Cancel</Button>
          </DialogClose>
          <StateFullButton className="p-1.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 mb-5 hover:ring-0 rounded-lg" onClick={handleConfirm}>Payment Done </StateFullButton>
       
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}