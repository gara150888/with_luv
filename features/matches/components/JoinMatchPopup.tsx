'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Coins, Trophy, Ticket, Gift, Zap, CheckCircle2, Loader2 } from "lucide-react"
import { Match } from "../types"
import { getMatchTypeColor } from "../utils"

interface JoinMatchPopupProps {
    match: Match
    onClose: () => void
    onSuccess: () => void
}

export function JoinMatchPopup({ match, onClose, onSuccess }: JoinMatchPopupProps) {
    const [step, setStep] = useState<'confirm' | 'processing' | 'success'>('confirm')
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'wallet' | 'bonus'>('wallet')
    const [usePowerUp, setUsePowerUp] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleJoin = async () => {
        setStep('processing')
        setError(null)

        try {
            const totalAmount = usePowerUp ? match.join_fee * 2 : match.join_fee

            const response = await fetch('/api/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ matchId: match.id })
            })

            const data = await response.json()

            if (!data.success) {
                throw new Error(data.error || 'Failed to join match')
            }

            setStep('success')
            setTimeout(() => {
                onSuccess()
                onClose()
            }, 1500)
        } catch (err: any) {
            setError(err.message)
            setStep('confirm')
        }
    }

    const bonusAmount = 50
    const walletBalance = 250

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                {step === 'confirm' && (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-xl">
                                <Ticket className="w-5 h-5 text-primary" />
                                Join Match
                            </DialogTitle>
                            <DialogDescription>
                                Confirm your entry for {match.game?.game_name} - {match.match_type}
                            </DialogDescription>
                        </DialogHeader>

                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Entry Fee</span>
                                    <span className="text-lg font-bold flex items-center gap-1">
                                        <Coins className="w-4 h-4 text-amber-500" />
                                        {match.join_fee} coins
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Prize Pool</span>
                                    <span className="text-lg font-bold flex items-center gap-1">
                                        <Trophy className="w-4 h-4 text-amber-500" />
                                        {match.prize_pool} coins
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Match Type</span>
                                    <Badge className={getMatchTypeColor(match.match_type)}>
                                        {match.match_type}
                                    </Badge>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium">Payment Method</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setSelectedPaymentMethod('wallet')}
                                        className={`p-3 rounded-lg border-2 transition-all ${selectedPaymentMethod === 'wallet'
                                            ? 'border-primary bg-primary/10'
                                            : 'border-border hover:border-primary/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Coins className="w-4 h-4" />
                                            <span className="text-sm font-medium">Wallet</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Balance: {walletBalance} coins
                                        </p>
                                    </button>
                                    <button
                                        onClick={() => setSelectedPaymentMethod('bonus')}
                                        className={`p-3 rounded-lg border-2 transition-all ${selectedPaymentMethod === 'bonus'
                                            ? 'border-primary bg-primary/10'
                                            : 'border-border hover:border-primary/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Gift className="w-4 h-4 text-green-500" />
                                            <span className="text-sm font-medium">Bonus</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Available: {bonusAmount} coins
                                        </p>
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
                                <div className="flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-yellow-500" />
                                    <div>
                                        <p className="text-sm font-medium">Double Chance Power-up</p>
                                        <p className="text-xs text-muted-foreground">2x entry for double prize</p>
                                    </div>
                                </div>
                                <Button
                                    variant={usePowerUp ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setUsePowerUp(!usePowerUp)}
                                >
                                    {usePowerUp ? "Enabled" : "Enable"} (+{match.join_fee})
                                </Button>
                            </div>

                            <div className="border-t pt-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">Total to Pay</span>
                                    <span className="text-xl font-bold text-primary flex items-center gap-1">
                                        <Coins className="w-5 h-5" />
                                        {usePowerUp ? match.join_fee * 2 : match.join_fee} coins
                                    </span>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={onClose}>Cancel</Button>
                            <Button onClick={handleJoin} className="gap-2">
                                <Ticket className="w-4 h-4" />
                                Confirm
                            </Button>
                        </DialogFooter>
                    </>
                )}

                {step === 'processing' && (
                    <div className="py-8 text-center space-y-4">
                        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                        <p className="text-lg font-medium">Processing...</p>
                        <p className="text-sm text-muted-foreground">Confirming your participation</p>
                        <Progress value={45} className="w-full" />
                    </div>
                )}

                {step === 'success' && (
                    <div className="py-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                        </div>
                        <p className="text-xl font-bold">Joined Successfully!</p>
                        <p className="text-sm text-muted-foreground">You&apos;re registered. Good luck!</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
