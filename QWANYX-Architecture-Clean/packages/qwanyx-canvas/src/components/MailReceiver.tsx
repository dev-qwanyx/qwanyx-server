import React, { useState, useEffect } from 'react'
import {
  Button,
  Text,
  Card,
  CardContent,
  Flex,
  Badge,
  Icon,
  Field,
  Input
} from '@qwanyx/ui'

interface MailReceiverProps {
  mailConfig?: {
    imap?: {
      email: string
      server: string
      port: number
      password: string
    }
  }
  onMailReceived?: (mail: any) => void
  compact?: boolean
}

interface ReceivedMail {
  id: string
  from: string
  subject: string
  date: string
  body?: string
  read?: boolean
}

export const MailReceiver: React.FC<MailReceiverProps> = ({
  mailConfig,
  onMailReceived,
  compact = false
}) => {
  const [isChecking, setIsChecking] = useState(false)
  const [lastCheck, setLastCheck] = useState<Date | null>(null)
  const [mailCount, setMailCount] = useState(0)
  const [recentMails, setRecentMails] = useState<ReceivedMail[]>([])
  const [checkInterval, setCheckInterval] = useState(60) // seconds
  const [isAutoCheck, setIsAutoCheck] = useState(false)

  // Auto-check emails
  useEffect(() => {
    if (!isAutoCheck || !mailConfig?.imap?.password) return

    const interval = setInterval(() => {
      handleCheckMail()
    }, checkInterval * 1000)

    return () => clearInterval(interval)
  }, [isAutoCheck, checkInterval, mailConfig])

  const handleCheckMail = async () => {
    if (!mailConfig?.imap?.email || !mailConfig?.imap?.password) {
      console.warn('Mail configuration incomplete')
      return
    }

    setIsChecking(true)
    
    try {
      // TODO: Call API to check emails
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002'}/api/mail/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('autodin_token')}`
        },
        body: JSON.stringify({
          imap: mailConfig.imap
        })
      })

      if (response.ok) {
        const data = await response.json()
        setRecentMails(data.mails || [])
        setMailCount(data.count || 0)
        setLastCheck(new Date())
        
        // Notify parent of new mails
        if (data.mails && data.mails.length > 0 && onMailReceived) {
          data.mails.forEach((mail: ReceivedMail) => {
            onMailReceived(mail)
          })
        }
      }
    } catch (error) {
      console.error('Failed to check mail:', error)
    } finally {
      setIsChecking(false)
    }
  }

  if (compact) {
    return (
      <Card variant="glass" padding="sm" blur={true}>
        <CardContent noPadding>
          <Flex direction="col" gap="sm">
            <Flex align="center" justify="between">
              <Text size="sm" weight="semibold">Mail Receiver</Text>
              <Badge variant={isAutoCheck ? 'success' : 'default'}>
                {isAutoCheck ? 'Auto' : 'Manual'}
              </Badge>
            </Flex>

            {!mailConfig?.imap?.password ? (
              <Text size="xs" style={{ color: 'var(--qwanyx-warning)' }}>
                ⚠️ Configure mail settings first
              </Text>
            ) : (
              <>
                <Flex align="center" gap="sm">
                  <Button
                    size="sm"
                    variant={isAutoCheck ? 'outline' : 'primary'}
                    onClick={() => setIsAutoCheck(!isAutoCheck)}
                  >
                    <Icon name={isAutoCheck ? 'Pause' : 'PlayArrow'} size={16} />
                    {isAutoCheck ? 'Stop' : 'Start'}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCheckMail}
                    disabled={isChecking}
                  >
                    <Icon name="Refresh" size={16} />
                    Check Now
                  </Button>
                </Flex>

                <Field name="interval" label="Check every (seconds)">
                  <Input
                    type="number"
                    value={checkInterval.toString()}
                    onChange={(e) => setCheckInterval(parseInt(e.target.value) || 60)}
                    inputSize="sm"
                    min="10"
                    max="3600"
                  />
                </Field>

                <Flex direction="col" gap="xs">
                  <Text size="xs">
                    <strong>Status:</strong> {isChecking ? 'Checking...' : 'Idle'}
                  </Text>
                  {lastCheck && (
                    <Text size="xs">
                      <strong>Last check:</strong> {lastCheck.toLocaleTimeString()}
                    </Text>
                  )}
                  <Text size="xs">
                    <strong>Unread mails:</strong> {mailCount}
                  </Text>
                </Flex>

                {recentMails.length > 0 && (
                  <Flex direction="col" gap="xs">
                    <Text size="xs" weight="semibold">Recent:</Text>
                    {recentMails.slice(0, 3).map(mail => (
                      <Card key={mail.id} variant="outlined" padding="xs">
                        <Text size="xs" weight="semibold">{mail.from}</Text>
                        <Text size="xs">{mail.subject}</Text>
                      </Card>
                    ))}
                  </Flex>
                )}
              </>
            )}
          </Flex>
        </CardContent>
      </Card>
    )
  }

  // Full version
  return (
    <Card variant="elevated">
      <CardContent>
        <Flex direction="col" gap="md">
          <Text size="lg" weight="bold">Mail Receiver</Text>
          {/* Full implementation for standalone use */}
        </Flex>
      </CardContent>
    </Card>
  )
}