import { useMemo, useState } from 'react'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Button,
  Input,
  Badge,
  Icon,
  Avatar,
  Text
} from '@qwanyx/ui'
import { useUserManagement } from '../providers/UserManagementProvider'
import { User, UserRole, UserStatus } from '../types'
import { UserForm } from './UserForm'

export function UserList() {
  console.log('UserList component rendering')
  const {
    users,
    loading,
    error,
    selectedUsers,
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
    config,
    selectUser,
    unselectUser,
    selectAllUsers,
    unselectAllUsers,
    setPage,
    setPageSize,
    setSorting,
    addUser,
    editUser,
    deleteUser,
    deleteSelectedUsers
  } = useUserManagement()

  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('')
  const [statusFilter, setStatusFilter] = useState<UserStatus | ''>('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  
  console.log('UserList config:', config)
  console.log('config.allowEdit:', config.allowEdit)
  console.log('config.allowAdd:', config.allowAdd)

  const defaultColumns = useMemo(() => [
    {
      key: 'select',
      label: '',
      width: '40px',
      render: (_: any, user: User) => (
        <input
          type="checkbox"
          checked={selectedUsers.includes(user._id || user.id || '')}
          onChange={(e) => {
            const userId = user._id || user.id || ''
            if (e.target.checked) {
              selectUser(userId)
            } else {
              unselectUser(userId)
            }
          }}
          className="qwanyx-checkbox"
        />
      )
    },
    {
      key: 'user',
      label: 'Utilisateur',
      sortable: true,
      render: (_: any, user: User) => (
        <div className="qwanyx-flex qwanyx-items-center qwanyx-gap-3">
          <Avatar
            src={user.avatar}
            alt={user.name || user.email}
            size="sm"
          />
          <div>
            <Text className="qwanyx-font-medium">
              {user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email}
            </Text>
            <Text size="sm" color="muted">{user.email}</Text>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Rôle',
      sortable: true,
      render: (_: any, user: User) => {
        const roleColors: Record<string, string> = {
          admin: 'error',
          moderator: 'warning',
          user: 'primary',
          viewer: 'secondary'
        }
        return (
          <Badge variant={roleColors[user.role || 'user'] as any || 'secondary'}>
            {user.role || 'user'}
          </Badge>
        )
      }
    },
    {
      key: 'status',
      label: 'Statut',
      sortable: true,
      render: (_: any, user: User) => {
        const statusColors: Record<UserStatus, string> = {
          active: 'success',
          inactive: 'secondary',
          suspended: 'error',
          pending: 'warning'
        }
        const status = user.status || 'active'
        return (
          <Badge variant={statusColors[status] as any}>
            {status}
          </Badge>
        )
      }
    },
    {
      key: 'createdAt',
      label: 'Date de création',
      sortable: true,
      render: (value: any) => {
        if (!value) return '-'
        const date = new Date(value)
        return date.toLocaleDateString('fr-FR')
      }
    },
    {
      key: 'lastLogin',
      label: 'Dernière connexion',
      sortable: true,
      render: (value: any) => {
        if (!value) return 'Jamais'
        const date = new Date(value)
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        
        if (days === 0) return 'Aujourd\'hui'
        if (days === 1) return 'Hier'
        if (days < 7) return `Il y a ${days} jours`
        if (days < 30) return `Il y a ${Math.floor(days / 7)} semaines`
        return `Il y a ${Math.floor(days / 30)} mois`
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '120px',
      render: (_: any, user: User) => (
        <div className="qwanyx-flex qwanyx-gap-2">
          {config.allowEdit !== false && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                console.log('Edit clicked for user:', user)
                setEditingUser(user)
                setIsFormOpen(true)
                console.log('Form should open, isFormOpen will be:', true)
              }}
            >
              <Icon name="edit" size="sm" />
            </Button>
          )}
          {config.allowDelete !== false && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                if (confirm(`Êtes-vous sûr de vouloir supprimer ${user.email} ?`)) {
                  deleteUser(user._id || user.id || '')
                }
              }}
            >
              <Icon name="delete" size="sm" color="error" />
            </Button>
          )}
        </div>
      )
    }
  ], [selectedUsers, selectUser, unselectUser, config, deleteUser, setEditingUser, setIsFormOpen])

  const columns = config.columns || defaultColumns

  const filteredUsers = useMemo(() => {
    let filtered = [...users]

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    if (statusFilter) {
      filtered = filtered.filter(user => (user.status || 'active') === statusFilter)
    }

    if (sortBy) {
      filtered.sort((a, b) => {
        const aVal = (a as any)[sortBy]
        const bVal = (b as any)[sortBy]
        
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [users, searchTerm, roleFilter, statusFilter, sortBy, sortOrder])

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    return filteredUsers.slice(start, end)
  }, [filteredUsers, currentPage, pageSize])

  const totalPages = Math.ceil(filteredUsers.length / pageSize)

  if (loading) {
    return (
      <Card>
        <CardContent>
          <div className="qwanyx-flex qwanyx-justify-center qwanyx-py-8">
            <Icon name="refresh" size="lg" className="qwanyx-icon-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <div className="qwanyx-text-center qwanyx-py-8">
            <Icon name="error" size="xl" color="error" />
            <Text color="error" className="qwanyx-mt-2">{error}</Text>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>Gestion des utilisateurs</CardTitle>
        <div className="qwanyx-flex qwanyx-gap-2">
          {selectedUsers.length > 0 && (
            <>
              <Badge>{selectedUsers.length} sélectionné(s)</Badge>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  if (confirm(`Supprimer ${selectedUsers.length} utilisateur(s) ?`)) {
                    deleteSelectedUsers()
                  }
                }}
              >
                <Icon name="delete" size="sm" />
                Supprimer
              </Button>
            </>
          )}
          {config.allowAdd !== false && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                console.log('Add user clicked')
                setEditingUser(null)
                setIsFormOpen(true)
                console.log('Form should open for add, isFormOpen will be:', true)
              }}
            >
              <Icon name="person_add" size="sm" />
              Ajouter un utilisateur
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="qwanyx-mb-4 qwanyx-flex qwanyx-gap-3">
          <Input
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="qwanyx-flex-1"
          />
          <select className="qwanyx-input"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole)}
          >
            <option value="">Tous les rôles</option>
            <option value="admin">Admin</option>
            <option value="moderator">Modérateur</option>
            <option value="user">Utilisateur</option>
            <option value="viewer">Observateur</option>
          </select>
          <select className="qwanyx-input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as UserStatus)}
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="suspended">Suspendu</option>
            <option value="pending">En attente</option>
          </select>
        </div>

        <div className="qwanyx-overflow-x-auto">
          <table className="qwanyx-table qwanyx-w-full">
            <thead>
              <tr>
                <th className="qwanyx-p-2">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        selectAllUsers()
                      } else {
                        unselectAllUsers()
                      }
                    }}
                    className="qwanyx-checkbox"
                  />
                </th>
                {columns.filter(col => col.key !== 'select').map(column => (
                  <th
                    key={column.key}
                    className={`qwanyx-p-2 qwanyx-text-left ${column.sortable ? 'qwanyx-cursor-pointer' : ''}`}
                    style={{ width: column.width }}
                    onClick={() => {
                      if (column.sortable) {
                        setSorting(
                          column.key,
                          sortBy === column.key && sortOrder === 'asc' ? 'desc' : 'asc'
                        )
                      }
                    }}
                  >
                    <div className="qwanyx-flex qwanyx-items-center qwanyx-gap-1">
                      {column.label}
                      {column.sortable && (
                        <Icon
                          name={sortBy === column.key ? (sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more'}
                          size="xs"
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map(user => (
                <tr key={user._id || user.id} className="qwanyx-border-t">
                  {columns.map(column => (
                    <td key={column.key} className="qwanyx-p-2">
                      {column.render ? column.render((user as any)[column.key], user) : (user as any)[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="qwanyx-text-center qwanyx-py-8">
                    <Text color="muted">Aucun utilisateur trouvé</Text>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="qwanyx-mt-4 qwanyx-flex qwanyx-justify-between qwanyx-items-center">
            <div className="qwanyx-flex qwanyx-gap-2">
              <select className="qwanyx-input"
                value={pageSize.toString()}
                onChange={(e) => setPageSize(parseInt(e.target.value))}
              >
                <option value="10">10 par page</option>
                <option value="25">25 par page</option>
                <option value="50">50 par page</option>
                <option value="100">100 par page</option>
              </select>
              <Text size="sm" color="muted">
                {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredUsers.length)} sur {filteredUsers.length}
              </Text>
            </div>
            <div className="qwanyx-flex qwanyx-gap-2">
              <Button
                size="sm"
                variant="ghost"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
              >
                <Icon name="chevron_left" size="sm" />
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i + 1
                if (totalPages > 5) {
                  if (currentPage > 3) {
                    pageNum = currentPage - 2 + i
                  }
                  if (currentPage > totalPages - 3) {
                    pageNum = totalPages - 4 + i
                  }
                }
                return (
                  <Button
                    key={pageNum}
                    size="sm"
                    variant={pageNum === currentPage ? 'primary' : 'ghost'}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              })}
              <Button
                size="sm"
                variant="ghost"
                disabled={currentPage === totalPages}
                onClick={() => setPage(currentPage + 1)}
              >
                <Icon name="chevron_right" size="sm" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
    
    <UserForm
      isOpen={isFormOpen}
      onClose={() => {
        setIsFormOpen(false)
        setEditingUser(null)
      }}
      user={editingUser}
      mode={editingUser ? 'edit' : 'add'}
      onSubmit={async (userData) => {
        if (editingUser) {
          await editUser({ ...editingUser, ...userData })
        } else {
          await addUser(userData)
        }
      }}
    />
  </>
  )
}