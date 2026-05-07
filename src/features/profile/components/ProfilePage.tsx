'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Mail, Camera, Pencil, User, Clock, Trophy } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage({ profile }: { profile: any }) {
    // const [profile, setProfile] = useState(profile);
    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState(null) as any;

    const displayName = profile.username || "User"
    const joinedDate = profile.createdAt
        ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : null

    return (
        <div className="flex flex-1 bg-background py-8 px-4">
            <div className="w-full xl:w-4xl mx-auto">
                {/* Main Card */}
                <div className="border rounded-2xl bg-card overflow-hidden shadow-sm">
                    {/* Banner */}
                    <div className="relative h-48 md:h-50 w-full bg-neutral-900 dark:bg-neutral-800 overflow-hidden">
                        {profile.banner_img ? (
                            <img
                                src={profile.banner_img}
                                alt="Banner"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                <Camera className="h-6 w-6 text-neutral-500" />
                            </div>
                        )}
                        <div className="absolute top-4 right-4">
                            <Link href={`/profile/edit`}>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="gap-1.5 h-8 text-xs bg-background/90 backdrop-blur-sm hover:bg-background border-0 shadow-sm"
                                >
                                    <Pencil className="h-3 w-3" />
                                    Edit
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Avatar */}
                    <div className="relative flex justify-center -mt-20">
                        <Avatar className="h-30 w-30 border-4 border-background shadow-md">
                            {profile.avatar_img ? (
                                <AvatarImage src={profile.avatar_img} alt={displayName} className="object-cover" />
                            ) : (
                                <AvatarFallback className="bg-muted text-muted-foreground text-lg font-medium">
                                    {displayName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            )}
                        </Avatar>
                    </div>

                    {/* Name & Bio */}
                    <div className="text-center mt-3 pb-6 px-6">
                        <div className="flex items-center justify-center gap-2">
                            <h1 className="text-lg font-semibold text-foreground">
                                {displayName}
                            </h1>
                            <Badge variant="secondary" className="text-[10px] h-5">Member</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            {profile.bio || "No bio added yet"}
                        </p>
                    </div>

                </div>

                {/* General Tab Content */}
                <div className="mt-6 border rounded-2xl bg-card p-6 shadow-sm space-y-6">
                    {/* About */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" />
                            About
                        </h3>
                        {profile.bio ? (
                            <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">No bio added yet. Click Edit to add one.</p>
                        )}
                    </div>

                    <div className="h-px bg-border" />

                    {/* Information */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            Information
                        </h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {joinedDate && (
                                <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-muted/50">
                                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Joined</p>
                                        <p className="font-medium text-foreground">{joinedDate}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-muted/50">
                                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Username</p>
                                    <p className="font-medium text-foreground">{displayName}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-muted/50">
                                <Trophy className="h-4 w-4 text-amber-400 shrink-0" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Coins</p>
                                    <p className="font-medium text-foreground">{profile.coins || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
