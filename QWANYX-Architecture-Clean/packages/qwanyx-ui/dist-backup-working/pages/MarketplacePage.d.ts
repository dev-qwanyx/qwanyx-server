import { default as React } from 'react';
export interface MarketplaceItem {
    id: string;
    title: string;
    description: string;
    price: string;
    image?: string;
    category?: string;
    seller?: string;
    rating?: number;
    inStock?: boolean;
}
export interface MarketplacePageProps {
    navigation?: {
        title?: string;
        items?: Array<{
            label: string;
            href?: string;
        }>;
        actions?: React.ReactNode;
    };
    hero?: {
        title: string;
        subtitle?: string;
        searchPlaceholder?: string;
    };
    categories?: Array<{
        label: string;
        value: string;
        count?: number;
    }>;
    items?: MarketplaceItem[];
    filters?: {
        showSearch?: boolean;
        showCategories?: boolean;
        showPriceRange?: boolean;
        showSort?: boolean;
    };
}
export declare const MarketplacePage: React.FC<MarketplacePageProps>;
//# sourceMappingURL=MarketplacePage.d.ts.map