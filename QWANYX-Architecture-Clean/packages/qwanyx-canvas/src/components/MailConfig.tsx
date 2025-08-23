import React, { useState, useEffect } from 'react'
import {
  Button,
  Input,
  Text,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  Flex,
  Container,
  Field,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@qwanyx/ui'
import { Bag } from './Bag'

interface MailConfigProps {
  initialConfig?: MailConfigData
  onSave?: (config: MailConfigData) => void
  dhEmail?: string
  compact?: boolean
}

export interface SmtpConfigData {
  email: string
  server: string
  port: number
  password: string
  secure: boolean
}

export interface ImapConfigData {
  email: string
  server: string
  port: number
  password: string
  secure: boolean
}

export interface MailConfigData {
  smtp: SmtpConfigData
  imap: ImapConfigData
}

export const MailConfig: React.FC<MailConfigProps> = ({
  initialConfig,
  onSave,
  dhEmail = '',
  compact = false
}) => {
  // Stop propagation helper for inputs
  const stopPropagation = (e: any) => {
    e.stopPropagation()
  }

  const [config, setConfig] = useState<MailConfigData>({
    smtp: {
      email: dhEmail || initialConfig?.smtp?.email || '',
      server: initialConfig?.smtp?.server || 'mail.qwanyx.com',
      port: initialConfig?.smtp?.port || 587,
      password: initialConfig?.smtp?.password || '',
      secure: initialConfig?.smtp?.secure ?? true
    },
    imap: {
      email: dhEmail || initialConfig?.imap?.email || '',
      server: initialConfig?.imap?.server || 'mail.qwanyx.com', 
      port: initialConfig?.imap?.port || 993,
      password: initialConfig?.imap?.password || '',
      secure: initialConfig?.imap?.secure ?? true
    }
  })

  // Update email when dhEmail changes
  useEffect(() => {
    if (dhEmail && !config.smtp.email) {
      setConfig(prev => ({
        ...prev,
        smtp: { ...prev.smtp, email: dhEmail },
        imap: { ...prev.imap, email: dhEmail }
      }))
    }
  }, [dhEmail])

  // Auto-save whenever config changes
  const updateSmtpField = (field: keyof SmtpConfigData, value: any) => {
    const newConfig = {
      ...config,
      smtp: { ...config.smtp, [field]: value }
    }
    setConfig(newConfig)
    
    // Immediately notify parent of change
    if (onSave) {
      onSave(newConfig)
    }
  }

  const updateImapField = (field: keyof ImapConfigData, value: any) => {
    const newConfig = {
      ...config,
      imap: { ...config.imap, [field]: value }
    }
    setConfig(newConfig)
    
    // Immediately notify parent of change
    if (onSave) {
      onSave(newConfig)
    }
  }

  if (compact) {
    // Compact version for use inside nodes
    return (
      <Bag color="#d1d5db" opacity={0.9} blur={false} padding="sm">
        <CardContent noPadding>
          <Flex direction="col" gap="sm">
            <Tabs defaultValue="smtp">
              <TabsList>
                <TabsTrigger value="smtp">SMTP (Send)</TabsTrigger>
                <TabsTrigger value="imap">IMAP (Receive)</TabsTrigger>
              </TabsList>
              
              <TabsContent value="smtp">
                <Flex direction="col" gap="sm">
                  <Field name="smtp-email" label="Email">
                    <Input
                      type="email"
                      value={config.smtp.email}
                      onChange={(e) => updateSmtpField('email', e.target.value)}
                      onKeyDown={stopPropagation}
                      onKeyUp={stopPropagation}
                      placeholder="dh@example.com"
                      inputSize="sm"
                    />
                  </Field>

                  <Field name="smtp-server" label="SMTP Server">
                    <Input
                      type="text"
                      value={config.smtp.server}
                      onChange={(e) => updateSmtpField('server', e.target.value)}
                      placeholder="smtp.gmail.com"
                      inputSize="sm"
                    />
                  </Field>

                  <Field name="smtp-port" label="Port">
                    <Input
                      type="number"
                      value={config.smtp.port.toString()}
                      onChange={(e) => updateSmtpField('port', parseInt(e.target.value) || 587)}
                      placeholder="587"
                      inputSize="sm"
                    />
                  </Field>

                  <Field name="smtp-password" label="Password">
                    <Input
                      type="password"
                      value={config.smtp.password}
                      onChange={(e) => updateSmtpField('password', e.target.value)}
                      placeholder="••••••••"
                      inputSize="sm"
                    />
                  </Field>

                  <Text size="xs" style={{ color: '#6b7280' }}>
                    Common ports: 587 (TLS), 465 (SSL), 25 (Unencrypted)
                  </Text>
                </Flex>
              </TabsContent>
              
              <TabsContent value="imap">
                <Flex direction="col" gap="sm">
                  <Field name="imap-email" label="Email">
                    <Input
                      type="email"
                      value={config.imap.email}
                      onChange={(e) => updateImapField('email', e.target.value)}
                      placeholder="dh@example.com"
                      inputSize="sm"
                    />
                  </Field>

                  <Field name="imap-server" label="IMAP Server">
                    <Input
                      type="text"
                      value={config.imap.server}
                      onChange={(e) => updateImapField('server', e.target.value)}
                      placeholder="imap.gmail.com"
                      inputSize="sm"
                    />
                  </Field>

                  <Field name="imap-port" label="Port">
                    <Input
                      type="number"
                      value={config.imap.port.toString()}
                      onChange={(e) => updateImapField('port', parseInt(e.target.value) || 993)}
                      placeholder="993"
                      inputSize="sm"
                    />
                  </Field>

                  <Field name="imap-password" label="Password">
                    <Input
                      type="password"
                      value={config.imap.password}
                      onChange={(e) => updateImapField('password', e.target.value)}
                      placeholder="••••••••"
                      inputSize="sm"
                    />
                  </Field>

                  <Text size="xs" style={{ color: '#6b7280' }}>
                    Common ports: 993 (SSL), 143 (TLS/STARTTLS)
                  </Text>
                </Flex>
              </TabsContent>
            </Tabs>
            
            {/* NO save button - auto-saves on change */}
          </Flex>
        </CardContent>
      </Bag>
    )
  }

  // Full version for standalone use
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Mail Configuration</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="smtp">
          <TabsList>
            <TabsTrigger value="smtp">SMTP (Send Mail)</TabsTrigger>
            <TabsTrigger value="imap">IMAP (Receive Mail)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="smtp">
            <Flex direction="col" gap="md">
              <Field name="smtp-email" label="Email Address" required>
                <Input
                  type="email"
                  value={config.smtp.email}
                  onChange={(e) => updateSmtpField('email', e.target.value)}
                  placeholder="dh@example.com"
                />
              </Field>

              <Field name="smtp-server" label="SMTP Server" required>
                <Input
                  type="text"
                  value={config.smtp.server}
                  onChange={(e) => updateSmtpField('server', e.target.value)}
                  placeholder="smtp.gmail.com"
                />
              </Field>

              <Field name="smtp-port" label="Port" required>
                <Input
                  type="number"
                  value={config.smtp.port.toString()}
                  onChange={(e) => updateSmtpField('port', parseInt(e.target.value) || 587)}
                  placeholder="587"
                />
              </Field>

              <Field name="smtp-password" label="Password" required>
                <Input
                  type="password"
                  value={config.smtp.password}
                  onChange={(e) => updateSmtpField('password', e.target.value)}
                  placeholder="••••••••"
                />
              </Field>

              <Card variant="glass" padding="sm">
                <Text size="xs" weight="semibold">SMTP Port Guide:</Text>
                <Text size="xs">• 587 - TLS/STARTTLS (recommended)</Text>
                <Text size="xs">• 465 - SSL/TLS</Text>
                <Text size="xs">• 25 - Unencrypted (not recommended)</Text>
              </Card>
            </Flex>
          </TabsContent>
          
          <TabsContent value="imap">
            <Flex direction="col" gap="md">
              <Field name="imap-email" label="Email Address" required>
                <Input
                  type="email"
                  value={config.imap.email}
                  onChange={(e) => updateImapField('email', e.target.value)}
                  placeholder="dh@example.com"
                />
              </Field>

              <Field name="imap-server" label="IMAP Server" required>
                <Input
                  type="text"
                  value={config.imap.server}
                  onChange={(e) => updateImapField('server', e.target.value)}
                  placeholder="imap.gmail.com"
                />
              </Field>

              <Field name="imap-port" label="Port" required>
                <Input
                  type="number"
                  value={config.imap.port.toString()}
                  onChange={(e) => updateImapField('port', parseInt(e.target.value) || 993)}
                  placeholder="993"
                />
              </Field>

              <Field name="imap-password" label="Password" required>
                <Input
                  type="password"
                  value={config.imap.password}
                  onChange={(e) => updateImapField('password', e.target.value)}
                  placeholder="••••••••"
                />
              </Field>

              <Card variant="glass" padding="sm">
                <Text size="xs" weight="semibold">IMAP Port Guide:</Text>
                <Text size="xs">• 993 - SSL/TLS (recommended)</Text>
                <Text size="xs">• 143 - TLS/STARTTLS</Text>
              </Card>
            </Flex>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* NO save button - auto-saves on change */}
    </Card>
  )
}