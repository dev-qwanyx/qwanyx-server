'use client';

import { Card, CardHeader, CardTitle, CardContent, Heading, Text, Button, MaterialIcon, Input, Checkbox, Form, Field, Control } from '@qwanyx/ui';
import { useState } from 'react';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    companyName: 'QWANYX Corp',
    email: 'admin@qwanyx.com',
    phone: '+32 2 xxx xx xx',
    address: 'Boulevard Example 111, 1000 Brussels',
    notifications: {
      email: true,
      push: false,
      sms: true
    },
    security: {
      twoFactor: true,
      sessionTimeout: '30'
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Settings saved:', formData);
  };

  return (
    <div>
      <div className="qwanyx-mb-8">
        <Heading size="2xl">Paramètres</Heading>
        <Text className="qwanyx-mt-2" style={{ color: 'var(--qwanyx-text-secondary)' }}>
          Configurez les paramètres de votre application
        </Text>
      </div>

      <div className="qwanyx-space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Paramètres généraux</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="qwanyx-space-y-4">
              <Field>
                <Control>
                  <label className="qwanyx-text-sm qwanyx-font-medium">
                    Nom de l'entreprise
                  </label>
                  <Input
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  />
                </Control>
              </Field>

              <Field>
                <Control>
                  <label className="qwanyx-text-sm qwanyx-font-medium">
                    Email de contact
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </Control>
              </Field>

              <Field>
                <Control>
                  <label className="qwanyx-text-sm qwanyx-font-medium">
                    Téléphone
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </Control>
              </Field>

              <Field>
                <Control>
                  <label className="qwanyx-text-sm qwanyx-font-medium">
                    Adresse
                  </label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </Control>
              </Field>

              <Button type="submit">
                <MaterialIcon icon="Save" />
                Enregistrer les modifications
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="qwanyx-space-y-4">
              <div className="qwanyx-flex qwanyx-items-center qwanyx-justify-between">
                <div>
                  <Text weight="semibold">Notifications par email</Text>
                  <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                    Recevoir des notifications par email
                  </Text>
                </div>
                <Checkbox
                  checked={formData.notifications.email}
                  onCheckedChange={(checked) => 
                    setFormData({
                      ...formData, 
                      notifications: {...formData.notifications, email: checked as boolean}
                    })
                  }
                />
              </div>

              <div className="qwanyx-flex qwanyx-items-center qwanyx-justify-between">
                <div>
                  <Text weight="semibold">Notifications push</Text>
                  <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                    Recevoir des notifications push sur votre navigateur
                  </Text>
                </div>
                <Checkbox
                  checked={formData.notifications.push}
                  onCheckedChange={(checked) => 
                    setFormData({
                      ...formData, 
                      notifications: {...formData.notifications, push: checked as boolean}
                    })
                  }
                />
              </div>

              <div className="qwanyx-flex qwanyx-items-center qwanyx-justify-between">
                <div>
                  <Text weight="semibold">Notifications SMS</Text>
                  <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                    Recevoir des notifications par SMS
                  </Text>
                </div>
                <Checkbox
                  checked={formData.notifications.sms}
                  onCheckedChange={(checked) => 
                    setFormData({
                      ...formData, 
                      notifications: {...formData.notifications, sms: checked as boolean}
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle>Sécurité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="qwanyx-space-y-4">
              <div className="qwanyx-flex qwanyx-items-center qwanyx-justify-between">
                <div>
                  <Text weight="semibold">Authentification à deux facteurs</Text>
                  <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                    Ajouter une couche de sécurité supplémentaire
                  </Text>
                </div>
                <Checkbox
                  checked={formData.security.twoFactor}
                  onCheckedChange={(checked) => 
                    setFormData({
                      ...formData, 
                      security: {...formData.security, twoFactor: checked as boolean}
                    })
                  }
                />
              </div>

              <Field>
                <Control>
                  <label className="qwanyx-text-sm qwanyx-font-medium">
                    Timeout de session (minutes)
                  </label>
                  <Input
                    type="number"
                    value={formData.security.sessionTimeout}
                    onChange={(e) => 
                      setFormData({
                        ...formData, 
                        security: {...formData.security, sessionTimeout: e.target.value}
                      })
                    }
                  />
                </Control>
              </Field>

              <div className="qwanyx-flex qwanyx-gap-3">
                <Button variant="outline">
                  <MaterialIcon icon="Key" />
                  Changer le mot de passe
                </Button>
                <Button variant="outline">
                  <MaterialIcon icon="History" />
                  Voir l'historique des connexions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card>
          <CardHeader>
            <CardTitle style={{ color: 'var(--qwanyx-destructive)' }}>Zone dangereuse</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="qwanyx-space-y-4">
              <div>
                <Text weight="semibold">Supprimer le compte</Text>
                <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                  Une fois votre compte supprimé, toutes vos données seront définitivement effacées.
                </Text>
              </div>
              <Button variant="destructive">
                <MaterialIcon icon="Delete" />
                Supprimer le compte
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}