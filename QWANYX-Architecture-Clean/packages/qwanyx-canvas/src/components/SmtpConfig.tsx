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
  Field
} from '@qwanyx/ui'

interface SmtpConfigProps {
  initialConfig?: SmtpConfigData
  onSave?: (config: SmtpConfigData) => void
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

export const SmtpConfig: React.FC<SmtpConfigProps> = ({
  initialConfig,
  onSave,
  dhEmail = '',
  compact = false
}) => {
  const [config, setConfig] = useState<SmtpConfigData>({
    email: dhEmail || initialConfig?.email || '',
    server: initialConfig?.server || 'smtp.gmail.com',
    port: initialConfig?.port || 587,
    password: initialConfig?.password || '',
    secure: initialConfig?.secure ?? true
  })

  // Update email when dhEmail changes
  useEffect(() => {
    if (dhEmail && !config.email) {
      setConfig(prev => ({ ...prev, email: dhEmail }))
    }
  }, [dhEmail])

  // Auto-save whenever config changes
  const updateField = (field: keyof SmtpConfigData, value: any) => {
    const newConfig = { ...config, [field]: value }
    setConfig(newConfig)
    
    // Immediately notify parent of change
    if (onSave) {
      onSave(newConfig)
    }
  }

  if (compact) {
    // Compact version for use inside nodes
    return (
      <Card variant="filled" padding="sm">
        <CardContent noPadding>
          <Flex direction="col" gap="sm">
            <Text size="sm" weight="semibold">SMTP Configuration</Text>
            
            <Field name="email" label="Email">
              <Input
                type="email"
                value={config.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="dh@example.com"
                inputSize="sm"
              />
            </Field>

            <Field name="server" label="Server">
              <Input
                type="text"
                value={config.server}
                onChange={(e) => updateField('server', e.target.value)}
                placeholder="smtp.gmail.com"
                inputSize="sm"
              />
            </Field>

            <Flex gap="sm">
              <Field name="port" label="Port">
                <Input
                  type="number"
                  value={config.port.toString()}
                  onChange={(e) => updateField('port', parseInt(e.target.value) || 587)}
                  placeholder="587"
                  inputSize="sm"
                />
              </Field>

              <Field name="password" label="Password">
                <Input
                  type="password"
                  value={config.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder="••••••••"
                  inputSize="sm"
                />
              </Field>
            </Flex>

            {/* No save button - auto-saves on change */}
          </Flex>
        </CardContent>
      </Card>
    )
  }

  // Full version for standalone use
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>SMTP Configuration</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Flex direction="col" gap="md">
          <Field name="email" label="Email Address" required>
            <Input
              type="email"
              value={config.email}
              onChange={(e) => setConfig({ ...config, email: e.target.value })}
              placeholder="dh@example.com"
            />
          </Field>

          <Field name="server" label="SMTP Server" required>
            <Input
              type="text"
              value={config.server}
              onChange={(e) => setConfig({ ...config, server: e.target.value })}
              placeholder="smtp.gmail.com"
            />
          </Field>

          <Flex gap="md">
            <Field name="port" label="Port" required>
              <Input
                type="number"
                value={config.port.toString()}
                onChange={(e) => updateField('port', parseInt(e.target.value) || 587)}
                placeholder="587"
              />
            </Field>

            <Field name="password" label="Password" required>
              <Input
                type="password"
                value={config.password}
                onChange={(e) => updateField('password', e.target.value)}
                placeholder="••••••••"
              />
            </Field>
          </Flex>

          <Card variant="glass" padding="sm">
            <Text size="xs" weight="semibold">Common Ports:</Text>
            <Text size="xs">• 587 - TLS/STARTTLS (recommended)</Text>
            <Text size="xs">• 465 - SSL</Text>
            <Text size="xs">• 25 - Unencrypted (not recommended)</Text>
          </Card>
        </Flex>
      </CardContent>

      {/* No save button - auto-saves on change */}
    </Card>
  )
}