declare module 'react-simple-maps' {
  import * as React from 'react';
  
  interface ComposableMapProps {
    projection?: string;
    projectionConfig?: {
      scale?: number;
      center?: [number, number];
      rotate?: [number, number, number];
    };
    width?: number;
    height?: number;
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode;
  }
  
  interface GeographyProps {
    geography: any;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
    onMouseEnter?: (event: React.MouseEvent) => void;
    onMouseLeave?: (event: React.MouseEvent) => void;
    onClick?: (event: React.MouseEvent) => void;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
  }
  
  interface ZoomableGroupProps {
    zoom?: number;
    center?: [number, number];
    onMoveStart?: (event: React.MouseEvent) => void;
    onMoveEnd?: (position: { coordinates: [number, number]; zoom: number }) => void;
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode;
  }
  
  interface GeographiesProps {
    geography: string | object;
    children: (props: { geographies: any[] }) => React.ReactNode;
  }
  
  export const ComposableMap: React.FC<ComposableMapProps>;
  export const Geography: React.FC<GeographyProps>;
  export const ZoomableGroup: React.FC<ZoomableGroupProps>;
  export const Geographies: React.FC<GeographiesProps>;
}