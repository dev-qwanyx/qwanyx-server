'use client'

import React from 'react';

export interface DashboardAutodinProps {
  currentUser?: any;
  onBack?: () => void;
  onNavigate?: (page: string) => void;
}

const DashboardAutodin: React.FC<DashboardAutodinProps> = ({ 
  currentUser, 
  onNavigate
}) => {
  const dashboardItems = [
    {
      icon: 'fa-search',
      title: 'Recherche rapide',
      description: 'Trouvez des pièces parmi notre catalogue',
      color: '#E67E22',
      link: '/recherche'
    },
    {
      icon: 'fa-bullhorn',
      title: 'Demandes',
      description: 'Diffusez vos demandes de pièces chez nos partenaires',
      color: '#3498db',
      link: '/demandes'
    },
    {
      icon: 'fa-envelope',
      title: 'Messages',
      description: 'Consultez vos messages',
      color: '#9b59b6',
      link: '/messages'
    },
    {
      icon: 'fa-user',
      title: 'Mon profil',
      description: 'Modifiez vos informations',
      color: '#2C3E50',
      link: '/profil'
    },
    {
      icon: 'fa-car',
      title: 'Véhicules',
      description: 'Gérez vos véhicules',
      color: '#e74c3c',
      link: '/vehicules'
    },
    {
      icon: 'fa-chart-line',
      title: 'Statistiques',
      description: 'Suivez vos performances',
      color: '#27ae60',
      link: '/stats'
    }
  ];

  const stats = [
    { label: 'Demandes actives', value: '12', icon: 'fa-bullhorn', color: '#3498db' },
    { label: 'Messages non lus', value: '3', icon: 'fa-envelope', color: '#9b59b6' },
    { label: 'Vues cette semaine', value: '234', icon: 'fa-eye', color: '#27ae60' },
    { label: 'Favoris', value: '18', icon: 'fa-heart', color: '#e74c3c' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 pt-6 pb-4 text-gray-600">
          <a 
            href="/"
            className="text-autodin-primary hover:text-autodin-accent transition-colors"
          >
            <i className="fas fa-home mr-1"></i>
            Accueil
          </a>
          <i className="fas fa-chevron-right text-xs"></i>
          <span className="text-gray-700 font-medium">
            Tableau de bord
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-autodin-dark mb-2">
            Tableau de bord
          </h1>
          <p className="text-gray-600">
            Bienvenue, {currentUser?.firstName || currentUser?.email || 'Utilisateur'} !
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between"
            >
              <div>
                <p className="text-gray-600 text-sm mb-2">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-autodin-dark">
                  {stat.value}
                </p>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <i 
                  className={`fas ${stat.icon} text-xl`}
                  style={{ color: stat.color }}
                ></i>
              </div>
            </div>
          ))}
        </div>

        {/* Dashboard Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardItems.map((item, index) => (
            <div 
              key={index}
              onClick={() => {
                if (item.link === '/demandes' && onNavigate) {
                  onNavigate('demandes');
                }
              }}
              className="bg-autodin-dark rounded-lg shadow-lg cursor-pointer transition-all hover:scale-105 hover:shadow-xl aspect-square"
            >
              <div className="flex flex-col justify-center items-center h-full text-center p-8">
                <div 
                  className="text-5xl mb-4"
                  style={{ color: item.color }}
                >
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <h3 className="text-white text-xl font-semibold mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-sm">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardAutodin;